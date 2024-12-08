#/bin/bash

HOST_PROD="https://ai.udicaria.com"
HOST_DEV="http://47.106.243.173:8007"
host=$HOST_DEV
if [[ $1 = '-prod' ]]; then
  echo "env = prod"
	npm run build:prod
	host=$HOST_PROD
else
  echo "env = dev"
	npm run build
fi

filename="dist.zip"
zip -q -r $filename ./dist
curl --form "file=@$filename" -X POST "${host}/deploy/vision_h5"