import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../lib/auth";
import NewBoardForm from "./newForm";

export default async function BoardNewPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login?redirect=/board/new");
    }

    return <NewBoardForm />;
}


