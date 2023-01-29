FROM node:6.2.2-wheezy AS builder


# install Python2
## credit: https://github.com/Docker-Hub-frolvlad/docker-alpine-python2/blob/master/Dockerfile
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY package.json /app
COPY yarn.lock /app

## TODO: see if this way works. i think would need to replace npm install with yarn install
#FROM node:alpine
#
#RUN apk add --no-cache --virtual .gyp \
#        python \
#        make \
#        g++ \
#    && npm install \
#        [ your npm dependencies here ] \
#    && apk del .gyp
## second one below i modified (to layer it out incase issues during this testing
#RUN apk add --no-cache --virtual .gyp \
#        python2 \
#        make \
#        g++
#RUN npm install --legacy-peer-deps \
#        node-gyp
#RUN yarn install \
#    && apk del .gyp

#https://github.com/nodejs/docker-node/issues/384#issuecomment-353190422
# todo: find better solution
#RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python2
#RUN npm install --quiet node-gyp -g

# todo: this can't be necessary. node dockerhub says yarn is included in all, but maybe not images this old
RUN npm install -g yarn

# the below RUN yarn install was commented out as trying it above
#yarn –-network-timeout 100000 (in ms, so this is 100s)
RUN yarn install --network-timeout 100000

# this builds and launches a listening dev server (167.475 seconds)
#CMD yarn run dev
# this just builds for production
#CMD yarn run build
COPY . /app
RUN yarn run build
# todo: add script for running yarn run dev/build (dev for dev, build for production)
## -> https://stackoverflow.com/questions/60197212/calling-different-commands-in-dockerfiles-depending-on-environment

# todo: add thing for downloading SNPedia stuff (
#(Optional) Download latest data from SNPedia
#Snappy depends on data from SNPedia to work. A copy is included in the repo but may be out-of-date. To generate an updated copy, you need Python 3:
#
#cd scripts
#pip3 install -r < requirements.txt
#make

FROM nginx:1.23.3-alpine AS test

#WORKDIR /usr/share/nginx/html
RUN ls /usr/share/nginx/html
COPY --from=builder dist /usr/share/nginx/html

EXPOSE 80

# TODO: create build.sh script/modify existing makefile for running this in docker
