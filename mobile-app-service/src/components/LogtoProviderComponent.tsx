import React, { ReactNode, useEffect, useState } from "react";
import { LogtoProvider } from "@logto/rn";
import { config } from "../lib/auth";
import { Platform } from "react-native";

type LogtoProviderComponentProps = {
  children: ReactNode;
};

export default function LogtoProviderComponent({ children }: LogtoProviderComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (Platform.OS === "web" && !isClient) {
    return <>{children}</>;
  }

  return <LogtoProvider config={config}>{children}</LogtoProvider>;
}
