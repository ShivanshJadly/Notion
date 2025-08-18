'use client'
import * as Y from "yjs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { BotIcon, MessageCircleCode } from "lucide-react";
import Markdown from "react-markdown";


function ChatToDocument({ doc }: { doc: Y.Doc }) {
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [summary, setSummary] = useState("");
    const [question, setQuestion] = useState("");

    const handleAskQuestion = (e: FormEvent) => {
        e.preventDefault();
        setQuestion(input);
        startTransition(async () => {
            const documentData = doc.get("document-store").toJSON();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        documentData,
                        question:input
                    })
                }
            );
            try{
                if(res.ok){
                    const data = await res.json();
                    const message = data?.message ?? (typeof data === 'string' ? data : JSON.stringify(data));
                    setInput("");
                    setSummary(message || "");
                    toast.success("Question asked successfully!")
                }else{
                    const err = await res.json().catch(()=>null);
                    toast.error(err?.error ?? "Failed to get answer");
                }
            }catch(err: unknown){
                const message = err instanceof Error ? err.message : "Failed to get answer";
                toast.error(message);
            }

        });
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant={"outline"}>
                <DialogTrigger>
                    <MessageCircleCode className="mr-2"/>
                    Chat to Document
                </DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chat to the Document!</DialogTitle>
                    <DialogDescription>
                       Ask a question and chat to the document with AI.
                    </DialogDescription>
                    <hr className="mt-5"/>
                    {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
                </DialogHeader>

                {summary && (
                    <div className="flex flex-col items-start max-h-96 overflow-y-auto gap-2 p-5 bg-muted text-foreground border rounded-md">
                        <div className="flex items-center mb-2">
                            <BotIcon className="w-10 flex-shrink-0 text-primary mr-2" />
                            <p className="font-bold text-muted-foreground">
                                GPT {isPending ? "is thinking..." : "Says:"}
                            </p>
                        </div>
                        {isPending ? (
                            <p className="text-muted-foreground">Thinking...</p>
                        ) : (
                            <Markdown>{summary}</Markdown>
                        )}
                    </div>
                )}

                <form onSubmit={handleAskQuestion} className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="i.e what is this about?"
                        className="w-full"
                        value={input}
                        onChange={(e)=> setInput(e.target.value)}
                    />
                    <Button type="submit" disabled={!input || isPending} className="mt-5">
                        {isPending ? "Asking...": "Ask"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

    )
}
export default ChatToDocument