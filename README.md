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

La aplicación utiliza un servicio de persistencia conectado a Supabase para el almacenamiento de datos.

### Estado Actual
- **Almacenamiento**: Supabase
- **Servicio de persistencia**: `PersistenceService`
- **Capa de estado**: `AppStateService` (inyecta `PersistenceService`)


## Supabase
- Project url: https://tnuutwqkewghpvtnjuzm.supabase.co

- Project ID: tnuutwqkewghpvtnjuzm

