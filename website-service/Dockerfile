FROM node:23-bookworm AS base
ARG DEBIAN_FRONTEND=noninteractive

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# ENV NEXT_TELEMETRY_DISABLED 1

USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
  libc6-dev \
  libvips-dev \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN chown node:node /app


FROM base AS builder
USER root

COPY --chown=node:node . .
USER node
RUN npm i

RUN yarn build

FROM base AS runner
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/node_modules/ ./node_modules/

USER node
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/app/node_modules/.bin
EXPOSE 3000
CMD ["node", "server.js"]
