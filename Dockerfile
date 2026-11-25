FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY serve-3d.js index.html styles.css app.js vercel.json ./
COPY api ./api
COPY assets ./assets
ENV NODE_ENV=production
ENV PORT=4500
EXPOSE 4500
CMD ["node", "serve-3d.js"]
