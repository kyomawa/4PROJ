import { getConnectedEmployee } from "@/actions/user/action";
import Navbar from "./Navbar";
import { unauthorized } from "next/navigation";

// =============================================================================================

export default async function Header() {
  const res = await getConnectedEmployee();

  if (!res.success) {
    return unauthorized();
  }
  const { username, img } = res.data;

  return <Navbar pseudo={username} img={(img as string) || undefined} />;
}

// =============================================================================================
