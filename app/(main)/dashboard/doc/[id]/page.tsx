"use client";
import { useParams } from "next/navigation";
import Document from "@/components/Document";

export default function DocumentPage() {
  const params = useParams(); 

  if (!params?.id) {
    return <p className="text-center mt-5">Loading document...</p>; // Prevents errors
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={Array.isArray(params.id) ? params.id[0] : params.id} />
    </div>
  );
}
