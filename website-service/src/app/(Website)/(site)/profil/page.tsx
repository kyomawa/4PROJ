import { getConnectedUser } from "@/actions/user/action";
import { redirect } from "next/navigation";
import Profile from "./components/Profile";

// =============================================================================================

export default async function ProfilePage() {
  const result = await getConnectedUser();

  if (!result.success) {
    redirect("/connexion");
  }

  const { data } = result;

  return <Profile data={data} />;
}

// =============================================================================================
