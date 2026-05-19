FROM node:24-bookworm-slim AS builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.0.9 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:24-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV DATABASE_PATH=/app/data/emdash.db
ENV UPLOADS_DIR=/app/data/uploads

RUN mkdir -p /app/data/uploads && chown -R node:node /app
COPY --from=builder --chown=node:node /app/dist ./dist

USER node
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
