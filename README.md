## build
yarn install && yarn build

# build docker image
docker build -t parse-schema-import .

# publish docker image
docker push parse-schema-import