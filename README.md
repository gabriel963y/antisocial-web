# anti-social-web

[![Node](https://img.shields.io/badge/Node-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white)](https://mongoosejs.com)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black)](https://swagger.io)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)

Anti-social network. Red social con estetica retro inspirada en monitores CRT y displays de fosforo verde.

## Estructura

```
anti-social-web/
  api/        Express + Mongoose REST API
  client/     React + Vite + Tailwind CSS SPA
```

## Stack

### API
- Node.js + Express 5
- MongoDB + Mongoose
- Swagger (api-docs)
- Docker Compose (MongoDB + Mongo Express)

### Client
- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router 7
- React Hook Form + Zod
- Zustand
- Sonner (toasts)

## Inicio rapido

### Requisitos
- Node.js >= 22
- pnpm
- Docker

### Instalacion

```bash
# 1. Iniciar MongoDB
pnpm docker:up

# 2. Instalar dependencias
pnpm install

# 3. Crear archivo de entorno
cp api/.env.example api/.env

# 4. Iniciar API y cliente
pnpm dev
```

La API corre en `http://localhost:3000` y el cliente en `http://localhost:5173`.

Documentacion Swagger en `http://localhost:3000/api-docs`.

Mongo Express (interfaz de administracion de BD) en `http://localhost:8081`.

### Comandos individuales

```bash
pnpm dev:api        # API solo
pnpm dev:client     # Cliente solo
pnpm docker:down    # Detener MongoDB
```

## Variables de entorno

| Variable | Descripcion | Default |
|---|---|---|
| `PORT` | Puerto del servidor API | `3000` |
| `NODE_ENV` | Entorno | `development` |
| `MONGO_URI` | Conexion a MongoDB | `mongodb://root:admin@localhost:27017/anti-social?authSource=admin` |
| `VITE_API_URL` | URL base de la API (cliente) | `http://localhost:3000/api` |
