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

      // router.push(`doc/${docId}`); ----> this is a relative path it means if i am on certain page and it has a route like (/doc/doc-1) than it will redirect to route that will look like (/doc/doc-1/doc/doc-2) which will give 404 if not exists.

      router.push(`dashboard/doc/${docId}`); // this will always route from the app route.
    })  
    } catch (error) {
      console.log("User is not logged in or signed up! Go sign up motherf****r");
    }
    
  }
  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending?"Creating...":"New Document"}
    </Button>
  )
}
export default NewDocumentButton