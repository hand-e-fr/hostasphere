FROM node:18-alpine AS builder
LABEL org.opencontainers.image.title="Frontend"
LABEL org.opencontainers.image.description="Frontend client of Hostasphere"
LABEL org.opencontainers.image.authors="Hand-e"
LABEL org.opencontainers.image.source='https://github.com/hand-e-fr/hostasphere'
LABEL org.opencontainers.image.url='https://github.com/hand-e-fr/hostasphere'

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start"]