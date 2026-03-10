import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const TodoListsRoute = lazy(
  () => import('../../modules/todo-list/routes/TodoListsRoute'),
)
const TodoListRoute = lazy(
  () => import('../../modules/todo-list/routes/TodoListRoute'),
)

export function AppRouter() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/todo-lists" replace />} />
        <Route path="/todo-lists" element={<TodoListsRoute />} />
        <Route path="/todo-lists/:todoListId" element={<TodoListRoute />} />
      </Routes>
    </Suspense>
  )
}
