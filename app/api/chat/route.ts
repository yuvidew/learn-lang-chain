import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Missing Google API key." }, { status: 500 });
        }

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash", 
            apiKey,
            temperature: 0.7,
        });

        const msgs = [new HumanMessage(prompt)];

        const chain = model.pipe(new StringOutputParser());
        const stream = await chain.stream(msgs);

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    controller.enqueue(encoder.encode(chunk));
                }
                controller.close();
            },
        });

        return new Response(readable, {
            status: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    } catch (error) {
        console.error("Chat POST handler failed", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
