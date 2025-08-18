'use client'

import { useRoom, useSelf } from "@liveblocks/react/suspense"
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useTheme } from "next-themes";
import {BlockNoteView} from "@blocknote/shadcn"
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css"
import "@blocknote/shadcn/style.css"
import stringToColor from "@/lib/stringToColor";
import TranslateDocument from "./TranslateDocument";
import ChatToDocument from "./ChatToDocument";

type EditorProps = {
    doc: Y.Doc;
    provider: LiveblocksYjsProvider;
}

function BlockNote({doc, provider}: EditorProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const userInfo = useSelf((me)=> me.info);
    const editor: BlockNoteEditor = useCreateBlockNote({
        collaboration:{
            provider,
            fragment: doc.getXmlFragment("document-store"),
            user:{
                name: userInfo?.name,
                color: stringToColor(userInfo?.email)
            }
        }
    });
    const themeMode = (resolvedTheme === "dark") ? "dark" : "light";
  return (
    <div className="relative max-w-6xl mx-auto">
        <BlockNoteView
            className="min-h-screen"
            editor={editor}
            theme={mounted ? themeMode : "light"}
        />
    </div>
  )
}

function Editor() {
    const room = useRoom();
    const [doc, setDoc] = useState<Y.Doc>();
    const [provider,setProvider] = useState<LiveblocksYjsProvider>();

    useEffect(() => {
        const yDoc = new Y.Doc();
        const yprovider = new LiveblocksYjsProvider(room, yDoc);
        setDoc(yDoc);
        setProvider(yprovider);

        return () => {
            yDoc?.destroy();
            yprovider?.destroy();
        }
    }, [room])

    if(!doc || !provider){
        return null;
    }

  return (
    <div className="max-w-6xl mx-auto">
        <div className="flex justify-end gap-2 items-center mb-10">
            {/* Translate document AI */}
            <TranslateDocument doc={doc}/>
            {/* Chat to document AI */}
            <ChatToDocument doc={doc}/>
        </div>

        {/* BlockNote */}
        <BlockNote doc={doc} provider={provider}/>
    </div>
  )
}
export default Editor