import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
// import { NextResponse } from "next/server";

const handler = NextAuth({
    providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
    ]
})

// const handler = () => {
//     return NextResponse.json({
//         message: "Hi :)"
//     })
// }

export { handler as GET, handler as POST }