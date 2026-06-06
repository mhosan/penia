# Penia

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Arquitectura de Persistencia

La aplicación utiliza un servicio abstracto de persistencia que permite migrar fácilmente de localStorage a una base de datos sin cambios en el resto del código.

### Estado Actual
- **Almacenamiento**: localStorage
- **Servicio de persistencia**: `PersistenceService` (abstracto)
- **Capa de estado**: `AppStateService` (inyecta `PersistenceService`)

### Cómo Migrar a API/BD

#### Paso 1: Actualizar PersistenceService
En `src/app/services/persistence.service.ts`, descomenta las líneas de HTTP:

```typescript
// En load():
return await firstValueFrom(this.http.get<AppData>(this.apiUrl));

// En save():
await firstValueFrom(this.http.put(this.apiUrl, data));

// En clear():
await firstValueFrom(this.http.delete(this.apiUrl));
```

#### Paso 2: Configurar URL del Backend
En `persistence.service.ts`, actualiza:
```typescript
private apiUrl = 'https://tu-backend.com/api/app-data';
```

#### Paso 3: Backend Esperado
El backend debe implementar estos endpoints:

- `GET /api/app-data` - Retorna AppData
- `PUT /api/app-data` - Recibe y guarda AppData
- `DELETE /api/app-data` - Limpia datos

#### Interfaces del Backend
Usar las mismas interfaces que en `app-state.service.ts`:
- `AppData`
- `Course`, `Teacher`, `GalleryItem`
- `Registration`, `Stats`
- etc.

#### Notas Importantes
- ✅ El resto del código NO necesita cambios
- ✅ localStorage seguirá siendo el fallback si no hay conexión
- ✅ Las llamadas a `saveToStorage()` ya están preparadas para async
- ✅ HttpClient ya está configurado en app.config.ts

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
