# Original code from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:16-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .
RUN yarn add -D @swc/cli @swc/core

# SSR for now. will change to SSG when having perfomance problem
CMD ["yarn", "dev"]