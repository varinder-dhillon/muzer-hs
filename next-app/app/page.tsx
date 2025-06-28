"use client";

import { signIn, useSession } from "next-auth/react";



export default function Home() {
    const userSession = useSession();
    console.log("userSession >>", userSession)
    return (
        <div className="">
             <button onClick={() => signIn('google')}>Sign in with Google</button>
        </div>
    );
}
