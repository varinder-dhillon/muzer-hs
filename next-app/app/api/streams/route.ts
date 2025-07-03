import { prismaClient } from "@/lib/db/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import youtubesearchapi from "youtube-search-api";
const fallbackImage = "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=";

const createStreamSchema = z.object({
    creatorId: z.string().min(1, "User id is required"),
    url: z.string().min(1, "URL is required")
})

const YT_REGEX = /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/;

export const POST = async (req: NextRequest) => {
    try {
        const data = createStreamSchema.parse(await req.json());
        const isYT = YT_REGEX.test(data.url);
        // console.log("req", req)
        if(!isYT){
            return NextResponse.json({
                message: "Youtube link is not valid"
            }, {
                status: 400
            })
        }

        const extractedId = data.url.split("?v=")[1];

        const videoDetail = await youtubesearchapi.GetVideoDetails(extractedId);
        const thumbnails = videoDetail.thumbnail.thumbnails;

        thumbnails.sort((a: {width: number}, b: {width: number}) => a.width > b.width ? 1 : -1);

        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",
                title: videoDetail.title ?? "Title not available",
                smallImg: thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url ?? fallbackImage,
                bigImg: thumbnails[thumbnails.length - 1].url ?? fallbackImage
            }
        })

        return NextResponse.json({
            message: 'Added stream',
            id: stream.id
        },{
            status: 201
        })

    } catch (error) {
            console.log(error)
            return NextResponse.json({
                message: "Error while adding a stream",
                error
            }, {
                status: 411
            })
    }
}

export const GET = async (req: NextRequest) => {
    const creatorId = req.nextUrl.searchParams.get("creatorId");

    if(!creatorId) NextResponse.json({
        message: "Creator id is not provided."
    })

    const streams = await prismaClient.stream.findMany({
        where: {
            userId: creatorId ?? ""
        }
    })

    NextResponse.json({
        message: "Success",
        streams
    })
}