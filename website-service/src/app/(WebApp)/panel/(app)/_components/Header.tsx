import { getConnectedEmployee } from "@/actions/user/action";
import Navbar from "./Navbar";
import { unauthorized } from "next/navigation";

// =============================================================================================

export default async function Header() {
  const { data, success } = await getConnectedEmployee();

  if (!success) {
    return unauthorized();
  }

  const { pseudo, img } = data;

  return <Navbar pseudo={pseudo} img={img} />;
}

// =============================================================================================
