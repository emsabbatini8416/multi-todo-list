import { useEffect, useMemo, useState } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useParams } from 'react-router-dom'
import { AppLayout } from '../../../app/layouts/AppLayout'
import { EmptyState } from '../../../shared/components/empty-state/EmptyState'
import { Modal } from '../../../shared/components/modal/Modal'
import { PageHeader } from '../../../shared/components/page-header/PageHeader'
import { Spinner } from '../../../shared/components/spinner/Spinner'
import { TodoItemForm } from '../components/forms/TodoItemForm'
import { TodoListItem } from '../components/TodoListItem'
import {
  useCreateTodoItem,
  useDeleteTodoItem,
  useTodoItem,
  useTodoItems,
  useTodoList,
  useToggleTodoItem,
  useUpdateTodoItem,
} from '../hooks/useTodoList'
import type { TodoItem } from '../types/todo.types'

export function TodoListPage() {
  const [editingTodoItemId, setEditingTodoItemId] = useState<number>()
  const [orderedItems, setOrderedItems] = useState<TodoItem[]>([])
  const { todoListId } = useParams()
  const parsedTodoListId = Number(todoListId)
  const isValidTodoListId = Number.isFinite(parsedTodoListId) && parsedTodoListId > 0

  const todoListQuery = useTodoList(parsedTodoListId, isValidTodoListId)
  const todoItemsQuery = useTodoItems(parsedTodoListId)
  const editingTodoItemQuery = useTodoItem(
    parsedTodoListId,
    editingTodoItemId,
    Boolean(editingTodoItemId),
  )

  const createTodoItemMutation = useCreateTodoItem(parsedTodoListId)
  const toggleTodoItemMutation = useToggleTodoItem(parsedTodoListId)
  const updateTodoItemMutation = useUpdateTodoItem(parsedTodoListId, editingTodoItemId)
  const deleteTodoItemMutation = useDeleteTodoItem(parsedTodoListId)

  const completedItems = useMemo(() => {
    return orderedItems.filter((item) => item.done).length
  }, [orderedItems])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    if (todoItemsQuery.data) {
      setOrderedItems(todoItemsQuery.data)
    }
  }, [todoItemsQuery.data])

  function handleToggleTodo(item: TodoItem) {
    toggleTodoItemMutation.mutate(item)
  }

  function handleDeleteTodo(todoItemId: number) {
    deleteTodoItemMutation.mutate(todoItemId)
  }

  async function handleCreateTodoItem(payload: { description?: string; name: string }) {
    await createTodoItemMutation.mutateAsync(payload)
  }

  async function handleUpdateTodoItem(payload: { description?: string; name: string }) {
    await updateTodoItemMutation.mutateAsync(payload)
    setEditingTodoItemId(undefined)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = orderedItems.findIndex((item) => item.id === active.id)
    const newIndex = orderedItems.findIndex((item) => item.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    setOrderedItems((items) => arrayMove(items, oldIndex, newIndex))
  }

  if (!isValidTodoListId) {
    return (
      <AppLayout
        backHref="/todo-lists"
        description="The selected list identifier is invalid."
        title="Todo list"
      >
        <EmptyState
          description="Return to the list overview and choose a valid workspace list."
          title="Invalid list id"
        />
      </AppLayout>
    )
  }

  return (
    <AppLayout
      backHref="/todo-lists"
      description="Track every item in the selected list, update details, and mark tasks complete."
      title={todoListQuery.data?.name ?? 'Todo list detail'}
    >
      <div className="space-y-8">
        <PageHeader
          description={`${todoItemsQuery.data?.length ?? 0} tasks, ${completedItems} completed.`}
          eyebrow="Detail view"
          title={todoListQuery.data?.name ?? 'Selected list'}
        />

        <section className="rounded-[24px] border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
          <h3 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
            Create a new task
          </h3>
          <TodoItemForm
            idPrefix="create-todo-item"
            isSubmitting={createTodoItemMutation.isPending}
            onSubmit={handleCreateTodoItem}
            submitLabel="Add task"
          />
        </section>

        {todoListQuery.isLoading || todoItemsQuery.isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner label="Loading todo list detail" />
          </div>
        ) : null}

        {todoListQuery.isError || todoItemsQuery.isError ? (
          <EmptyState
            description="Return to the overview or retry when the backend is available."
            title="Could not load this list"
          />
        ) : null}

        {!todoItemsQuery.isLoading &&
        !todoItemsQuery.isError &&
        orderedItems.length === 0 ? (
          <EmptyState
            description="Add the first task to turn this list into an actionable plan."
            title="No tasks in this list"
          />
        ) : null}

        {!todoItemsQuery.isLoading &&
        !todoItemsQuery.isError &&
        orderedItems.length > 0 ? (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext items={orderedItems.map((item) => item.id)}>
              <ul className="m-0 grid list-none gap-4 p-0">
                {orderedItems.map((item) => (
                  <TodoListItem
                    isDeleting={deleteTodoItemMutation.isPending}
                    isEditing={updateTodoItemMutation.isPending}
                    isToggling={toggleTodoItemMutation.isPending}
                    item={item}
                    key={item.id}
                    onDelete={handleDeleteTodo}
                    onEdit={setEditingTodoItemId}
                    onToggle={handleToggleTodo}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        ) : null}
      </div>

      <Modal
        description="Update the task title or description without losing the current completion state."
        isOpen={Boolean(editingTodoItemId)}
        onClose={() => setEditingTodoItemId(undefined)}
        title="Edit task"
      >
        {editingTodoItemQuery.isLoading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Spinner label="Loading selected todo item" />
          </div>
        ) : null}

        {editingTodoItemQuery.data ? (
          <TodoItemForm
            idPrefix="edit-todo-item"
            initialValues={{
              description: editingTodoItemQuery.data.description,
              name: editingTodoItemQuery.data.name,
            }}
            isSubmitting={updateTodoItemMutation.isPending}
            onCancel={() => setEditingTodoItemId(undefined)}
            onSubmit={handleUpdateTodoItem}
            submitLabel="Save changes"
          />
        ) : null}
      </Modal>
    </AppLayout>
  )
}
