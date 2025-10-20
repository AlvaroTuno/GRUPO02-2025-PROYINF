# ---- Etapa de frontend (React) ----
FROM node:18

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de React
EXPOSE 3000

# Iniciar React (modo desarrollo)
CMD ["npm", "start"]
