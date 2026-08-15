import { NextResponse } from "next/server";

export function rateLimitedResponse() {
    return NextResponse.json(
        { error: "Too many requests, please try again shortly." },
        { status: 429 },
    );
}
