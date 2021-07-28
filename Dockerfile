FROM alpine

# install node
RUN apk add nodejs npm bind-tools
# set working directory
WORKDIR /root/nsupdate-api
# copy project file
COPY ./package.json .
# install node packages
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --only=production && \
    npm cache verify
# copy app files
COPY ./config ./config
COPY ./app.js .
COPY ./router ./router
COPY ./controller ./controller
# application server port
EXPOSE 3000
# default run command
CMD [ "npm", "start" ]