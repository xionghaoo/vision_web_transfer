#/bin/bash

if [[ $1 = '-prod' ]]; then
  echo "env = prod"
	npm run build:prod
else
  echo "env = dev"
	npm run build
fi

filename="dist.zip"
zip -q -r $filename ./dist
curl --form "file=@$filename" -X POST "http://ai.udicaria.com/deploy/vision_h5"