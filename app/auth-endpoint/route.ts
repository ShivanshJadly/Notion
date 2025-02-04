import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    auth.protect();

    const { sessionClaims } = await auth();
    if (!sessionClaims || !sessionClaims.email) {
        return NextResponse.json(
            { message: "Unauthorized: No session or email found" },
            { status: 401 }
        );
    }

    const { room } = await req.json();
    if (!room) {
        return NextResponse.json(
            { message: "Bad Request: Room ID is required" },
            { status: 400 }
        );
    }

    const session = liveblocks.prepareSession(sessionClaims.email, {
        userInfo: {
            name: sessionClaims.fullName ?? "Unknown User",
            email: sessionClaims.email,
            avatar: sessionClaims.image ?? "",
        },
    });

    const usersInRoom = await adminDb
        .collectionGroup("rooms")
        .where("userId", "==", sessionClaims.email)
        .get();

    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    if (userInRoom && userInRoom.exists) {
        session.allow(room, session.FULL_ACCESS);
        const { body, status } = await session.authorize();
        return new Response(body, { status });
    } else {
        return NextResponse.json(
            { message: "You are not allowed to access this room" },
            { status: 403 }
        );
    }
}
