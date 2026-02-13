FROM oven/bun:1-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Enable turbo and yarn globally
RUN bun add -g turbo yarn

FROM base AS builder
WORKDIR /app
COPY . .
# Generate yarn.lock to help turbo prune, as binary lockfiles (in bun) can be problematic in Docker
RUN bun install --yarn
# Remove bun.lockb so turbo uses yarn.lock
RUN rm -f bun.lockb
# Remove packageManager field so turbo detects yarn from yarn.lock
RUN sed -i 's/"packageManager": "bun[^"]*"/"packageManager": "yarn@1.22.19"/' package.json
RUN turbo prune life --docker

FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN bun install

# Build the project
COPY --from=builder /app/out/full/ .
# Set build-time env vars (NEXT_PUBLIC_* must be available at build time)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# Set NODE_OPTIONS directly (cross-env is not available in Docker)
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN bun run build --filter=life...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/life/next.config.ts .
COPY --from=installer --chown=nextjs:nodejs /app/apps/life/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/life/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/life/.next/static ./apps/life/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/life/public ./apps/life/public

CMD ["bun", "run", "apps/life/server.js"]
