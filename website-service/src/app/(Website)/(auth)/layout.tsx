import Image from "@/components/Image";
import { userIsConnected } from "@/lib/session";
import { redirect } from "next/navigation";

// =========================================================================================================================================

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await userIsConnected();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-dvh relative">
      {/* Content */}
      {children}
      {/* Background Image */}
      <Image
        className="object-cover"
        containerClassName="fixed inset-0 z-[-1] max-lg:hidden"
        src="/img/authentication.webp"
        alt="Image d'authentification"
        fill
        sizes="100vw"
        priority
      />
    </div>
  );
}

// =========================================================================================================================================
