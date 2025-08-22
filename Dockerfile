FROM node:20-alpine

WORKDIR /ncsa_react_frontend

COPY package.json yarn.lock ./

RUN yarn install

COPY . . 

EXPOSE 5173

CMD ["sh","-lc","yarn install --frozen-lockfile && yarn dev --host 0.0.0.0"]