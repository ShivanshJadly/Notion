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
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";

type Language =
    | "english"
    | "Spanish"
    | "portuguese"
    | "french"
    | "german"
    | "chinese"
    | "arabic"
    | "hindi"
    | "russian"
    | "japanese";

const languages: Language[] = [
    "english",
    "Spanish",
    "portuguese",
    "french",
    "german",
    "chinese",
    "arabic",
    "hindi",
    "russian",
    "japanese"
]

function TranslateDocument({ doc }: { doc: Y.Doc }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [language, setLanguage] = useState<string>("");
    const [summary, setSummary] = useState("");
    // const [question, setQuestion] = useState("");

    const handleAskQuestion = (e: FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const documentData = doc.get("document-store").toJSON();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        documentData,
                        targetLang:language
                    })
                }
            );
            try{
                if(res.ok){
                    const data = await res.json();
                    const translated = data?.translated_text ?? data?.text ?? (typeof data === 'string' ? data : JSON.stringify(data));
                    setSummary(translated || "");
                    toast.success("Translated Summary successfully!")
                }else{
                    const err = await res.json().catch(()=>null);
                    toast.error(err?.error ?? "Failed to translate");
                }
            }catch(err: unknown){
                const message = err instanceof Error ? err.message : "Failed to translate";
                toast.error(message);
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant={"outline"}>
                <DialogTrigger>
                    <LanguagesIcon />
                    Translate
                </DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Translate the Document</DialogTitle>
                    <DialogDescription>
                        Select a language and AI will translate a summary of the document in the selected language.
                    </DialogDescription>
                    <hr className="mt-5" />
                    {/* {question && <p className="mt-5 text-gray-500">Q: {question}</p>} */}
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
                    <Select
                        value={language}
                        onValueChange={(value) => setLanguage(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((language) => (
                                <SelectItem key={language} value={language}>
                                    {language.charAt(0).toUpperCase() + language.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="submit" disabled={!language || isPending} className="mt-5">
                        {isPending ? "Translating..." : "Translate"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default TranslateDocument