FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production
ENV NEXT_PUBLIC_HS_REST_API_URL=http://localhost:8080

EXPOSE 3000

CMD ["npm", "run", "start"]