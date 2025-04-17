import Logo from "@/components/Logo";
import Navbar from "./Navbar";
import { Link } from "next-view-transitions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import HeaderAvatar from "./HeaderAvatar";
import SidebarMobile from "./NavbarMobile";

// =========================================================================================================

export default async function Header() {
  const user = await getConnectedUser();
  const userIsConnected = user.success && user.data;

  return (
    <header className="p-4 flex justify-between items-center">
      <SidebarMobile />
      {/* Logo */}
      <div className={cn(!userIsConnected && "lg:min-w-[15.00875rem]", "max-md:hidden")}>
        <Logo isLink className="size-10" />
      </div>
      <Navbar />
      {userIsConnected ? <HeaderAvatar user={user.data} /> : <Buttons />}
    </header>
  );
}

// =========================================================================================================

function Buttons() {
  return (
    <div className="flex gap-x-2">
      <Link href="/inscription" className={cn(buttonVariants({ variant: "outline" }))}>
        S&apos;inscrire
      </Link>
      <Link href="/connexion" className={cn(buttonVariants({ variant: "default" }))}>
        Se Connecter
      </Link>
    </div>
  );
}

// =========================================================================================================
