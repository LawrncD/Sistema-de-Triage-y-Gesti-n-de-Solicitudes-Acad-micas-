# Sistema de Triage y Gestión de Solicitudes Académicas

**Plataforma completa de gestión de solicitudes académicas** para el programa de Ingeniería de Sistemas y Computación, con backend en Spring Boot 3.2.3 y frontend en Angular 21.

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Funcionales Implementados](#requisitos-funcionales-implementados)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Autenticación y Seguridad](#autenticación-y-seguridad)
- [API Endpoints](#api-endpoints)
- [Base de Datos](#base-de-datos)
- [Herramientas y Consolas](#herramientas-y-consolas)
- [Troubleshooting](#troubleshooting)

## 🎯 Visión General

Este proyecto implementa un **sistema de triage y gestión de solicitudes académicas** con arquitectura cliente-servidor completa:

- **Backend**: API RESTful con Spring Boot, JWT authentication, autorización basada en roles
- **Frontend**: Interfaz moderna con Angular, componentes standalone, formularios reactivos
- **Base de Datos**: H2 en memoria con esquema normalizado (3 tablas: usuarios, solicitudes, historial)
- **Seguridad**: JWT tokens (HS256), BCrypt para contraseñas, Spring Security con role-based access control
- **Auditoría**: Registro automático de todas las acciones en tabla de historial

## 🚀 Stack Tecnológico

### Backend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Java | 17 LTS | Lenguaje principal |
| Spring Boot | 3.2.3 | Framework web |
| Spring Data JPA | 3.2.3 | ORM y persistencia |
| Spring Security | 6.2.2 | Autenticación y autorización |
| JJWT | 0.12.5 | Generación y validación de JWT |
| H2 Database | 2.2.224 | Base de datos en memoria |
| SpringDoc OpenAPI | 2.3.0 | Documentación Swagger automática |
| Maven | 3.9+ | Gestor de dependencias |

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Angular | 21.1.5 | Framework web |
| TypeScript | 5.9.2 | Lenguaje tipado |
| RxJS | 7.8.0 | Programación reactiva |
| Angular Forms | 21.1.5 | Formularios reactivos |
| HttpClient | 21.1.5 | Comunicación HTTP |
| npm | 11.1.0+ | Gestor de paquetes |

## 📦 Requisitos Funcionales Implementados

Todos los **13 Requisitos Funcionales** están 100% implementados y validados:

| RF | Descripción | Estado |
|----|-------------|--------|
| RF-01 | Registro de solicitudes académicas con descripción, tipo, canal de origen | ✅ Implementado |
| RF-02 | Clasificación automática de solicitudes por tipo | ✅ Implementado |
| RF-03 | Priorización manual y automática basada en reglas | ✅ Implementado |
| RF-04 | Asignación de responsables | ✅ Implementado |
| RF-05 | Estados del ciclo de vida (Registrada, Clasificada, Priorizada, Asignada, En Atención, Resuelta, Cerrada) | ✅ Implementado |
| RF-06 | Historial completo de cambios auditable | ✅ Implementado |
| RF-07 | Consulta de solicitudes con filtros (estado, tipo, prioridad, rango de fechas) | ✅ Implementado |
| RF-08 | Cambio de estado con restricciones por rol | ✅ Implementado |
| RF-09 | Módulo de IA para sugerencias de respuesta (simulador local) | ✅ Implementado |
| RF-10 | Módulo de IA para análisis de sentimiento | ✅ Implementado |
| RF-11 | Administración de usuarios con asignación de roles | ✅ Implementado |
| RF-12 | Cierre de solicitudes con observaciones | ✅ Implementado |
| RF-13 | Control de acceso basado en roles (RBAC) | ✅ Implementado |

## 🔧 Instalación y Configuración

### Requisitos Previos

- **Java 17 LTS** instalado ([Descargar](https://www.oracle.com/java/technologies/downloads/#java17))
- **Maven 3.9+** instalado ([Descargar](https://maven.apache.org/download.cgi))
- **Node.js 20+** y **npm 11+** instalados ([Descargar](https://nodejs.org/))
- **Git** instalado

### Clonación del Repositorio

```bash
git clone <url-del-repositorio>
cd Sistema-de-Triage-y-Gestion-de-Solicitudes-Academicas
```

### Verificación de Dependencias

```bash
# Verificar Java
java -version

# Verificar Maven
mvn -version

# Verificar Node.js y npm
node --version
npm --version
```

## ▶️ Ejecución del Proyecto

### 1. Ejecutar el Backend

```bash
# Navega a la raíz del proyecto (si no estás ya ahí)
cd Sistema-de-Triage-y-Gestion-de-Solicitudes-Academicas

# Compila y ejecuta el servidor Spring Boot
mvn spring-boot:run
```

**Salida esperada:**
```
INFO o.s.b.a.e.web.TomcatWebServer - Tomcat started on port(s): 8080
INFO o.s.b.a.e.web.TomcatWebServer - Started [Application] in X.XXX seconds
INFO co.edu.uniquindio.poo.config.JwtUtil - JWT initialized with secret key
```

El backend estará disponible en: `http://localhost:8080`

### 2. Ejecutar el Frontend

En otra terminal:

```bash
# Navega a la carpeta frontend
cd frontend

# Instala las dependencias (solo la primera vez o después de cambios)
npm install

# Inicia el servidor de desarrollo de Angular
ng serve --open
```

O simplemente:
```bash
npm start
```

**Salida esperada:**
```
✔ Compiled successfully.
✔ Build at: YYYY-MM-DDTHH:mm:ss.xxxZ - Hash: xxx
```

El frontend estará disponible en: `http://localhost:4200`

### 3. Solución de Problemas - Puerto Ocupado

Si al ejecutar `mvn spring-boot:run` recibes el error **"Port 8080 already in use"**:

**Windows PowerShell:**
```powershell
# Identifica el proceso usando el puerto 8080
netstat -ano | findstr :8080

# Termina el proceso (reemplaza XXXX con el PID)
taskkill /PID XXXX /F

# Vuelve a iniciar
mvn spring-boot:run
```

**Linux/Mac:**
```bash
# Identifica el proceso
lsof -i :8080

# Termina el proceso
kill -9 <PID>

# Vuelve a iniciar
mvn spring-boot:run
```

## 📁 Estructura del Proyecto

```
Sistema-de-Triage-y-Gestion-de-Solicitudes-Academicas/
│
├── backend/
│   ├── pom.xml                           # Configuración de Maven
│   ├── src/main/java/co/edu/.../
│   │   ├── controller/                   # REST Controllers (5 controladores)
│   │   ├── service/                      # Lógica de negocio (7 servicios)
│   │   ├── repository/                   # Acceso a datos (3 repositorios)
│   │   ├── model/                        # Entidades JPA
│   │   ├── dto/                          # Data Transfer Objects
│   │   ├── exception/                    # Manejo de excepciones
│   │   ├── mapper/                       # Mapeo entre DTOs y entidades
│   │   ├── config/                       # Configuración (JWT, OpenAPI)
│   │   ├── security/                     # Seguridad y filtros
│   │   └── Application.java              # Clase main
│   ├── src/main/resources/
│   │   ├── application.properties        # Configuración de la app
│   │   └── openapi.yaml                  # Documentación OpenAPI
│   └── src/test/java/...                 # Tests unitarios e integración
│
├── frontend/
│   ├── package.json                      # Dependencias npm
│   ├── angular.json                      # Configuración Angular
│   ├── tsconfig.json                     # Configuración TypeScript
│   ├── src/
│   │   ├── main.ts                       # Bootstrap
│   │   ├── index.html                    # HTML principal
│   │   ├── styles.css                    # Estilos globales
│   │   └── app/
│   │       ├── app.routes.ts             # Rutas
│   │       ├── app.ts                    # Componente raíz
│   │       ├── components/
│   │       │   ├── auth/                 # Login/Registro
│   │       │   ├── dashboard/            # Panel de control
│   │       │   ├── solicitud-create/     # Crear solicitud
│   │       │   ├── solicitud-list/       # Listar solicitudes
│   │       │   ├── solicitud-detail/     # Detalle de solicitud
│   │       │   ├── usuario-list/         # Gestión de usuarios
│   │       │   └── navbar/               # Barra de navegación
│   │       ├── services/                 # HTTP Services
│   │       ├── models/                   # Interfaces y tipos
│   │       └── core/
│   │           ├── guards/               # Route guards
│   │           └── interceptors/         # HTTP interceptors
│   └── src/environments/                 # Configuración por ambiente
│
└── README.md                             # Este archivo
```

## 🔐 Autenticación y Seguridad

### Flujo de Autenticación JWT

1. **Login**: Usuario envía credenciales al endpoint `/api/auth/login`
2. **Generación de Token**: Backend valida credenciales y genera JWT
3. **Almacenamiento**: Frontend guarda token en `localStorage`
4. **Envío en Requests**: HttpInterceptor añade token en header `Authorization: Bearer <token>`
5. **Validación**: Backend valida token en cada request (JwtFilter)
6. **Expiración**: Token expira en 24 horas

### Configuración JWT

**Archivo**: `src/main/resources/application.properties`
```properties
jwt.secret=<base64-encoded-secret>
jwt.expiration=86400000  # 24 horas en milisegundos
```

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **ESTUDIANTE** | Ver propias solicitudes, crear nuevas, comentar |
| **RESPONSABLE** | Ver solicitudes asignadas, cambiar estado, cerrar |
| **ADMINISTRATIVO** | Ver todas, crear usuarios, asignar roles, generar reportes |

### Usuarios Precargados (Demo)

Al iniciar, la aplicación carga 5 usuarios de prueba:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `juan.perez@uq.edu.co` | `password123` | ESTUDIANTE |
| `maria.garcia@uq.edu.co` | `password123` | ESTUDIANTE |
| `carlos.lopez@uq.edu.co` | `password123` | RESPONSABLE |
| `ana.martinez@uq.edu.co` | `password123` | ADMINISTRATIVO |
| `luis.rodriguez@uq.edu.co` | `password123` | ADMINISTRATIVO |

## 🌐 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión (retorna JWT) |
| POST | `/api/auth/register` | Registrar nuevo usuario |

### Solicitudes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/solicitudes` | Crear nueva solicitud |
| GET | `/api/solicitudes` | Listar solicitudes (con filtros) |
| GET | `/api/solicitudes/{id}` | Obtener detalle de solicitud |
| PUT | `/api/solicitudes/{id}/clasificar` | Clasificar solicitud |
| PUT | `/api/solicitudes/{id}/priorizar` | Priorizar solicitud |
| PUT | `/api/solicitudes/{id}/asignar` | Asignar responsable |
| PUT | `/api/solicitudes/{id}/cambiar-estado` | Cambiar estado |
| PUT | `/api/solicitudes/{id}/cerrar` | Cerrar solicitud |

### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Listar usuarios |
| POST | `/api/usuarios` | Crear usuario (admin) |
| GET | `/api/usuarios/{id}` | Obtener usuario |
| PUT | `/api/usuarios/{id}` | Actualizar usuario |

### IA (Sugerencias)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/ia/sugerencias` | Generar sugerencia de respuesta |
| POST | `/api/ia/sentimiento` | Analizar sentimiento |

### Historial
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/historial/{solicitudId}` | Ver historial de cambios |

**Documentación interactiva completa**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## 💾 Base de Datos

### Esquema

**Tabla: usuarios**
```sql
CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    identificacion VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- BCrypt encrypted
    rol ENUM('ESTUDIANTE', 'RESPONSABLE', 'ADMINISTRATIVO'),
    activo BOOLEAN DEFAULT TRUE
);
```

**Tabla: solicitudes**
```sql
CREATE TABLE solicitudes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    descripcion TEXT NOT NULL,
    canal_origen VARCHAR(50),
    estado VARCHAR(50),
    fecha_registro TIMESTAMP,
    tipo_solicitud VARCHAR(100),
    prioridad VARCHAR(20),
    solicitante_id BIGINT,
    responsable_id BIGINT,
    FOREIGN KEY (solicitante_id) REFERENCES usuarios(id),
    FOREIGN KEY (responsable_id) REFERENCES usuarios(id)
);
```

**Tabla: historial_solicitudes**
```sql
CREATE TABLE historial_solicitudes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    solicitud_id BIGINT,
    usuario_id BIGINT,
    accion VARCHAR(255),
    fecha_hora TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

### Acceso a H2 Console

Una vez que el backend está corriendo:

- **URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:mem:solicitudesdb`
- **Username**: `sa`
- **Password**: (dejar en blanco)

## 🛠️ Herramientas y Consolas

### Swagger UI (API Documentation)
```
http://localhost:8080/swagger-ui.html
```
Interfaz interactiva para probar todos los endpoints. Utiliza la función "Authorize" para ingresar el JWT token.

### H2 Database Console
```
http://localhost:8080/h2-console
```
Panel de administración de la base de datos en memoria.

### Frontend (Angular)
```
http://localhost:4200
```
Interfaz de usuario completa con formularios, tablas y gestión visual.

## 🐛 Troubleshooting

### 1. Port 8080 Already in Use

**Problema**: Al ejecutar el backend, recives: `Port 8080 already in use`

**Solución**:
```bash
# Mostrar todos los procesos usando puerto 8080
netstat -ano | findstr :8080

# Terminar el proceso (usa el PID del resultado anterior)
taskkill /PID XXXXXX /F

# Vuelve a intentar
mvn spring-boot:run
```

### 2. npm Install Falla

**Problema**: `npm install` produce errores de dependencias

**Solución**:
```bash
# Limpia la caché
npm cache clean --force

# Elimina package-lock.json
rm package-lock.json

# Intenta de nuevo
npm install
```

### 3. TypeScript Errors en Frontend

**Problema**: Errores de compilación de TypeScript

**Solución**:
```bash
# Verifica la configuración de TypeScript
cat tsconfig.app.json

# Asegúrate que incluya: "rootDir": "./src"

# Limpia los build artifacts
rm -rf dist/ node_modules/

# Reinstala y recompila
npm install
npm run build
```

### 4. JWT Token Inválido o Expirado

**Problema**: Request falla con `401 Unauthorized`

**Solución**:
- Verifica que el token está siendo enviado en el header: `Authorization: Bearer <token>`
- Revisa la consola del navegador (DevTools → Network → Headers)
- Haz logout y vuelve a hacer login para obtener un nuevo token
- Comprueba que no hayan pasado más de 24 horas desde el login

### 5. Problemas de CORS

**Problema**: Errores CORS en las llamadas HTTP del frontend

**Solución**:
- Verifica que el backend está corriendo en `http://localhost:8080`
- Verifica que el frontend está corriendo en `http://localhost:4200`
- Revisa la configuración de CORS en `application.properties`

## 📊 Validaciones y Reglas de Negocio

### Validaciones de Solicitudes
- Descripción: Requerida, máximo 1000 caracteres
- Tipo de solicitud: Debe estar en el catálogo definido
- Canal de origen: Teléfono, Email, Ventanilla
- Prioridad: Auto calculada según reglas (Baja, Media, Alta, Crítica)

### Reglas de Priorización
- **Baja**: Consultas administrativas
- **Media**: Cambios de calificaciones, solicitudes académicas normales
- **Alta**: Problemas de inscripción, cambios de programa
- **Crítica**: Apelaciones, situaciones disciplinarias

### Estados del Ciclo de Vida
1. **Registrada**: Solicitud creada
2. **Clasificada**: Asignado tipo
3. **Priorizada**: Asignada prioridad
4. **Asignada**: Designado responsable
5. **En Atención**: Responsable está trabajando
6. **Resuelta**: Solución identificada
7. **Cerrada**: Solicitud completada

### Control de Acceso
- Solo ESTUDIANTE puede crear solicitudes propias
- Solo RESPONSABLE puede cambiar estado a "En Atención" o "Resuelta"
- Solo ADMINISTRATIVO puede cerrar solicitudes o crear usuarios
- Cada rol ve solo lo que tiene permisos

## 🚀 Optimizaciones y Mejoras Realizadas

Durante el desarrollo, se implementaron las siguientes optimizaciones:

✅ **Limpieza de código**: Eliminación de console.log statements y IA traces
✅ **Configuración de TypeScript**: Resolución de errores de compilación
✅ **Seguridad**: Implementación de JWT con BCrypt, validación de roles
✅ **Auditoría**: Registro completo de cambios en tabla de historial
✅ **Documentación**: Swagger/OpenAPI automático para todos los endpoints
✅ **Testing**: Tests unitarios e integración para capas críticas
✅ **Performance**: Queries optimizadas, caché en memoria

## 📝 Notas Importantes

- La base de datos H2 es **en memoria**, se reinicia cada vez que el servidor se detiene
- Los usuarios precargados se crean automáticamente en el startup
- Los tokens JWT tienen una validez de **24 horas**
- El proyecto usa **Hibernate auto schema generation** (ddl-auto=update)
- Angular está configurado con **componentes standalone**

## 📚 Referencias

- [Documentación Spring Boot](https://spring.io/projects/spring-boot)
- [Documentación Angular](https://angular.io/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [RESTful API Design Guide](https://restfulapi.net/)

## 👨‍💻 Desarrollo y Contacto

**Proyecto**: Sistema de Triage y Gestión de Solicitudes Académicas
**Programa**: Ingeniería de Sistemas y Computación
**Universidad**: Universidad del Quindío

---

*Última actualización: Abril 2026*
