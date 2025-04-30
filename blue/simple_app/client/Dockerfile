# Build step
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm install
COPY . .
RUN npm run build

# Run step
FROM node:18-alpine

WORKDIR /app
RUN npm install -g serve # simple static server
COPY --from=builder /app/dist .
EXPOSE 80

CMD ["serve", "-s", ".", "-l", "80"]
