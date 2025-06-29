import { prismaClient } from "@/lib/db/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createStreamSchema = z.object({
    creatorId: z.string().min(1, "User id is required"),
    url: z.string().min(1, "URL is required")
})

const YT_REGEX = new RegExp("https://www.youtube.com/watch?v=GhH1QWY6BDc");

export const Post = async (req: NextRequest) => {
    try {
        const data = createStreamSchema.parse(await req.json());
        const isYT = YT_REGEX.test(data.url);
        
        if(!isYT){
            return NextResponse.json({
                message: "Error while adding a stream"
            }, {
                status: 411
            })
        }

        const extractedId = data.url.split("?v=")[1];

        await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube"
            }
        })

    } catch (error) {
            return NextResponse.json({
                message: "Error while adding a stream"
            }, {
                status: 411
            })
    }
}