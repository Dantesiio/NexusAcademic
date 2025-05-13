# Listado Detallado de Casos de Prueba Unitarias

## 1. Módulo de Autenticación

### 1.1. Pruebas de AuthController (auth.controller.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Definición del controlador | Verificar que el controlador se define correctamente | Controlador definido e inyectado |
| Método create (register) | Prueba de creación de usuario con DTO correcto | Se llama a authService.create con los parámetros correctos |
| Método login | Prueba de login con credenciales correctas | Se llama a authService.login con los parámetros correctos |

### 1.2. Pruebas de AuthService (auth.service.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Definición del servicio | Verificar que el servicio se define correctamente | Servicio definido e inyectado |
| Create - caso exitoso | Creación de usuario con datos válidos | Usuario creado y token generado |
| Create - email duplicado | Creación de usuario con email existente | BadRequestException |
| Create - error inesperado | Error no controlado durante creación | InternalServerErrorException |
| Login - caso exitoso | Login con credenciales correctas | Usuario recuperado y token generado |
| Login - usuario no encontrado | Login con email inexistente | NotFoundException |
| Login - contraseña incorrecta | Login con email correcto pero contraseña incorrecta | NotFoundException |

### 1.3. Pruebas del Módulo Auth (auth.module.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Definición del módulo | Verificar que el módulo se define correctamente | Módulo definido |
| Provisión de AuthService | Verificar que el servicio está disponible | AuthService inyectado |
| Provisión de AuthController | Verificar que el controlador está disponible | AuthController inyectado |
| Provisión de JwtStrategy | Verificar que la estrategia JWT está disponible | JwtStrategy inyectado |
| Configuración de JwtModule | Verificar que el módulo JWT está configurado | JwtModule definido |

### 1.4. Pruebas de JwtStrategy (jwt.strategy.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Definición de estrategia | Verificar que la estrategia se define correctamente | Estrategia definida |
| Validación JWT exitosa | Token con payload válido y usuario existente | Usuario recuperado sin contraseña |
| Usuario no existente | Token con payload válido pero usuario inexistente | UnauthorizedException |
| Usuario inactivo | Token con payload válido pero usuario inactivo | UnauthorizedException |

### 1.5. Pruebas de Decoradores y Guards

#### 1.5.1. GetUser Decorator (get-user.decorator.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Recuperar usuario completo | Sin parámetro data | Usuario completo recuperado del request |
| Recuperar propiedad específica | Con data='email' | Solo email del usuario recuperado |

#### 1.5.2. RawHeaders Decorator (raw-headers.decorator.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Recuperar headers | Extracción de headers de la petición | Headers recuperados correctamente |

#### 1.5.3. Auth Decorator (auth.decorator.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Aplicación de RoleProtected y Guards | Con roles específicos | Decoradores aplicados en orden correcto |

#### 1.5.4. UserRoleGuard (user-role.guard.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Sin roles requeridos | validRoles indefinido | Retorna true |
| Array vacío de roles | validRoles = [] | Retorna true |
| Sin usuario en request | Falta user en request | BadRequestException |
| Usuario con rol requerido | Usuario tiene al menos un rol válido | Retorna true |
| Usuario sin rol requerido | Usuario no tiene ningún rol válido | ForbiddenException |

### 1.6. Pruebas de DTOs

#### 1.6.1. CreateAuthDto (create-auth.dto.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| DTO válido | Todos los campos correctos | Sin errores de validación |
| Email inválido | Formato de email incorrecto | Error de validación |
| Contraseña corta | Menos de 6 caracteres | Error de validación |
| Sin nombre completo | Campo obligatorio omitido | Error de validación |

#### 1.6.2. LoginUserDto (login-user.dto.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| DTO válido | Email y contraseña correctos | Sin errores de validación |
| Contraseña corta | Menos de 6 caracteres | Error de validación |

## 2. Módulo de Cursos

### 2.1. Pruebas de CoursesController (courses.controller.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Definición del controlador | Verificar que el controlador se define correctamente | Controlador definido |
| Create | Crear curso con datos válidos | Service.create llamado con parámetros correctos |
| FindAll | Listado de cursos | Service.findAll llamado, array de cursos retornado |
| FindOne | Buscar curso por ID | Service.findOne llamado con ID correcto |
| Update | Actualizar curso | Service.update llamado con ID y DTO correctos |
| Remove | Eliminar curso | Service.remove llamado con ID correcto |

