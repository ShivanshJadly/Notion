import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore"

function SidebarOption({href, id}: {href: string, id: string}) {
    const [data] = useDocumentData(doc(db,"documents",id));
    const pathname = usePathname();
    const isActive = href.includes(pathname) && pathname !== "/";

    if(!data) return null;

  return (
    <Link href={href} className={`border p-2 rounded-md ${isActive ? "bg-gray-300 font-bold border-black dark:bg-blue-950" : "border-gray-400 dark:bg-black"}`}>
        <p className=" truncate ">{data.title}</p>
    </Link>
  )
}
export default SidebarOption