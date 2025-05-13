# NexusAcademic - Sistema de Gestión Académica

## Integrantes
- David Donneys
- Jhonatan Castaño
- Andrés Pino 

## Descripción del Proyecto

NexusAcademic es una plataforma de gestión académica que permite la administración de cursos, estudiantes y profesores. El sistema está construido utilizando Next.js para el frontend y una API RESTful para el backend, con una base de datos PostgreSQL para la persistencia de datos.

## Requisitos Previos

- Node.js (v18 o superior)
- Docker y Docker Compose
- npm o yarn

## Instalación y Configuración

1. Clonar el repositorio:
```bash
git clone https://github.com/Dantesiio/NexusAcademic.git
cd NexusAcademic
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto
   - Copiar el contenido de `.env.example` y configurar las variables necesarias:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nexusacademic
DB_USERNAME=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET="prueba"

# Puerto de la aplicación
PORT=3000
```

4. Iniciar la base de datos con Docker Compose:
```bash
# Iniciar los servicios
docker-compose up -d

# Verificar que los contenedores estén corriendo
docker-compose ps
```

5. La base de datos se inicializará automáticamente:
   - TypeORM está configurado con `synchronize: true` en desarrollo
   - Las entidades se crearán automáticamente en la base de datos

6. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

## Funcionalidades Implementadas

### 1. Autenticación y Autorización

- **Sistema de Login**: Implementado utilizando JWT
  - Autenticación basada en credenciales (email/contraseña)
  - Manejo de sesiones seguras
  - Protección de rutas según rol de usuario

### 2. Gestión de Usuarios

- Registro de nuevos usuarios
- Roles diferenciados (Administrador, Profesor, Estudiante)
- Gestión de perfiles de usuario

### 3. Gestión Académica

- **Cursos**:
  - Creación y edición de cursos
  - Asignación de profesores
  - Inscripción de estudiantes

- **Calificaciones**:
  - Registro de calificaciones por parte de profesores
  - Visualización de calificaciones por estudiantes

### 4. API RESTful

La API implementa los siguientes endpoints principales:

- `/api/auth/*` - Endpoints de autenticación
- `/api/users/*` - Gestión de usuarios
- `/api/courses/*` - Gestión de cursos
- `/api/grades/*` - Gestión de calificaciones

## Implementación Técnica

### Autenticación

- Utilización de JWT para manejo de sesiones
- JWT para tokens de autenticación
- Middleware de protección de rutas

### Autorización

- Sistema de roles implementado en la base de datos
- Middleware de verificación de permisos
- Control de acceso basado en roles (RBAC)

### Persistencia de Datos

- ORM: TypeORM
- Base de datos: PostgreSQL
- Modelos definidos:
  - User
  - Course
  - Enrollment
  - Grade

## Pruebas

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas específicas
npm run test:unit
npm run test:integration
```

### Tipos de Pruebas

1. **Pruebas Unitarias**:
   - Componentes individuales
   - Funciones de utilidad
   - Lógica de negocio

2. **Pruebas de Integración**:
   - Flujos completos de funcionalidad
   - Interacción con la base de datos
   - Endpoints de la API

3. **Pruebas E2E**:
   - Flujos de usuario completos
   - Interacción con la interfaz

## Solución de Problemas Comunes

1. **Error de Conexión a la Base de Datos**:
   - Verificar credenciales en `.env`
   - Confirmar que PostgreSQL está en ejecución
   - Validar la URL de conexión

2. **Problemas de Autenticación**:
   - Verificar configuración de JWT
   - Validar variables de entorno
   - Verificar que el token JWT sea válido


