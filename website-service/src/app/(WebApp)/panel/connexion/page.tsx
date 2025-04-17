import Logo from "@/components/Logo";
import ForgetCredentials from "./_components/ForgetCredentials";
import EmployeeSignInForm from "./_components/EmployeeSignInForm";
import Image from "@/components/Image";
import { panelLoginMetadata } from "@/constants/metadata";

// =============================================================================================

export const metadata = panelLoginMetadata;

// =============================================================================================

export default function Page() {
  return (
    <div className="min-h-dvh relative">
      {/* Content */}
      <div className="bg-white lg:inset-y-4 lg:left-4 lg:fixed w-full lg:max-w-[50vw] 2xl:max-w-3xl rounded-2xl overflow-y-auto p-6">
        <div className="flex flex-col max-lg:min-h-[calc(100dvh-3rem)] lg:h-full gap-y-16 xs:gap-y-20 justify-center items-center">
          <Header />
          <EmployeeSignInForm />
          <ForgetCredentials />
        </div>
      </div>
      {/* Background Image */}
      <Image
        className="object-cover"
        containerClassName="fixed inset-0 z-[-1] max-lg:hidden"
        src="/img/admin-authentication.webp"
        alt="Image de l'un des hotels disponible chez akkorhotel"
        fill
        sizes="100vw"
        priority
      />
    </div>
  );
}

// =============================================================================================

function Header() {
  return (
    <div className="flex flex-col items-center gap-y-12">
      <Logo className="size-16" />
      {/* Title & Paragraph */}
      <div className="flex flex-col gap-y-2 items-center">
        <h1 className="text-4xl font-bold">Votre panel favori</h1>
        <p className="text-neutral-500 text-center">N&apos;oubliez pas de prendre des pauses.</p>
      </div>
    </div>
  );
}

// =============================================================================================
