# TODO: check image
FROM node:22-alpine

# Working directory in the container
WORKDIR /app

# copy the files to the image
# TODO: insert the correct path
# COPY package.json /app
# COPY package-lock.json /app
COPY . /app

# install dependencies
RUN npm i

# build the application
RUN npm run build

# expose the port
# TODO: chceck how this works with regards to the db
EXPOSE 3000

# start the application
CMD ["npm", "start"]