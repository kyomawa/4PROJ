import Logo from "@/components/Logo";
import SwitchLink from "../_components/SwitchLink";
import ClientSignInForm from "./_components/ClientSignInForm";
import { loginMetadata } from "@/constants/metadata";

// =============================================================================================

export const metadata = loginMetadata;

// =============================================================================================

export default function Page() {
  return (
    <div className="bg-white lg:inset-y-4 lg:left-4 lg:fixed w-full p-6 lg:max-w-[50vw] 2xl:max-w-3xl rounded-2xl overflow-y-auto">
      <div className="flex flex-col h-full gap-y-16 xs:gap-y-20 justify-center items-center max-lg:min-h-[calc(100dvh-3rem)] lg:h-full">
        <Header />
        <ClientSignInForm />
        <SwitchLink sentence="Vous n'avez pas de compte ?" instruction="Créez en un" path="/inscription" />
      </div>
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
        <h1 className="text-4xl text-center font-bold">De retour chez vous</h1>
        <p className="text-neutral-500 text-center">Connectez-vous pour accéder à votre compte</p>
      </div>
    </div>
  );
}

// =============================================================================================
