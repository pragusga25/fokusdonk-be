# Use Bun's official image as base
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Generate Prisma client
RUN bunx prisma generate


# Copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/prisma ./prisma
COPY --from=prerelease /usr/src/app/src ./src
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bunuser
USER bunuser

# Expose the port your app runs on
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Run database migrations and start the application
CMD ["sh", "-c", "bun run src/index.ts"]
