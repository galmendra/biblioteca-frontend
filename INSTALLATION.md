# Guía de Instalación y Configuración

## 📦 Instalación Completa del Sistema

### 1. Backend (Node.js + Express + MongoDB)

#### Prerrequisitos
- Node.js 18+
- MongoDB Atlas o MongoDB local
- npm o yarn

#### Pasos
```bash
# 1. Navegar al directorio del backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
cp .env.example .env

# 4. Configurar variables de entorno en .env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/biblioteca
SESSION_SECRET=tu_secreto_aqui
FRONTEND_URL=http://localhost:4200
PORT=3000

# 5. Ejecutar seed para datos de prueba
npm run seed

# 6. Iniciar servidor
npm start
```

El backend estará corriendo en `http://localhost:3000`

### 2. Frontend (Angular 20)

#### Prerrequisitos
- Node.js 18+
- npm 9+
- Angular CLI 20 (se instalará con las dependencias)

#### Pasos
```bash
# 1. Navegar al directorio del frontend
cd biblioteca-frontend

# 2. Instalar dependencias
npm install

# 3. Verificar configuración de API
# Editar src/environments/environment.ts si es necesario
# Por defecto apunta a: http://localhost:3000/api

# 4. Iniciar aplicación
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 🚀 Inicio Rápido

### Opción 1: Con scripts simultáneos

Si quieres ejecutar backend y frontend al mismo tiempo:

```bash
# En la raíz del proyecto (si tienes un package.json raíz)
npm run dev
```

O usa dos terminales:

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd biblioteca-frontend
npm start
```

## 🔐 Credenciales de Prueba

Después de ejecutar el seed del backend, usa estas credenciales:

**Administrador:**
- Email: `admin@biblioteca.com`
- Password: `123456`

**Estudiantes:**
- Email: `isidora@biblioteca.com` / Password: `123456`
- Email: `isabella@biblioteca.com` / Password: `123456`

## 🛠️ Comandos Útiles

### Backend
```bash
npm start          # Iniciar servidor
npm run dev        # Iniciar con nodemon (auto-reload)
npm run seed       # Poblar base de datos con datos de prueba
```

### Frontend
```bash
npm start          # Servidor de desarrollo (http://localhost:4200)
npm run build      # Build para producción
npm run watch      # Build incremental
npm test           # Ejecutar tests
```

## 📝 Configuración Adicional

### CORS
El backend ya está configurado para aceptar peticiones desde `http://localhost:4200`. Si cambias el puerto del frontend, actualiza el `FRONTEND_URL` en el `.env` del backend.

### Cookies y Sesiones
Las sesiones se manejan con cookies. Asegúrate de que:
- El backend y frontend estén en el mismo dominio (localhost)
- Las cookies estén habilitadas en el navegador
- No uses modo incógnito para pruebas

### MongoDB Atlas
Si usas MongoDB Atlas:
1. Crea un cluster gratuito
2. Añade tu IP a la whitelist
3. Crea un usuario de base de datos
4. Copia la connection string al `.env`

## 🐛 Solución de Problemas

### Error: Cannot connect to MongoDB
- Verifica que MongoDB esté corriendo (local) o que la connection string sea correcta (Atlas)
- Revisa que tu IP esté en la whitelist de MongoDB Atlas

### Error: CORS policy
- Verifica que `FRONTEND_URL` en el backend coincida con la URL del frontend
- Asegúrate de que el backend esté corriendo

### Error: Session not persisting
- Limpia las cookies del navegador
- Verifica la configuración de sesiones en el backend
- Asegúrate de usar `withCredentials: true` en las peticiones HTTP

### Puerto ya en uso
```bash
# Backend (3000)
lsof -ti:3000 | xargs kill -9

# Frontend (4200)
lsof -ti:4200 | xargs kill -9
```

## 🔄 Actualizar Dependencias

```bash
# Backend
cd backend
npm update

# Frontend
cd biblioteca-frontend
npm update
```

## 📚 Recursos Adicionales

- [Documentación de Angular](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com/docs)

## 🤝 Soporte

Si encuentras problemas:
1. Revisa los logs de la consola del navegador
2. Revisa los logs del servidor backend
3. Verifica que todas las dependencias estén instaladas
4. Asegúrate de estar usando las versiones correctas de Node.js y npm
