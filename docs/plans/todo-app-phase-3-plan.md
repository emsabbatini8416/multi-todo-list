---
name: todo app phase 3
overview: "Implementar mejoras nice-to-have sobre la app todo: drag & drop de items por lista, theming dark/light con switch reusable, optimist updates en mutaciones y E2E para el frontend."
todos:
  - id: drag-drop-items
    content: Implementar drag & drop con dnd-kit en items de cada lista y actualizar tests
    status: completed
  - id: theme-switch
    content: Crear switch shared, lógica de tema, estilos light/dark y tests correspondientes
    status: in_progress
  - id: optimistic-updates
    content: Configurar optimistic updates en mutaciones de listas/items y corregir el bug de persistencia del checkbox/done
    status: pending
  - id: e2e-playwright
    content: Configurar Playwright y escribir E2E para listas, items y tema
    status: pending
isProject: false
---

# Plan Fase 3: Nice-to-have avanzados

## Objetivo

Añadir una tercera fase de mejoras sobre la app existente para elevar UX y robustez: drag & drop de items por lista sólo en frontend, theming dark/light con switch reusable, optimist updates en el flujo de datos y E2E para asegurar el comportamiento end-to-end, corrigiendo además el issue reportado del checkbox/estado `done`.

## Decisiones clave

- **Drag & Drop**: usar **`dnd-kit`** (headless, moderno, bien tipado, compatible con React 18 y accesible) para reordenar items dentro de cada lista **sin persistir en backend** (estado local por lista).
- **Theming**: implementar un **theme switcher light/dark** a nivel app usando:
  - CSS variables y clases `data-theme` en `body` o `html`.
  - Persistencia en `localStorage` para recordar la preferencia del usuario.
  - Integración con `prefers-color-scheme` para un valor inicial inteligente.
- **Optimistic updates**: aprovechar `@tanstack/react-query` para aplicar **`onMutate / onError / onSettled`** en las mutaciones de listas e items.
- **E2E**: usar **Playwright** para tests end-to-end del frontend, manteniendo Jest+RTL para unit/integration.
- **Bugfix**: revisar la integración entre el campo `done` del backend y el `Checkbox` para que cuando un item se marca como completado (tachado) el estado visual del checkbox se mantenga consistente tras refetch/recarga.

## Cambios de arquitectura

- Mantener la estructura actual `app / shared / modules`, añadiendo sólo:
  - `shared/components/switch/` para un **theme switch** reusable (con su type propio).
  - Helpers de theming en `shared/lib/theme.ts` (lectura/escritura de tema y sincronización con `document.documentElement`).
  - Pequeñas extensiones en `AppProviders` o un `ThemeProvider` dedicado.
- Integrar DnD únicamente en la capa de **items de una lista** (módulo `todo-list`), sin cambiar el contrato de backend.
- Añadir capa de E2E aislada (por ejemplo `frontend/e2e/`) con configuración de Playwright propia.

## Trabajo por feature

### A. Drag & Drop por lista (frontend-only)

1. **Infraestructura DnD**
   - Añadir `dnd-kit` a `frontend/package.json`.
   - Crear un pequeño wrapper en el módulo `todo-list` (por ejemplo `DraggableTodoList` o helpers) que encapsule `DndContext`, `SortableContext` y `useSortable`.
2. **Estado de orden local**
   - En `TodoListPage`, mantener el array de items en un estado derivado de la query (`useTodoItems`) para el **orden local**, sin modificar los ids.
   - Actualizar este estado en los handlers de drag end (`onDragEnd`) usando un helper de reorder basado en índices.
3. **Integración visual**
   - Hacer que cada `TodoListItem` reciba props necesarias para `dnd-kit` (atributos de drag, listeners, ref) sin acoplarse a la librería.
   - Asegurar accesibilidad: permitir reordenamiento con mouse, conservar orden lógico en DOM, mantener roles/list semantics.
4. **Unit tests**
   - Actualizar tests de `TodoListItem` para cubrir los nuevos atributos DnD (al menos que se apliquen refs/props correctamente).
   - Tests en `TodoListPage` para verificar que el orden local cambia en respuesta a un mock de `onDragEnd`.

### B. Theme switch dark/light

1. **Infraestructura de tema**
   - Crear `shared/lib/theme.ts` con helpers:
     - `getInitialTheme()` (lee `localStorage` o `prefers-color-scheme`).
     - `applyThemeToDocument(theme)` para setear `data-theme` y CSS variables.
   - Extender `index.css` con variables de color para `light` y `dark` (paleta coherente, manteniendo el look actual mejorado).
