# Listado Detallado de Casos de Prueba E2E

## 1. Módulo de Autenticación

### 1.1. Pruebas de Login (login.e2e-spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Login sin cuerpo | Intento de login sin enviar datos | Error 400 con mensaje indicando que el email es obligatorio |
| Login con email incorrecto | Intento de login con email que no existe | Error 404 con mensaje "not found" |
| Login con contraseña incorrecta | Intento de login con email correcto pero contraseña incorrecta | Error 404 con mensaje "Email or password incorrect" |
| Login exitoso | Login con credenciales válidas | Status 201, respuesta con token JWT y datos del usuario |

### 1.2. Pruebas de Registro (register.e2e-spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Registro sin cuerpo | Intento de registro sin enviar datos | Error 400 con validaciones |
| Registro con email duplicado | Intento de registro con email que ya existe | Error 400 con mensaje sobre clave duplicada |
| Registro con contraseña insegura | Intento de registro con contraseña débil | El test omite esta validación pues no está implementada |
| Registro exitoso | Registro con datos válidos | Status 201, respuesta con token JWT y datos del usuario |

## 2. Módulo de Cursos (courses.e2e-spec.ts)

### 2.1. Creación de Cursos (POST /courses)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Creación sin autenticación | Intento de crear curso sin token | Error 401 Unauthorized |
| Creación con rol no autorizado | Intento de crear curso con rol de profesor | Error 403 Forbidden |
| Creación con datos válidos | Crear curso con todos los datos correctos | Status 201, respuesta con datos del curso creado |
| Validación de datos de curso | Envío de datos inválidos (campos vacíos, ID inválido) | Error 400 con validaciones |
| Validación de fechas | Envío de fecha fin anterior a fecha inicio | Error 400 con mensaje "endDate must be after startDate" |

### 2.2. Obtención de Cursos (GET /courses)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Listado sin autenticación | Intento de listar cursos sin token | Error 401 Unauthorized |
| Listado con rol no autorizado | Intento de listar con rol de estudiante | Error 403 Forbidden |
| Listado exitoso | Obtención de lista de cursos | Status 200, array de cursos |

### 2.3. Obtención de Curso por ID (GET /courses/:id)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Obtener curso existente | Solicitud de curso con ID válido | Status 200, datos del curso |
| Curso inexistente | Solicitud con ID que no existe | Error 404 Not Found |

### 2.4. Actualización de Curso (PUT /courses/:id)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Actualización sin permisos | Intento de actualizar con rol de profesor | Error 403 Forbidden |
| Actualización exitosa | Actualización de nombre y descripción del curso | Status 200, curso actualizado |

### 2.5. Eliminación de Curso (DELETE /courses/:id)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Eliminación sin permisos | Intento de eliminar con rol de profesor | Error 403 Forbidden |
| Eliminación exitosa | Eliminación de curso existente | Status 200, curso eliminado exitosamente |

## 3. Módulo de Estudiantes (students.e2e-spec.ts)

### 3.1. Creación de Estudiantes (POST /students)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Creación sin autenticación | Intento sin token | Error 401 Unauthorized |
| Creación con rol no autorizado | Intento con rol de profesor | Error 403 Forbidden |
| Creación con datos válidos | Crear estudiante con todos los datos correctos | Status 201, estudiante creado |
| Validación de datos | Envío de datos inválidos (edad negativa, email inválido) | Error 400 con validaciones |

### 3.2. Obtención de Estudiantes (GET /students)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Listado sin autenticación | Intento sin token | Error 401 Unauthorized |
| Listado con rol no autorizado | Intento con rol de profesor | Error 403 Forbidden |
| Listado con paginación | Obtención de lista con parámetros limit y offset | Status 200, array paginado de estudiantes |

### 3.3. Obtención de Estudiante (GET /students/:term)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Búsqueda por ID | Buscar estudiante por su UUID | Status 200, datos del estudiante |
| Búsqueda por nombre | Buscar estudiante por su nombre | Status 200, datos del estudiante |
| Estudiante inexistente | Búsqueda con término que no existe | Error 404 Not Found |

### 3.4. Actualización de Estudiante (PATCH /students/:id)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Actualización exitosa | Actualización de nombre y edad | Status 200, datos actualizados |
| Validación de datos | Envío de datos inválidos (edad negativa) | Error 400 con validaciones |

### 3.5. Eliminación de Estudiante (DELETE /students/:id)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Eliminación exitosa | Eliminación de estudiante existente | Status 200, estudiante eliminado |
| Estudiante inexistente | Intento con ID no existente | Error 404 Not Found |

## 4. Módulo de Entregas (submissions.e2e-spec.ts)

### 4.1. Creación de Entregas (POST /submissions)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Creación sin autenticación | Intento sin token | Error 401 Unauthorized |
| Creación con datos válidos | Crear entrega con todos los datos correctos | Status 201, entrega creada |
| Validación de datos | Envío de datos inválidos (URL vacía, IDs inválidos) | Error 400 con validaciones |
| Detección de duplicados | Intento de crear entrega ya existente para el mismo curso/estudiante | Error 400 "Submission already exists" |

### 4.2. Obtención de Entregas (GET /submissions)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Listado sin autenticación | Intento sin token | Error 401 Unauthorized |
| Listado exitoso | Obtención de lista de entregas | Status 200, array de entregas |

### 4.3. Obtención de Entrega por ID (GET /submissions/:id)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Obtener entrega existente | Solicitud con ID válido | Status 200, datos de la entrega |
| Entrega inexistente | Solicitud con ID que no existe | Error 404 Not Found |

### 4.4. Calificación de Entrega (PUT /submissions/:id/grade)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Calificación exitosa | Asignar nota y comentarios | Status 200, entrega actualizada con calificación |
| Validación de calificación | Envío de calificación fuera de rango (superior a 5) | Error 400 con validaciones |

### 4.5. Eliminación de Entrega (DELETE /submissions/:id)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Eliminación sin permisos | Intento con rol de profesor | Error 403 Forbidden |
| Eliminación exitosa | Eliminación de entrega existente | Status 200, verificación de eliminación completa |

## Resumen de Configuración y Preparación

1. *Preparación del Entorno de Pruebas*:
   - Se inician contenedores Docker para la base de datos de pruebas
   - Se crea un usuario administrador para las pruebas
   - Se generan tokens JWT para los diferentes roles

2. *Limpieza Entre Pruebas*:
   - Uso de beforeEach para preparar datos frescos en cada caso
   - Eliminación de datos de prueba en afterAll
   - Uso de códigos/IDs únicos (con timestamp) para evitar conflictos

3. *Verificaciones después de acciones*:
   - Después de eliminar un recurso, se verifica que ya no existe
   - Después de crear/actualizar, se verifican los datos resultantes

4. *Tiempos de Espera*:
   - Se configura jest.setTimeout(60000) para evitar fallos por timeout en operaciones más lentas