import { getConnectedUser } from "@/actions/user/action";
import { redirect } from "next/navigation";
import Profile from "./components/Profile";

// =============================================================================================

export default async function ProfilePage() {
  const { data, success } = await getConnectedUser();
  if (!success) {
    redirect("/connexion");
  }

  return <Profile data={data} />;
}

// =============================================================================================
