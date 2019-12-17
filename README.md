## build
yarn install && yarn build

# build docker image
docker build -t hub.i2r.work/parse-schema-import .

# publish docker image
docker push hub.i2r.work/parse-schema-import