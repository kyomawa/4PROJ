import { LogtoConfig } from "@logto/rn";

const logtoEndpoint = process.env.EXPO_PUBLIC_LOGTO_ENDPOINT;
const logtoAppId = process.env.EXPO_PUBLIC_LOGTO_APP_ID;

if (!logtoEndpoint) {
  throw new Error("Variable d'environnement LOGTO_ENDPOINT non définie dans le .env");
}

if (!logtoAppId) {
  throw new Error("Variable d'environnement LOGTO_MOBILE_APP_ID non définie dans le .env");
}

export const config: LogtoConfig = {
  endpoint: logtoEndpoint,
  appId: logtoAppId,
};
