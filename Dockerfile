FROM node:13.12.0-alpine as frontend
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY public ./public
COPY src ./src

ARG REACT_APP_BASE_URL
ENV REACT_APP_BASE_URL $REACT_APP_BASE_URL
RUN npm run build
# build output is in /app/build

FROM peaceiris/mdbook:v0.4.31 as rules
WORKDIR /app
COPY rules .
RUN mdbook build .
# build output is in /app/book

FROM nginx:stable-alpine-slim

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./server/src/routes/v1/index.html /app/index.html
COPY --from=rules /app/book /usr/share/nginx/html/rules
COPY --from=frontend /app/build /usr/share/nginx/html/

