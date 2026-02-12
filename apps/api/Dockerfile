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
# Replace packageManager field so turbo detects yarn from yarn.lock
RUN sed -i 's/"packageManager": "bun[^"]*"/"packageManager": "yarn@1.22.19"/' package.json
RUN turbo prune api --docker

FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN bun install --ignore-scripts

# Build the project
COPY --from=builder /app/out/full/ .
# Generate Prisma client (skipped by --ignore-scripts)
RUN bunx prisma generate --schema=apps/api/prisma/schema.prisma
RUN bun run build --filter=api...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create uploads directory with correct ownership
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/api/package.json .
COPY --from=installer --chown=nextjs:nodejs /app/apps/api/dist ./dist
COPY --from=installer --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nextjs:nodejs /app/apps/api/prisma ./prisma
# Also copy sub-package node_modules if they exist (though usually hoisted)
# COPY --from=installer --chown=nextjs:nodejs /app/apps/api/node_modules ./node_modules

CMD ["bun", "dist/src/main"]
