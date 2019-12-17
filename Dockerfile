FROM node:11-alpine AS builder
# RUN apk add git
ARG BUILD_CONFIG=build
RUN echo ${BUILD_CONFIG}
WORKDIR /app
#COPY package.json yarn.lock ./
COPY . .
RUN yarn install --production
# build config build / build:dev
# RUN echo files inisde
# RUN ls ra-data-parse -al
RUN yarn run ${BUILD_CONFIG}

FROM nginx:1.17.5-alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build .
EXPOSE 80