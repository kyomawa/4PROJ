FROM node:23-alpine

WORKDIR /app

RUN npm install -g expo-cli eas-cli
RUN apk add --no-cache bash git wget

COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci --legacy-peer-deps

COPY . .

# Ligne optionnelle à supprimer si problème :
# RUN npx expo optimize --quiet

EXPOSE 8081 19000 19001
CMD ["npx", "expo", "start", "--tunnel", "--no-dev", "--minify"]
