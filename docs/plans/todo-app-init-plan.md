---
name: todo app modular
overview: Construir una app de una sola `todo-list` sobre Vite + React + TypeScript, usando Tailwind, React Router con lazy loading, React Query y una arquitectura modular con `shared`, `modules` y `services` por dominio.
todos:
  - id: setup-base
    content: Instalar y configurar Tailwind, React Router, React Query, Font Awesome y variable `VITE_API_URL` en el frontend
    status: completed
  - id: create-architecture
    content: Crear la estructura `app/shared/modules` con providers globales, router lazy y layout base
    status: completed
  - id: build-shared-ui
    content: Implementar componentes reutilizables `Button`, `Icon`, `Input`, `Checkbox` y `Layout` con sus types
    status: completed
  - id: build-todo-module
    content: Implementar el módulo `todo-list` con página, componentes propios, tipos, servicios y hooks de React Query
    status: completed
  - id: integrate-and-verify
    content: Conectar la UI con el backend real, resolver lista única por defecto y validar estados loading/empty/error
    status: completed
---

# Plan para la app Todo List

## Objetivo

Implementar el frontend a partir del mockup compartido, tomando como base el contrato real del backend (`todoItems`) y manteniendo una arquitectura modular, reusable y escalable.

## Decisiones clave

- La UI será de **una sola lista visible**.
- El frontend consumirá el contrato real del backend: `TodoList { id, name, todoItems }`.
- Para Vite, la variable de entorno debe exponerse como `VITE_API_URL`; propondré usar `VITE_API_URL=http://localhost:4000/api`.
- La ruta principal será `todo-list`, cargada con `React.lazy`.
- Se usará `@tanstack/react-query` para cache, invalidación y refetch automático tras mutaciones.

## Contrato API del módulo

- Base URL frontend: `VITE_API_URL=http://localhost:4000/api`
- Endpoints disponibles en backend:
  - `GET /todo-lists`
  - `POST /todo-lists`
  - `GET /todo-lists/:todoListId`
  - `PUT /todo-lists/:todoListId`
  - `DELETE /todo-lists/:todoListId`
  - `POST /todo-lists/:todoListId/todo-items`
  - `GET /todo-lists/:todoListId/todo-items`
  - `GET /todo-lists/:todoListId/todo-items/:todoItemId`
  - `PUT /todo-lists/:todoListId/todo-items/:todoItemId`
  - `DELETE /todo-lists/:todoListId/todo-items/:todoItemId`
- Endpoints que usará inicialmente la UI de una sola lista:
  - `GET /todo-lists`
  - `POST /todo-lists`
  - `POST /todo-lists/:todoListId/todo-items`
  - `PUT /todo-lists/:todoListId/todo-items/:todoItemId`
  - `DELETE /todo-lists/:todoListId/todo-items/:todoItemId`

## Estructura propuesta

- `frontend/src/app/`
  - bootstrap de providers globales
  - router principal
  - layout base de la app
- `frontend/src/shared/`
  - componentes reusables: button, icon, input, checkbox, layout
  - types y utilidades compartidas
  - cliente HTTP/config de entorno
- `frontend/src/modules/todo-list/`
  - `components/` propios del módulo
  - `types/` del módulo
  - `services/` para requests del dominio
  - `hooks/` para queries/mutations con React Query
  - `pages/` y `routes/` para lazy loading

## Trabajo a realizar

1. Preparar la base del proyecto frontend.
   - Añadir dependencias en `frontend/package.json`: `tailwindcss`, `@tanstack/react-query`, `react-router-dom`, `@fortawesome/*` y utilidades mínimas de estilos si hacen falta.
   - Reemplazar el template actual de `frontend/src/App.tsx` y el arranque de `frontend/src/main.tsx`.
   - Configurar estilos globales en `frontend/src/index.css` para Tailwind y tokens visuales del mockup.
2. Montar la arquitectura `app/shared/modules`.
   - Crear router central y providers globales con `BrowserRouter`, `QueryClientProvider` y `Suspense`.
   - Definir un `AppLayout` reutilizable para centrar la tarjeta principal y sostener la estética del mockup.
   - Crear la carpeta de componentes base reutilizables con su type por componente.
3. Implementar la librería de UI reusable.
   - `Button`: variantes para acción circular con icono y acción textual, permitiendo iconos de Font Awesome.
   - `Icon`: wrapper para estandarizar iconos importados.
   - `Input`: input estilizado como el mockup, pensado para alta de tarea.
   - `Checkbox`: control circular con estado checked/unchecked alineado al diseño.
   - `Layout`: contenedor/tarjeta principal y helpers de composición.
4. Crear el módulo `todo-list` con lazy route.
   - Definir ruta `todo-list` cargada con `React.lazy`.
   - Implementar una página contenedora que represente la única lista visible.
   - Crear componentes propios del módulo, por ejemplo: formulario de alta, item de tarea, lista vacía y lista de tareas.
5. Integrar servicios y tipos del dominio.
   - Crear tipos de frontend alineados al backend:
     - `TodoItem { id, name, description?, done }`
     - `TodoList { id, name, todoItems }`
   - Crear servicios del módulo para consumir:
     - `GET /todo-lists`
     - `POST /todo-lists/:todoListId/todo-items`
     - `PUT /todo-lists/:todoListId/todo-items/:todoItemId`
     - `DELETE /todo-lists/:todoListId/todo-items/:todoItemId`
   - Resolver la estrategia de “lista única” obteniendo la primera lista disponible; si no existe, crear una por defecto desde frontend.
6. Implementar estado servidor con React Query.
   - Query para obtener la lista activa.
   - Mutations para crear tarea, marcar completada y eliminar tarea.
   - Invalidaciones/refetch para reflejar cambios sin refresh del navegador.
   - Manejo básico de loading, empty state y error state.
7. Traducir el mockup a UI funcional.
   - Reproducir tarjeta centrada con header oscuro, cuerpo claro y bordes redondeados.
   - Respetar interacciones del mockup: botón `+`, botón `x`, checkbox circular y texto tachado al completar.
   - Mostrar estado vacío con mensaje tipo “No tasks have been entered yet”.
8. Ajustar integración local y validación final.
   - Añadir `.env` del frontend con `VITE_API_URL`.
   - Verificar el flujo completo contra el backend en `localhost:4000`.
   - Si aparece bloqueo por CORS, dejar señalado que el backend necesita `enableCors()` para que el frontend en Vite pueda consumirlo desde el navegador.

## Archivos más relevantes

- Base actual:
  - `frontend/package.json`
  - `frontend/src/main.tsx`
  - `frontend/src/App.tsx`
  - `frontend/src/index.css`
- Backend de referencia:
  - `backend/src/todo-lists/todo-lists.controller.ts`
  - `backend/src/todo-lists/entities/todo-list.entity.ts`
  - `backend/src/todo-lists/entities/todo-item.entity.ts`
  - `backend/src/main.ts`

## Riesgos a vigilar

- Vite no expone `API_URL`; debe ser `VITE_API_URL`.
- El backend actual no muestra CORS habilitado.
- El mockup no expone edición de texto ni manejo de varias listas; esa parte quedará acotada a crear, completar y borrar tareas dentro de una única lista visible.
