FROM node:22-bookworm-slim as base
WORKDIR /app
COPY package*.json ./
COPY yarn*.lock ./
EXPOSE 3000

FROM base as builder
WORKDIR /app
COPY . .
RUN yarn build

FROM base as production
WORKDIR /app

ENV NODE_ENV=prod
ENV NEXT_PUBLIC_TMS_SERVER_URL="http://localhost:5001"
ENV NEXT_PUBLIC_TMS_KEY="no_key_set"
ENV NEXT_PUBLIC_CMS_NATS_HOSTING="nats://localhost:4222"
ENV NEXT_PUBLIC_NATS_USERNAME="nats_username"
ENV NEXT_PUBLIC_NATS_PASSWORD="nats_password"
ENV NEXT_PUBLIC_ARANGO_DB_HOSTING="http://localhost:8529"
ENV NEXT_PUBLIC_DB_USER="root"
ENV NEXT_PUBLIC_DB_PASSWORD="root_password"
ENV NEXT_PUBLIC_DB_NAME="tms_db"
RUN npm ci

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/public ./public

CMD npm start

FROM base as dev
ENV NODE_ENV=dev
ENV NEXT_PUBLIC_TMS_SERVER_URL="http://localhost:5001"
ENV NEXT_PUBLIC_TMS_KEY="no_key_set"
ENV NEXT_PUBLIC_CMS_NATS_HOSTING="nats://localhost:4222"
ENV NEXT_PUBLIC_NATS_USERNAME="nats_username"
ENV NEXT_PUBLIC_NATS_PASSWORD="nats_password"
ENV NEXT_PUBLIC_ARANGO_DB_HOSTING="http://localhost:8529"
ENV NEXT_PUBLIC_DB_USER="root"
ENV NEXT_PUBLIC_DB_PASSWORD="root_password"
ENV NEXT_PUBLIC_DB_NAME="tms_db"
RUN yarn install --frozen-lockfile 
COPY . .
CMD yarn dev