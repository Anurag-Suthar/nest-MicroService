# Development Stage
FROM node:19-alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
# COPY .env ./

RUN npm install -g pnpm

COPY apps/auth apps/auth
COPY libs libs

RUN pnpm install -r

RUN cd  apps/auth && pnpm install

RUN pnpm run build auth

# Production Stage
FROM node:19-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
# COPY .env ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]
