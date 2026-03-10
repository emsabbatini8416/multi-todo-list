# To-Do Lists UI (frontend)

Aplicación de listas de tareas construida con **Vite + React 18 + TypeScript**, estilada con **Tailwind v4** y soportando **tema claro/oscuro**, drag & drop y una arquitectura modular basada en dominios.

---

## Stack y características principales

- **Build**: Vite + TypeScript.
- **UI**: React 18, Tailwind v4, CSS variables para theming.
- **Routing**: `react-router-dom` (rutas `/todo-lists` y `/todo-lists/:todoListId`).
- **Data fetching / cache**: `@tanstack/react-query` con `QueryClient` compartido.
- **Drag & drop**: `@dnd-kit/core`, `@dnd-kit/sortable`.
- **Iconografía**: Font Awesome (solid).
- **Testing**: Jest + React Testing Library, cobertura mínima global al **80 %**.

---

## Requisitos previos

- Node.js 18+ (recomendado)  
- npm 9+  

---

## Scripts disponibles

Desde la carpeta `frontend`:

- **Instalar dependencias**

  ```bash
  npm install
  ```

- **Desarrollo (HMR)**

  ```bash
  npm run dev
  ```

- **Build de producción**

  ```bash
  npm run build
  ```

- **Preview del build**

  ```bash
  npm run preview
  ```

- **Tests unitarios / integración**

  ```bash
  npm test -- --runInBand
  ```

- **Cobertura**

  ```bash
  npm run test:coverage
  ```

  La cobertura mínima global está configurada al **80 %** en `jest.config.cjs`.

---

## Estructura del proyecto

```text
frontend/
  src/
    app/
      App.tsx
      layouts/AppLayout.tsx
      providers/AppProviders.tsx
      providers/useTheme.ts
      router/AppRouter.tsx

    modules/
      todo-list/
        pages/
          TodoListsPage.tsx
          TodoListPage.tsx
        components/
          forms/
          lists/
          TodoListItem.tsx
        hooks/
          useTodoList.ts
        services/
          todoList.service.ts
        types/

    shared/
      components/
        button/
        checkbox/
        chip/
        empty-state/
        form-field/
        icon/
        input/
        layout/
        modal/
        page-header/
        spinner/
        switch/
        textarea/
      lib/
        api.ts
        cn.ts
        env.ts
        queryClient.ts
        theme.ts

    test/
      setupTests.ts
      renderWithProviders.tsx
```

- Las páginas (`TodoListsPage`, `TodoListPage`) usan `AppLayout`, que aplica el layout principal, el switch de tema y el encabezado.
- La lógica de dominio de to-do lists vive exclusivamente en `modules/todo-list` y consume componentes `shared` puros de UI.

---

## Theming (light / dark)

El tema se gestiona con un contexto global:

- `AppProviders` (`src/app/providers/AppProviders.tsx`) crea un `ThemeContext` y aplica el tema al `document.documentElement` usando `data-theme`.
- `useTheme` (`src/app/providers/useTheme.ts`) expone `{ theme, setTheme, toggleTheme }`.
- El switch de tema está en `src/shared/components/switch/Switch.tsx` y llama a `toggleTheme`.

Las variables de color se definen en `src/index.css`:

- `:root` (tema claro):
  - **Layout**: `--page-bg`, `--page-bg-accent`, `--panel-bg`, `--panel-border`, `--panel-shadow`.
  - **Cards / texto**: `--card-bg`, `--card-border`, `--text-primary`, `--text-secondary`, `--text-muted`.
  - **Form controls**: `--input-bg`, `--input-border`.
- `:root[data-theme='dark']` (tema oscuro) redefine estas variables con valores equivalentes para dark.

Los componentes usan estas variables a través de utilidades tailwind:

- `bg-[var(--card-bg)]`, `border-[var(--card-border)]` en cards y paneles.
- `text-[var(--text-primary)]`, `text-[var(--text-secondary)]` para encabezados y descripciones.
- Inputs y textareas usan `bg-[var(--input-bg)]` y `border-[var(--input-border)]`.

---

## Data fetching y React Query

La app usa `@tanstack/react-query` para cache de datos y estados de carga:

- `src/shared/lib/queryClient.ts` expone un `QueryClient` con opciones por defecto.
- `src/shared/lib/api.ts` define `apiFetch`, un wrapper sobre `fetch` que:
  - Prepara el cuerpo JSON.
  - Normaliza errores HTTP.
  - Usa `VITE_API_URL` (`frontend/.env`) como base (`/api` del backend NestJS).

El módulo de todo-list tiene todos los hooks de datos en `src/modules/todo-list/hooks/useTodoList.ts`:

- **Queries**:
  - `useTodoLists()` – obtiene todas las listas.
  - `useTodoList(id)` – detalle de una lista.
  - `useTodoItems(listId)` – items de una lista.
  - `useTodoItem(listId, itemId)` – detalle de un item.