2. **Componente shared Switch**
   - En `shared/components/switch/` crear:
     - `Switch.types.ts` con un type tipo `{ checked: boolean; onCheckedChange: (value: boolean) => void; label?: string }`.
     - `Switch.tsx` implementando un toggle accesible (role `switch`, `aria-checked`, foco visible, soporte teclado espacio/enter).
3. **Integración en layout**
   - Añadir el `Switch` en `AppLayout` o en una barra superior (p.ej. al lado del título o en la esquina superior derecha), con labels claros: “Light/Dark” o iconos sol/luna.
   - Conectar con un `ThemeProvider` sencillo basado en `useState + useEffect`, persistiendo el valor en `localStorage` y aplicándolo vía helpers.
4. **Unit tests**
   - Tests para `Switch` (interacción mouse/teclado, aria attributes, snapshots).
   - Tests para helpers de tema (`getInitialTheme`, `applyThemeToDocument`) con `document` y `localStorage` mockeados.
   - Test para `AppLayout` o un pequeño `ThemeToggle` que verifique que el tema cambia y persiste al recargar.

### C. Optimistic updates con React Query

1. **Diseñar la estrategia por recurso**
   - Para listas (`create/update/delete`):
     - Usar `onMutate` para actualizar optimistamente la cache de `todoListQueryKeys.all` y, en detalle, `detail(todoListId)`.
     - Guardar snapshot `previousTodoLists` y restaurar en `onError`.
   - Para items (`create/toggle/update/delete`):
     - Optimismo sobre `items(todoListId)` y opcionalmente sobre `detail(todoListId)`.
     - En `toggle` y `update` cambiar `done`, `name`, `description` en memoria antes de la respuesta.
2. **Implementación concreta**
   - Refactorizar mutaciones en `useTodoList.ts` para usar `onMutate`, `onError`, `onSettled` en lugar de sólo `onSuccess/invalidations`.
   - Asegurar que los tipos se mantienen estrictos (usar `immer` opcionalmente o spreads cuidadosos).
3. **Bugfix checkbox/`done`**
   - Revisar flujo de `updateTodoItem` y `toggleTodoItem`:
     - Confirmar que el payload que se envía incluye `done` y que el backend lo persiste.
     - Alinear el render de `Checkbox` (`checked={item.done}`) y la lógica de re-fetch (collections + detail) para que el estado persista también tras recargar.
     - Añadir un test que simule una carga inicial con `done: true` y verifique que tanto texto como checkbox están en estado completado.
4. **Unit tests**
   - Extender `useTodoList.test.tsx` para cubrir paths de `onMutate/onError` (mocks de fallos en servicio) y garantizar que la cache se revierte correctamente.
   - Tests adicionales de componentes para verificar que el UI responde inmediatamente (optimistic) antes de la resolución promesa.

### D. E2E con Playwright

1. **Setup Playwright**
   - Añadir Playwright al repo frontend con configuración mínima (por ejemplo en `frontend/playwright.config.ts`).
   - Definir `npm scripts`:
     - `e2e`: ejecuta Playwright contra `npm run dev` o `npm run preview`.
2. **Escenarios E2E**
   - `todo-lists.e2e.spec`:
     - Carga `/todo-lists`, crea una lista, edita el nombre, verifica persistencia tras refresh, borra la lista.
   - `todo-items.e2e.spec`:
     - Carga `/todo-lists`, entra al detalle de una lista existente, crea item, edita, marca como completado, reordena por drag & drop, borra item.
   - `theme.e2e.spec`:
     - Cambia de light a dark, verifica cambio de colores/clases, recarga y confirma persistencia del tema.
3. **Integración CI-local**
   - Documentar en `README.md` cómo correr los E2E (`npm run e2e`) y requisitos (backend levantado, puertos, etc.).

## Bug conocido a corregir

- **Checkbox y texto tachado desincronizados**:
  - Síntoma: en algunas listas un item aparece tachado pero el checkbox no mantiene el estado marcado tras ciertas operaciones.
  - En fase 3, durante la implementación de optimistic updates y tests adicionales de items, se:
    - Revisará la fuente de verdad (`done` en responses del backend).
    - Asegurará que tanto el `Checkbox` como el estilo tachado dependen del mismo campo `done`.
    - Añadirá pruebas unitarias y E2E específicas para capturar este caso.

## Todos de implementación

- `drag-drop-items`: Implementar drag & drop con dnd-kit en items de cada lista y actualizar tests.
- `theme-switch`: Crear switch shared, lógica de tema, estilos light/dark y tests correspondientes.
- `optimistic-updates`: Configurar optimistic updates en todas las mutaciones críticas y cerrar el bug del checkbox/`done`.
- `e2e-playwright`: Configurar Playwright y escribir escenarios E2E para listas, items y tema.
