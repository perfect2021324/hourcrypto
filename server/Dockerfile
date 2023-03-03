FROM node:14-alpine

WORKDIR /cryptofirst/server
COPY ./package.json .
RUN npm install

COPY . .
EXPOSE 3000/tcp
ENTRYPOINT [ "npm"]
CMD ["run", "start"]