- **Mutations** (todas basadas en `todoList.service.ts`):
  - `useCreateTodoList`, `useUpdateTodoList`, `useDeleteTodoList`.
  - `useCreateTodoItem`, `useToggleTodoItem`, `useUpdateTodoItem`, `useDeleteTodoItem`.
  - `useToggleTodoItem` aplica **optimistic updates** sobre la cache (`done` se invierte inmediatamente) y luego invalida/repone datos desde el backend.

Las llamadas HTTP se centralizan en `src/modules/todo-list/services/todoList.service.ts`, que compone las rutas `/todo-lists`, `/todo-lists/:id`, `/todo-lists/:id/todo-items`, etc.

---

## Drag & Drop

El reordenamiento de items dentro de una lista usa `@dnd-kit`:

- `TodoListPage` (`src/modules/todo-list/pages/TodoListPage.tsx`) envuelve la lista en `DndContext` + `SortableContext` y usa `arrayMove` para mantener un estado local `orderedItems`.
- Cada `TodoListItem` integra `useSortable` y aplica:
  - Un **handle de drag** dedicado (botón con `⋮⋮`) que recibe `attributes`/`listeners`.
  - Transformaciones CSS (`transform`, `transition`) en el `<li>` para las animaciones.

El handle permite arrastrar sin bloquear los botones de acción (`Edit`, `Delete`) ni el checkbox.

---

## Accesibilidad

Se han incorporado roles y atributos ARIA para que la UI sea navegable con readers y teclado:

- `Checkbox` (`shared/components/checkbox/Checkbox.tsx`):
  - `role="checkbox"` + `aria-checked`.
  - Visible focus ring y estados marcados con color de alto contraste.
- `Switch` (`shared/components/switch/Switch.tsx`):
  - `role="switch"` + `aria-checked`.
- `Modal` (`shared/components/modal/Modal.tsx`):
  - `role="dialog"` + `aria-modal="true"`, botón de cierre accesible.
- `Spinner` (`shared/components/spinner/Spinner.tsx`):
  - `role="status"` + `aria-label` descriptivo.
- Labels explícitos (`<label htmlFor=...>`) en `FormField` e inputs.

Los tests usan `getByRole`, `getByLabelText`, `getByText` de React Testing Library para validar que estos roles/labels existan.

---

## Testing

La configuración de Jest está en `frontend/jest.config.cjs`:

- Usa `ts-jest` con soporte ESM.
- `setupFilesAfterEnv` -> `src/test/setupTests.ts` (incluye `@testing-library/jest-dom` y polyfills).
- `collectCoverageFrom` apunta a `src/**/*.{ts,tsx}` excluyendo tipos, `main.tsx`, etc.
- `coverageThreshold.global` fijado en 80 % para branches, functions, lines y statements.

Suites principales:

- `src/app/app.test.tsx` – App, providers, layout y enrutado básico.
- `src/shared/components/shared-components.test.tsx` – tests y snapshots de componentes UI (`Button`, `Input`, `Checkbox`, `Modal`, `PageHeader`, `Chip`, etc.).
- `src/shared/lib/shared-lib.test.ts` – utilidades (`cn`, `env`, `apiFetch`, `queryClient`).
- `src/modules/todo-list/services/todoList.service.test.ts` – contrato de endpoints del backend.
- `src/modules/todo-list/hooks/useTodoList.test.tsx` – hooks de React Query (queries/mutations).
- `src/modules/todo-list/components/components.test.tsx` – formularios, cards, items y comportamiento de UI.
- `src/modules/todo-list/pages/pages.test.tsx` – flujos completos en `TodoListsPage` y `TodoListPage`.
- `src/modules/todo-list/routes/*.test.tsx` – pruebas simples de los route-wrappers.

Ejecuta toda la suite con:

```bash
npm test -- --runInBand
```

---

## Decisiones de diseño

- **Separación `shared` vs `modules`**  
  Todo lo que no depende del dominio (botones, inputs, layout, modales) vive en `src/shared`.  
  Toda la lógica y tipos de listas de tareas vive en `src/modules/todo-list`.

- **Theming con CSS variables + Tailwind**  
  En lugar de duplicar clases Tailwind para light/dark, se usan variables (`--card-bg`, `--text-primary`, etc.) aplicadas en pocas hojas (`index.css`) y consumidas vía `bg-[var(--...)]` / `text-[var(--...)]`.

- **React Query como capa de datos**  
  Permite cachear listas/items, manejar estados de carga/error y hacer optimistic updates en toggles, manteniendo la UI rápida.

- **Arquitectura de rutas simple**  
  `/todo-lists` muestra todas las listas (incluye creación/edición/borrado).  
  `/todo-lists/:todoListId` muestra los items de una lista con drag & drop, edición inline y estados vacíos.

Este README debería darte suficiente contexto para extender la app, depurar problemas o integrar nuevas features sin tener que bucear todo el código desde cero.
