import { prismaClient } from "@/lib/db/db";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
// import { NextResponse } from "next/server";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        async signIn (params) {
            if(!params.user.email) return false;

            try {
                await prismaClient.user.create({
                    data: {
                        email: params.user.email,
                        provider: "Google"
                    }
                })
            } catch (error) {
                return false
            }
            return true
        }
    }
})

// const handler = () => {
//     return NextResponse.json({
//         message: "Hi :)"
//     })
// }

export { handler as GET, handler as POST }