### 2.2. Pruebas de CoursesService (courses.service.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Definición del servicio | Verificar que el servicio se define correctamente | Servicio definido |
| Create - caso exitoso | Crear curso con datos válidos | Curso creado correctamente |
| Create - profesor no encontrado | ID de profesor inexistente | NotFoundException |
| Create - fecha fin antes que inicio | Fechas inválidas | BadRequestException |
| FindAll | Listado de cursos | Array de cursos retornado |
| FindOne - caso exitoso | Buscar curso por ID existente | Curso encontrado |
| FindOne - curso inexistente | ID que no existe | NotFoundException |
| Update - caso exitoso | Actualizar curso existente | Curso actualizado |
| Update - cambio de profesor | Con teacherId nuevo | Profesor actualizado |
| Update - profesor no encontrado | teacherId inexistente | NotFoundException |
| Remove - caso exitoso | Eliminar curso existente | Curso eliminado |
| Remove - curso inexistente | ID que no existe | NotFoundException |

### 2.3. Pruebas de Entidades

#### 2.3.1. Course Entity (course.entity.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Creación de entidad | Objeto con todas las propiedades | Objeto creado correctamente |
| Valores por defecto | Creación sin status | Status toma valor por defecto (ACTIVE) |
| Actualización | Modificación de propiedades | Propiedades actualizadas |
| Cambio de profesor | Asignación de otro profesor | Relación actualizada |

## 3. Módulo de Estudiantes

### 3.1. Pruebas de StudentsController (students.controller.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Definición del controlador | Verificar que se define correctamente | Controlador definido |
| Create | Crear estudiante con datos válidos | Service.create llamado con parámetros correctos |
| FindAll | Listado paginado | Service.findAll llamado con paginación |
| FindAll - sin parámetros | Listado con valores por defecto | Service.findAll llamado con valores por defecto |
| FindOne - por ID | Buscar por UUID | Service.findOne llamado con ID |
| FindOne - por nombre | Buscar por nombre | Service.findOne llamado con nombre |
| Update | Actualizar estudiante | Service.update llamado con ID y DTO correctos |
| Remove | Eliminar estudiante | Service.remove llamado con ID correcto |

### 3.2. Pruebas de StudentsService (students.service.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Definición del servicio | Verificar que se define correctamente | Servicio definido |
| Create - caso exitoso | Crear estudiante con todos los datos | Estudiante creado correctamente |
| Create - email duplicado | Email ya existente | BadRequestException |
| Create - error inesperado | Error no controlado | InternalServerErrorException |
| FindAll - paginado | Búsqueda con limit y offset | Array paginado retornado |
| FindAll - valores por defecto | Sin parámetros de paginación | Paginación con valores por defecto |
| FindOne - por UUID | Búsqueda con ID válido | Estudiante encontrado |
| FindOne - por nombre | Búsqueda por nombre | Estudiante encontrado |
| FindOne - inexistente | Búsqueda con valor inexistente | NotFoundException |
| Update - caso exitoso | Actualización de estudiante existente | Estudiante actualizado |
| Update - transacción fallida | Error durante transacción | InternalServerErrorException |
| Update - estudiante inexistente | ID que no existe | NotFoundException |
| Remove | Eliminación de estudiante | Estudiante eliminado |
| DeleteAllStudents | Eliminación masiva para seed | Estudiantes eliminados |

### 3.3. Pruebas de Casos Límite (students-service-edge.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| FindAll con error | Error de base de datos | InternalServerErrorException |
| Create con error desconocido | Error no categorizado | InternalServerErrorException |
| Update con error de transacción | Fallo en transacción | InternalServerErrorException y rollback |

### 3.4. Pruebas de Entidades

#### 3.4.1. Student Entity (student.entity.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Creación de entidad | Objeto con todas las propiedades | Objeto creado correctamente |
| Hook BeforeInsert | Generación de nickname al insertar | Nickname generado correctamente |
| Hook BeforeInsert con nombre existente | Formateo de nickname existente | Nickname formateado correctamente |
| Hook BeforeInsert con espacios | Manejo de espacios en nombre | Espacios reemplazados por guiones bajos |
| Hook BeforeUpdate | Actualización de nickname | Nickname actualizado correctamente |
| Relación con calificaciones | Estudiante con múltiples calificaciones | Relación establecida correctamente |

