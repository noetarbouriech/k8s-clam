# ---------- Build Stage ----------
FROM rust:1.86-slim AS builder

RUN apt-get update && apt-get install -y pkg-config libssl-dev build-essential
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY . .
RUN cargo build --release

# ---------- Runtime Stage ----------
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/red_one .

EXPOSE 3000

CMD ["./red_one"]
    