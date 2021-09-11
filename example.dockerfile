FROM node:latest As compile


WORKDIR /usr/src/app
COPY ./example/ .
COPY ./build ./build
RUN yarn
RUN ls

CMD ["./run.sh"]