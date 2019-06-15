FROM node:alpine

COPY . /app
WORKDIR /app

RUN yarn
CMD ["yarn", "start"]
