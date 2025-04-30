FROM rust:1.86-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y pkg-config libssl-dev build-essential

RUN cargo init
COPY ./Cargo.* ./
RUN cargo fetch

COPY src/ src/
RUN cargo build --release

FROM debian:bookworm
WORKDIR /app

COPY --from=builder /app/target/release/red_one .

EXPOSE 3000

CMD ["./red_one"]
    