# Sistema de Biblioteca - Frontend Angular 20

Frontend desarrollado en Angular 20 con Angular Material para el sistema de gestión de biblioteca.

## 🚀 Características

- ✅ **Autenticación**: Login y registro de usuarios
- 📚 **Gestión de Libros**: CRUD completo (solo administradores)
- 📖 **Catálogo**: Búsqueda y visualización de libros disponibles
- 🔖 **Préstamos**: Gestión de préstamos y devoluciones
- 👥 **Roles**: Administrador y Estudiante
- 🎨 **UI Moderna**: Angular Material con diseño responsivo
- 🔐 **Guards**: Protección de rutas basada en autenticación y roles

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm 9 o superior
- Backend ejecutándose en `http://localhost:3000`

## 🔧 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar la URL del backend (si es diferente):
Editar los servicios en `src/app/core/services/` y cambiar `apiUrl` si es necesario.

## 🏃‍♂️ Ejecución

### Modo Desarrollo
```bash
npm start
```
La aplicación estará disponible en `http://localhost:4200`

### Build para Producción
```bash
npm run build
```
Los archivos compilados estarán en `dist/biblioteca-frontend`

## 📁 Estructura del Proyecto

```
src/app/
├── auth/                    # Módulo de autenticación
│   ├── login/              # Componente de login
│   └── register/           # Componente de registro
├── books/                   # Módulo de libros
│   ├── books-list/         # Lista de libros
│   └── book-form/          # Formulario de libro
├── loans/                   # Módulo de préstamos
│   ├── loans-list/         # Lista de préstamos
│   └── loan-form/          # Formulario de préstamo
├── core/                    # Funcionalidad core
│   ├── guards/             # Guards de rutas
│   ├── models/             # Interfaces TypeScript
│   └── services/           # Servicios HTTP
└── shared/                  # Componentes compartidos
    └── navigation/         # Barra de navegación
```

## 👤 Usuarios de Prueba

Según el seed del backend:

**Administrador:**
- Email: `admin@biblioteca.com`
- Password: `123456`

**Estudiantes:**
- Email: `isidora@biblioteca.com`
- Password: `123456`

- Email: `isabella@biblioteca.com`
- Password: `123456`

## 🎯 Funcionalidades por Rol

### Administrador
- Ver, crear, editar y eliminar libros
- Ver todos los préstamos del sistema
- Crear nuevos préstamos
- Marcar préstamos como devueltos

### Estudiante
- Ver catálogo de libros
- Buscar libros por título
- Ver sus propios préstamos
- Ver estado de sus préstamos (activo, vencido, devuelto)

## 🔌 API Endpoints Utilizados

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Libros
- `GET /api/books` - Listar libros (con búsqueda)
- `GET /api/books/:id` - Obtener libro por ID
- `POST /api/books` - Crear libro (admin)
- `PUT /api/books/:id` - Actualizar libro (admin)
- `DELETE /api/books/:id` - Eliminar libro (admin)

### Préstamos
- `GET /api/loans` - Listar todos los préstamos (admin)
- `GET /api/loans/my` - Mis préstamos (autenticado)
- `POST /api/loans` - Crear préstamo (admin)
- `PUT /api/loans/:id/return` - Devolver préstamo (admin)

### Usuarios
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario por ID

## 🎨 Temas y Estilos

El proyecto utiliza Angular Material con el tema pre-construido `indigo-pink`. Para cambiar el tema, editar `angular.json` y `styles.css`.

## 🔒 Seguridad

- Las cookies de sesión se envían con `withCredentials: true`
- Los guards protegen las rutas según autenticación y roles
- Las acciones administrativas están restringidas en el frontend y backend

## 🐛 Solución de Problemas

### Error de CORS
Asegúrate de que el backend tenga configurado CORS correctamente:
```javascript
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

### Sesión no persiste
Verifica que las cookies estén habilitadas en el navegador y que el backend use:
```javascript
cookie: {
  httpOnly: true,
  sameSite: 'lax'
}
```

## 📦 Dependencias Principales

- `@angular/core`: ^20.0.0
- `@angular/material`: ^20.0.0
- `@angular/router`: ^20.0.0
- `@angular/forms`: ^20.0.0
- `rxjs`: ~7.8.0

## 🚀 Deploy

Para producción, asegúrate de:
1. Cambiar las URLs del API en los servicios
2. Configurar las variables de entorno
3. Build con `npm run build`
4. Servir los archivos estáticos de `dist/`

## 📝 Notas Adicionales

- Todas las fechas se formatean en español (dd/MM/yyyy)
- Los préstamos vencidos se marcan en rojo
- Los libros sin stock aparecen como "No disponible"
- La búsqueda de libros es en tiempo real
