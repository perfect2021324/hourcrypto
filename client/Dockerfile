FROM node:14-alpine

ENV NODE_ENV=development
WORKDIR /cryptofirst/client
COPY ./package.json .
RUN npm install

EXPOSE 4200/tcp
COPY . .
ENTRYPOINT [ "npm"]
CMD ["run", "start"]