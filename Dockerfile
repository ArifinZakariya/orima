FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --break-system-packages yt-dlp

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npx esbuild src/client.ts --bundle --minify --outfile=public/script.js

EXPOSE 3000
CMD ["npx", "tsx", "src/server.ts"]
