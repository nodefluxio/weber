FROM node:16.13.0-buster-slim AS build
ENV BACKEND_URL=http://localhost:8080

WORKDIR /app
COPY package.json ./package-lock.json ./
RUN npm install

COPY . .
RUN npm install eslint-plugin-react --save-dev \
    && npm run build

FROM node:16.13.0-buster-slim AS runtime
ENV NODE_ENV production

WORKDIR /app

COPY --from=build /app/next.config.js next.config.js
COPY --from=build /app/public public
COPY --from=build /app/.next .next
COPY --from=build /app/package.json package.json
RUN npm install next

EXPOSE 3000
CMD ["npm", "run", "start"]