FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm install --production

EXPOSE 8080

CMD ["node", "dist/server.js"]
