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
RUN npm ci

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/public ./public

CMD npm start

FROM base as dev
ENV FUNCTION_NAME=transaction-monitoring-demo
ENV NODE_ENV=dev
ENV PORT=3000
ENV QUOTING=false
ENV APM_ACTIVE=false
ENV MAX_CPU=1

# REDIS
ENV REDIS_DB=0
ENV REDIS_AUTH=
ENV REDIS_SERVERS=[{"host":"redis", "port"=6379}]
ENV REDIS_IS_CLUSTER=false

# NATS
ENV SERVER_URL=nats:4222
ENV STARTUP_TYPE=nats
ENV PRODUCER_STREAM=event-director
ENV ACK_POLICY=Explicit
ENV PRODUCER_STORAGE=File
ENV PRODUCER_RETENTION_POLICY=Workqueue

# ARANGO
ENV PSEUDONYMS_DATABASE=pseudonyms
ENV PSEUDONYMS_DATABASE_URL=tcp://arango:8529
ENV PSEUDONYMS_DATABASE_USER=root
ENV PSEUDONYMS_DATABASE_PASSWORD=

ENV TRANSACTION_HISTORY_DATABASE=transactionHistory
ENV TRANSACTION_HISTORY_PAIN001_COLLECTION=transactionHistoryPain001
ENV TRANSACTION_HISTORY_PAIN013_COLLECTION=transactionHistoryPain013
ENV TRANSACTION_HISTORY_PACS008_COLLECTION=transactionHistoryPacs008
ENV TRANSACTION_HISTORY_PACS002_COLLECTION=transactionHistoryPacs002
ENV TRANSACTION_HISTORY_DATABASE_URL=tcp://arango:8529
ENV TRANSACTION_HISTORY_DATABASE_USER=root
ENV TRANSACTION_HISTORY_DATABASE_PASSWORD=
ENV CACHE_TTL=300
RUN yarn install --frozen-lockfile 
COPY . .
CMD yarn dev