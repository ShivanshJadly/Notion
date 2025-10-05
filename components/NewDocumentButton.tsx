'use client'
import { useRouter } from "next/navigation";
import { Button } from "./ui/button"
import { useTransition } from "react"
import { createNewDocument } from "@/actions/actions";

function NewDocumentButton() {
  const [isPending,startTransition] = useTransition();
  const router = useRouter();
  const handleCreateNewDocument = ()=>{
    try {
      startTransition(async ()=>{
      const {docId} =  await createNewDocument();

      router.push(`dashboard/doc/${docId}`);
    })  
    } catch (error) {
      console.log("User is not logged in or signed up!");
    }
    
  }
  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending?"Creating...":"New Document"}
    </Button>
  )
}
export default NewDocumentButton