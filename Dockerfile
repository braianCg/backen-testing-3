# ---- Stage 1: Build ----
# Usamos una imagen de Node para instalar dependencias y construir la app
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código de la aplicación
COPY . .


# ---- Stage 2: Production ----
# Usamos una imagen más ligera para producción
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiamos las dependencias y el código desde la etapa de 'builder'
COPY --from=builder /usr/src/app .

# Exponemos el puerto en el que corre la aplicación
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["node", "src/app.js"]