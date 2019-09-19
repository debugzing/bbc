FROM node
EXPOSE 80
RUN mkdir /server
ADD be /server/be
ADD fe /server/fe
ADD bin /server/bin
ADD index.html main.js package.json /server/
RUN (cd /server; npm i)
ENV NODE_PATH /server/node_module
ENV APPDIR /server
ENV MONGODB mongodb://192.168.56.200/cncfdemo
ENTRYPOINT [ "node", "/server/bin/cncfdemo.js", "80" ]