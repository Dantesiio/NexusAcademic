
---

# NexusAcademic - Sistema de Gestión Académica

## 👥 Integrantes

* [David Donneys](https://github.com/Dantesiio)
* [Jhonatan Castaño](https://github.com/JhonatanCI)
* [Andrés Pino](https://github.com/AndresPin0)

## 📌 Descripción del Proyecto

**NexusAcademic** es una plataforma de gestión académica que permite administrar cursos, estudiantes y profesores. El sistema está desarrollado con **Next.js** (frontend), una **API RESTful** (backend) y **PostgreSQL** como base de datos.

---

## ⚙️ Requisitos Previos

* Node.js v22 o superior
* Docker y Docker Compose
* npm

---

## 🧪 Instalación y Configuración

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Dantesiio/NexusAcademic.git
   cd NexusAcademic
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**

   * Crear un archivo `.env` en la raíz del proyecto.
   * Copiar el contenido de `.env.example` y ajustar las variables necesarias:

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

4. **Iniciar la base de datos con Docker Compose:**

   ```bash
   docker-compose up -d
   docker-compose ps
   ```

5. **Inicialización automática de la base de datos:**

   * Se utiliza `synchronize: true` de TypeORM en modo desarrollo.

6. **Iniciar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

---

## 🚀 Funcionalidades Implementadas

### 🔐 Autenticación y Autorización

* Login con JWT
* Protección de rutas según rol de usuario
* Sesiones seguras

### 👤 Gestión de Usuarios

* Registro de usuarios
* Roles: Administrador, Profesor, Estudiante
* Edición de perfil

### 📚 Gestión Académica

* **Cursos:**

  * Crear/editar cursos
  * Asignar profesores
  * Inscribir estudiantes
* **Calificaciones:**

  * Registro por profesores
  * Consulta por estudiantes

### 📡 API RESTful

Principales endpoints:

* `/api/auth/*`: Autenticación
* `/api/users/*`: Usuarios
* `/api/courses/*`: Cursos
* `/api/grades/*`: Calificaciones

---

## ⚙️ Implementación Técnica

### 🔒 Autenticación

* Tokens JWT
* Middleware para rutas protegidas

### 🛡️ Autorización

* Roles con RBAC
* Middleware de permisos

### 🗃️ Persistencia

* ORM: TypeORM
* Base de datos: PostgreSQL
* Entidades: `User`, `Course`, `Enrollment`, `Grade`

---

## 🧪 Ejecución de Pruebas

### 🧱 Preparación del entorno

```bash
# Iniciar la base de datos de pruebas
npm run test:e2e:db:up

# Inicializar o limpiar base de datos de pruebas
npm run init:testdb
```

### 🔍 Tipos de Pruebas

#### ✅ Pruebas Unitarias

```bash
# Todas las pruebas unitarias
npm run test

# Módulo específico
npm test src/auth/auth.service.spec.ts

# Modo watch
npm run test:watch
```

#### 🔗 Pruebas de Integración

Se ejecutan junto a las pruebas unitarias:

```bash
npm run test
```

#### 🧪 Pruebas End-to-End (E2E)

```bash
# Todas las pruebas E2E
npm run test:e2e

# Pruebas E2E específicas
npm run test:e2e -- test/e2e/auth/login.e2e-spec.ts

# Ejecutar E2E con base limpia
npm run test:e2e:clean

# Proceso completo
npm run test:e2e:full
```

#### 🔌 Pruebas de Conexión a la Base de Datos

```bash
npm run test:e2e:db
```

---

### 📊 Cobertura de Pruebas

Se requiere al menos un 80% de cobertura:

```bash
# Ver cobertura
npm run test:cov
```

Informe disponible en:
`/coverage/lcov-report/index.html`

#### Configuración mínima (`package.json`):

```json
"coverageThreshold": {
  "global": {
    "statements": 50,
    "branches": 58,
    "functions": 50,
    "lines": 50
  }
}
```

---

## 🛠️ Solución de Problemas

### 1. ❌ Error de Conexión a la Base de Datos

* Verificar variables en `.env`
* Confirmar que PostgreSQL esté corriendo
* Validar URL de conexión y puertos

### 2. ❌ Problemas de Autenticación

* Verificar JWT\_SECRET y expiración
* Asegurarse de usar un token válido

### 3. ❌ Problemas en Pruebas

* **Fallos por timeout en Jest:**

  ```js
  jest.setTimeout(30000); // 30 segundos
  ```

* **Conflictos de datos:**

  ```bash
  npm run init:testdb
  ```

* **Pruebas que interfieren entre sí:**

  * Usa `beforeEach` / `afterEach`
  * Genera datos únicos con `${Date.now()}`

---

