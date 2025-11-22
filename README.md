# Eureky Backend API

API REST para gestión de proyectos y tareas con autenticación JWT.

## 🚀 Stack

Node.js + TypeScript + Express + MongoDB + JWT

## 📦 Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev

# El servidor correrá en http://localhost:4003
```

## 🔐 Variables de Entorno

⚠️ **NOTA DE SEGURIDAD**: Las variables de entorno están incluidas en el repositorio (archivo `.env`) únicamente porque este es un proyecto de prueba/desarrollo. En un entorno de producción, estas credenciales NUNCA deben estar en el repositorio y deben protegerse adecuadamente usando servicios como AWS Secrets Manager, Azure Key Vault, variables de entorno del servidor, etc.

El archivo `.env` contiene:
- `MONGODB_URI`: Conexión a MongoDB Atlas (base de datos en la nube)
- `PORT`: Puerto del servidor (4003)
- `JWT_SECRET`: Clave secreta para tokens JWT
- `JWT_EXPIRES_IN`: Tiempo de expiración del token (7d)

## 📚 API Endpoints

### Autenticación

- **POST** `/api/auth/register` - Registrar usuario
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "user"
  }
  ```

- **POST** `/api/auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/profile` - Obtener perfil (requiere token)

### Proyectos

- **POST** `/api/projects` - Crear proyecto
  ```json
  {
    "name": "Mi Proyecto",
    "description": "Descripción del proyecto",
    "status": "active"
  }
  ```

- **GET** `/api/projects` - Listar proyectos del usuario
- **GET** `/api/projects/:id` - Obtener proyecto con sus tareas
- **PUT** `/api/projects/:id` - Actualizar proyecto
- **DELETE** `/api/projects/:id` - Eliminar proyecto y sus tareas

### Tareas

- **POST** `/api/tasks` - Crear tarea
  ```json
  {
    "name": "Mi Tarea",
    "description": "Descripción de la tarea",
    "projectId": "project_id_here",
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-12-31"
  }
  ```

- **GET** `/api/tasks/project/:projectId` - Listar tareas de un proyecto
- **GET** `/api/tasks/:id` - Obtener tarea
- **PUT** `/api/tasks/:id` - Actualizar tarea
- **DELETE** `/api/tasks/:id` - Eliminar tarea

## 🔐 Autenticación

Todos los endpoints (excepto register y login) requieren el header:

```
Authorization: Bearer <token>
```

## 📊 Modelos

### User
- `email` - Email único
- `password` - Contraseña hasheada
- `name` - Nombre
- `role` - 'user' | 'admin'

### Project
- `name` - Nombre del proyecto
- `description` - Descripción
- `userId` - Usuario propietario
- `status` - 'active' | 'archived' | 'completed'

### Task
- `name` - Nombre de la tarea
- `description` - Descripción
- `projectId` - Proyecto asociado
- `status` - 'todo' | 'in-progress' | 'done'
- `priority` - 'low' | 'medium' | 'high'
- `dueDate` - Fecha límite

## 🛠️ Estructura del Proyecto

```
src/
├── config/
│   └── database.ts      # Configuración MongoDB
├── controllers/
│   ├── authController.ts
│   ├── projectController.ts
│   └── taskController.ts
├── middleware/
│   └── auth.ts          # Middleware JWT
├── models/
│   ├── User.ts
│   ├── Project.ts
│   └── Task.ts
├── routes/
│   ├── authRoutes.ts
│   ├── projectRoutes.ts
│   └── taskRoutes.ts
├── app.ts               # Configuración Express
└── server.ts            # Punto de entrada
```
