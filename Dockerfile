FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN npx prisma generate

RUN yarn build

EXPOSE 4000

CMD ["yarn", "start"]
