FROM node:18-alpine
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/

RUN npm install
RUN npm install react-scripts
RUN npm install nodemon --save-dev
COPY . ./

CMD ["nodemon", "--exec", "npm", "start"]