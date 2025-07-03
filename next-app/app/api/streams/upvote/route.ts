import { prismaClient } from "@/lib/db/db"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const UpvotesSchema = z.object({
    streamId: z.string(),
})


export const POST = async (req: NextRequest) => {
    const session = await getServerSession();

    if(!session?.user?.email){
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 401
        })
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: session.user.email ?? ""
        }
    })

    if(!user){
        return NextResponse.json({
            message: "Not able to find the user with the provided email"
        }, {
            status: 401
        })
    }

    try {
        const data = UpvotesSchema.parse(await req.json());
        await prismaClient.upvote.create({
            data: {
                userId: user?.id,
                streamId: data.streamId
            }
        })
        
    } catch (error) {
        return NextResponse.json({
            message: "Error while upvoting"
        }, {
            status: 401
        })
    }
}