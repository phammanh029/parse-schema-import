## build
yarn install && yarn build

# build docker image
docker build -t parse-schema-import .

# publish docker image
docker push parse-schema-import

# docker run
docker run --rm -it -p 8080:80 parse-schema-import
