FROM node:16-alpine
RUN apk add --no-cache libc6-compat

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn install

COPY . /app

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development
ENV PORT 3000

RUN yarn install

RUN yarn run build

CMD ["yarn", "dev"]