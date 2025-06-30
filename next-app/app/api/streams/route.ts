import { prismaClient } from "@/lib/db/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube"
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
                message: "Error while adding a stream"
            }, {
                status: 411
            })
    }
}