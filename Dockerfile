FROM node
RUN npm i -g nodemon
USER node
RUN mkdir /home/node/code
WORKDIR /home/node/code
COPY --chown=node:node package-lock.json package.json ./
RUN npm ci
COPY --chown=node:node . . 
EXPOSE 3000
CMD ["nodemon", "index.js"]
