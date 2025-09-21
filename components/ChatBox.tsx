"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader, Send } from "lucide-react"
import { useChat } from "@/hooks/use-chat";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { MarkdownComp } from "./MarkdownComp";

export const ChatBox = () => {
    const { onSubmit, loading, out } = useChat();
    const [value, setValue] = useState("");
    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader>
                    <CardTitle>Learn lang chain</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className=" flex flex-col gap-3.5">

                        <ScrollArea className=" h-56 w-full">
                            <MarkdownComp content={out} />
                        </ScrollArea>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    placeholder="Ask something..."
                                    required
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                                <Button variant={"outline"} onClick={() => onSubmit(value)}>
                                    {loading ? <Loader /> : <Send />}
                                </Button>
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
