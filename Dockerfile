# TODO: check image
FROM node:22-alpine

# Working directory in the container
WORKDIR /app
COPY . /app

# install dependencies
RUN npm i

# build-time values for Next.js
ARG NEXT_PUBLIC_BACKEND_ROOT
ARG NEXT_PUBLIC_PASSWORD_LENGTH
ENV NEXT_PUBLIC_BACKEND_ROOT=$NEXT_PUBLIC_BACKEND_ROOT
ENV NEXT_PUBLIC_PASSWORD_LENGTH=$NEXT_PUBLIC_PASSWORD_LENGTH

# build the application
RUN npm run build

# expose the port
EXPOSE 3000

# start the application
CMD ["npm", "start"]