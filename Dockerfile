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

ENV NODE_ENV=production
RUN npm ci

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/public ./public

CMD npm start

FROM base as dev
ENV NODE_ENV=development
RUN yarn install --frozen-lockfile 
COPY . .
CMD yarn dev