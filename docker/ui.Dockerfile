FROM ubuntu:bionic

RUN \
  apt-get update && \
  apt-get upgrade -y && \
  apt-get install -y curl build-essential nano netcat git

ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 14.17.0
ENV PATH=$PATH:/usr/local/go/bin:/root/.nvm/versions/node/v$NODE_VERSION/bin

# Install nvm, node, npm and yarn
RUN curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh | bash && \
  . $NVM_DIR/nvm.sh && \
  nvm install $NODE_VERSION && \
  npm install pm2@latest -g && \
  npm install --global yarn && \
  npm install --global pm2 && \
  mkdir -p /root/vor-ui/front && \
  mkdir -p /root/vor-ui/service

WORKDIR /root/vor-ui

COPY ./package.json ./package-lock.json ./

RUN cd /root/vor-ui && npm install

COPY ./.eslintrc.json ./.prettierrc.json ./.sequelizerc ./config-overrides.js ./
COPY ./front ./front/
COPY ./service ./service/
COPY ./docker/assets/.env ./.env

RUN npm run build
