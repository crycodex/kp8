# Dashboard de Proyectos

Mini dashboard para gestionar proyectos, desarrollado con Next.js 16 (App Router), TypeScript, Tailwind CSS y shadcn/ui.

## Comenzar

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) y navega a **Proyectos** para empezar.

## Funcionalidades

- **Listado de proyectos** (`/projects`) — Tabla con búsqueda por nombre o cliente, botón para crear
- **Crear proyecto** (`/projects/new`) — Formulario con validación, feedback de éxito/error
- **Detalle de proyecto** (`/projects/[id]`) — Información completa, marcar como completado

## Stack tecnológico

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Route Handlers para la API
- next-themes (modo claro/oscuro)

## Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/projects` | Listar todos los proyectos |
| POST | `/api/projects` | Crear un proyecto |
| GET | `/api/projects/[id]` | Obtener proyecto por ID |
| PATCH | `/api/projects/[id]` | Actualizar proyecto (ej. estado) |

## Persistencia

- **Servidor**: Los datos se almacenan en `.data/projects.json` (almacenamiento local basado en archivo). Los Route Handlers se ejecutan en el servidor y no pueden acceder al LocalStorage del navegador.
- **Cliente**: Las respuestas de la API se sincronizan con LocalStorage para cargas más rápidas y caché. En la primera carga, se muestra inmediatamente el caché de LocalStorage cuando está disponible.

## Decisiones técnicas

1. **Almacenamiento en archivo en el servidor**: Los Route Handlers de Next.js se ejecutan en el servidor donde no existe LocalStorage. Un archivo JSON (`.data/projects.json`) proporciona persistencia local equivalente sin base de datos.
2. **Sincronización LocalStorage en el cliente**: Todas las respuestas de la API se escriben en LocalStorage para que el cliente tenga un espejo de los datos y se muestren al instante en visitas posteriores.
3. **Validación**: Validación tanto en el cliente (formulario) como en el servidor (API) para nombre y cliente (mín. 2 caracteres).
4. **Tema claro/oscuro**: Selector manual con opciones Claro, Oscuro y Sistema (preferencia del SO).

## Mejoras futuras

- Transiciones de estado (Planificado → En progreso → Completado) en lugar de solo "Marcar como Completado"
- Formulario de edición de proyecto
- Eliminar proyecto
- Paginación para listas grandes
- Filtros por estado

---

**Desarrollado por** [@cry.code](https://www.isnotcristhianr.dev/)
