FROM rust:1.67 AS builder

WORKDIR /app
RUN USER=root cargo new backend
WORKDIR /app/backend

# cache dependencies by compiling a dummy project
COPY Cargo.toml Cargo.lock ./
RUN cargo build --release
RUN rm src/*.rs

COPY ./src ./src

RUN rm ./target/release/deps/backend*
RUN cargo build --release

FROM debian:bullseye
WORKDIR /app

# install root certificates
RUN \
  apt-get update && \
  apt-get install -y ca-certificates && \
  apt-get clean

COPY --from=builder /app/backend/target/release/backend ./

# i wanted to put this in ../docker, but docker can't do that
COPY docker-start.sh ./
COPY *.yaml ./

CMD ["sh", "/app/docker-start.sh"]
