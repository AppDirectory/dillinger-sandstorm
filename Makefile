ROOT=$(pwd)

all:
	npm install && \
	cd node_modules/share && \
	npm install redis && \
	cd "${ROOT}" && \
	gulp build --prod
