# NexusAcademic - Sistema de Gestión Académica

## Integrantes
- [David Donneys](https://github.com/Dantesiio)
- [Jhonatan Castaño](https://github.com/JhonatanCI)
- [Andrés Pino](https://github.com/AndresPin0)

## Descripción del Proyecto

NexusAcademic es una plataforma de gestión académica que permite la administración de cursos, estudiantes y profesores. El sistema está construido utilizando Next.js para el frontend y una API RESTful para el backend, con una base de datos PostgreSQL para la persistencia de datos.

## Requisitos Previos

- Node.js (v22 o superior)
- Docker y Docker Compose
- npm

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

# Ejecuccion de Pruebas
Preparación del Entorno de Pruebas
Antes de ejecutar las pruebas, necesitamos configurar el entorno de pruebas:
bash# Iniciar la base de datos de pruebas
npm run test:e2e:db:up

# Inicializar la base de datos de pruebas (opcional, si es necesario reiniciar datos)
npm run init:testdb
Tipos de Pruebas y Cómo Ejecutarlas
1. Pruebas Unitarias
Las pruebas unitarias validan el funcionamiento de componentes individuales como servicios, controladores y entidades.
bash# Ejecutar todas las pruebas unitarias
npm run test

# Ejecutar pruebas unitarias de un módulo específico
npm test src/auth/auth.service.spec.ts

# Ejecutar pruebas unitarias en modo watch (útil durante desarrollo)
npm run test:watch
2. Pruebas de Integración
Las pruebas de integración validan la interacción entre diferentes módulos del sistema.
bash# Las pruebas de integración están incluidas en los archivos .spec.ts
# y se ejecutan junto con las pruebas unitarias
npm run test
3. Pruebas E2E (End-to-End)
Las pruebas E2E validan los flujos completos de la aplicación, simulando las acciones de los usuarios.
bash# Ejecutar todas las pruebas e2e
npm run test:e2e

# Ejecutar sólo las pruebas e2e de autenticación
npm run test:e2e -- test/e2e/auth/login.e2e-spec.ts

# Ejecutar pruebas e2e con un entorno limpio
npm run test:e2e:clean

# Proceso completo (iniciar DB, ejecutar tests, detener DB)
npm run test:e2e:full
4. Pruebas de Conexión a Base de Datos
bash# Probar específicamente la conexión a la base de datos
npm run test:e2e:db
Verificación de Cobertura de Pruebas
El proyecto requiere al menos 80% de cobertura de código. Para verificar la cobertura:
bash# Ejecutar pruebas con informe de cobertura
npm run test:cov

# Ver informe detallado
# (Los resultados estarán disponibles en /coverage/lcov-report/index.html)
La configuración de cobertura está definida en package.json:
json"coverageThreshold": {
  "global": {
    "statements": 50,
    "branches": 58,
    "functions": 50,
    "lines": 50
  }
}
Solución de Problemas Comunes en las Pruebas

Error de Conexión a Base de Datos:

Verificar que el contenedor Docker de la BD de pruebas esté en ejecución
Comprobar la configuración en docker-compose.test.yml
Ejecutar npm run init:testdb para reiniciar la base de datos


Fallos en Jest:

Aumentar el timeout si hay pruebas que exceden el tiempo límite:
jsjest.setTimeout(30000); // Aumentar a 30 segundos



Conflictos con datos existentes:

Limpiar la base de datos de pruebas antes de ejecutar pruebas E2E:
bashnpm run init:testdb



Pruebas que interfieren entre sí:

Utilizar beforeEach y afterEach para limpiar datos entre pruebas
Utilizar identificadores únicos para cada prueba (ej: ${Date.now()})
## Solución de Problemas Comunes

1. **Error de Conexión a la Base de Datos**:
   - Verificar credenciales en `.env`
   - Confirmar que PostgreSQL está en ejecución
   - Validar la URL de conexión

2. **Problemas de Autenticación**:
   - Verificar configuración de JWT
   - Validar variables de entorno
   - Verificar que el token JWT sea válido


