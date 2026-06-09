# Peña

### Pendientes:
#### Panel de control (dashboard)
Los datos editables son:
- Perfil de la Peña
- Autoridades
- Docentes
- Cursos
- Galeria de arte
- Estado de los visitantes a la galeria
- Inscripción en los cursos (registración)
El panel de control permitirá que un usuario autorizado pueda cambiar (crear o modificar) la información de los items anteriores.

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
