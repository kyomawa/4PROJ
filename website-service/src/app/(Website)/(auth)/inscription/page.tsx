import Logo from "@/components/Logo";
import SwitchLink from "../_components/SwitchLink";
import ClientSignUpForm from "./_components/ClientSignUpForm";
import { registerMetadata } from "@/constants/metadata";

// =============================================================================================

export const metadata = registerMetadata;

// =============================================================================================

export default function Page() {
  return (
    <div className="bg-white lg:inset-y-4 lg:left-4 lg:fixed w-full lg:max-w-[50vw] 2xl:max-w-3xl rounded-2xl overflow-y-auto p-6">
      <div className="flex flex-col h-full gap-y-16 justify-between items-center max-lg:min-h-[calc(100dvh-3rem)]">
        <Header />
        <ClientSignUpForm />
        <SwitchLink sentence="Déjà un compte ?" instruction="Connectez-vous" path="/connexion" />
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
        <h1 className="text-4xl font-bold">Rejoignez-nous</h1>
        <p className="text-neutral-500 text-center">Remplissez les informations ci-dessous pour nous rejoindre.</p>
      </div>
    </div>
  );
}

// =============================================================================================
