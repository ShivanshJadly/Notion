'use client'

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input"
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

function Document({id}: {id: string}) {
    const [data] = useDocumentData(doc(db, "documents", id));
    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition();
    const isOwner = useOwner();

    useEffect(() => {
        if(data){
            setInput(data.title)
        }
    }, [data])


    const updateTitle = async (e: FormEvent) => {
        e.preventDefault();
        
        if(input.trim()){
            startTransition(async () => {
                // update title
                await updateDoc(doc(db, "documents", id), {
                    title: input
                })
            })
        }
    }
  return (
    <div className="flex-1 h-full p-5 dark:bg-black">

        <div className="flex max-w-6xl mx-auto justify-between pb-5">
            <form onSubmit={updateTitle} className="flex flex-1 space-x-2">
                {/* updating title... */}
                <Input 
                    placeholder="Document Title"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                 />

                 <Button disabled={isUpdating} type="submit">{isUpdating?"Updating...": "Update"}</Button>
                {/* if */}
                {isOwner && (
                    <>
                        {/* inviteUser */}
                        <InviteUser />
                        {/* deletedoc */}
                        <DeleteDocument/>
                    </>
                )}
                {/* isOwner && inviteUser, deleteDocument,  */}
            </form>
        </div>

        <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
            {/* Manage users  */}
            <ManageUsers />

            {/* avatars */}
            <Avatars/>
        </div>

        <hr className="pb-10"/>
        {/* collaborative editor  */}
        <Editor />
    </div>
  )
}
export default Document