#### 3.4.2. Grade Entity (grade.entity.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Creación de entidad | Objeto con todas las propiedades | Objeto creado correctamente |
| Creación sin ID | Objeto sin ID asignado | ID indefinido |
| Actualización | Modificación de propiedades | Propiedades actualizadas correctamente |
| Relación nula | Asignación de estudiante a null | Relación eliminada |

## 4. Módulo de Entregas

### 4.1. Pruebas de SubmissionsController (submissions.controller.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Definición del controlador | Verificar que se define correctamente | Controlador definido |
| Create | Crear entrega con datos válidos | Service.create llamado con parámetros correctos |
| FindAll | Listado de entregas | Service.findAll llamado, array retornado |
| FindOne | Buscar por ID | Service.findOne llamado con ID correcto |
| Grade | Calificar entrega | Service.grade llamado con ID y calificación |
| Remove | Eliminar entrega | Service.remove llamado con ID correcto |

### 4.2. Pruebas de SubmissionsService (submissions.service.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Definición del servicio | Verificar que se define correctamente | Servicio definido |
| Create - caso exitoso | Crear entrega con datos completos | Entrega creada correctamente |
| Create - entrega duplicada | Misma combinación curso/estudiante | BadRequestException |
| FindAll | Listado completo | Array de entregas retornado |
| FindOne - caso exitoso | Búsqueda con ID existente | Entrega encontrada |
| FindOne - entrega inexistente | ID que no existe | NotFoundException |
| Grade - asignación de calificación | Calificar entrega existente | Entrega actualizada con nota |
| Grade - mantener comentarios | Solo actualizar nota | Comentarios originales mantenidos |
| Remove | Eliminación de entrega | Entrega eliminada |

### 4.3. Pruebas de Entidades

#### 4.3.1. Submission Entity (submission.entity.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Creación de entidad | Objeto con todas las propiedades | Objeto creado correctamente |
| Creación con valores por defecto | Objeto con propiedades mínimas | Propiedades opcionales undefined |
| Calificación nula | Asignación de null a grade | Grade acepta valor null |
| Actualización | Modificación de propiedades | Propiedades actualizadas correctamente |

## 5. Pruebas de DTOs y Utilidades

### 5.1. PaginationDto (pagination.dto.spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| DTO válido | Limit y offset correctos | Sin errores de validación |
| Sin valores | Objeto vacío | Valores por defecto |
| Transformación de tipos | Strings convertidos a números | Tipos convertidos correctamente |
| Limit negativo | Valor no permitido | Error de validación |
| Offset negativo | Valor no permitido | Error de validación |

## 6. Pruebas de Módulos

Todos los módulos tienen pruebas de compilación que verifican:
- Definición correcta del módulo
- Provisión de servicios
- Provisión de controladores
- Importación de dependencias

## 7. Pruebas de Conexión a Base de Datos

### 7.1. DB Connection Test (db-connection.e2e-spec.ts)

| Caso de Prueba | Descripción | Resultado Esperado |
|----------------|-------------|-------------------|
| Conexión exitosa | Verificar inicialización de DataSource | isInitialized = true |
| Consulta básica | Ejecutar query simple (SELECT 1) | Resultado = 1 |

## Resumen de Enfoques en Pruebas Unitarias

1. *Mocks*:
   - Uso extensivo de jest.fn() para simular retornos
   - Mocks de repositorios de TypeORM
   - Mocks de servicios para aislar componentes

2. *Spies*:
   - jest.spyOn() para verificar llamadas a métodos
   - Control de comportamiento de métodos reales

3. *Inyección de Dependencias*:
   - TestingModule para compilar módulos aislados
   - Providers reemplazados para pruebas

4. *Aserciones*:
   - Verificación de valores retornados
   - Verificación de excepciones lanzadas
   - Verificación de llamadas a métodos

5. *Verificación de Edge Cases*:
   - Manejo de errores
   - Casos límite de validación
   - Transacciones fallidas