import { useMemo, useState } from 'react'
import { AppLayout } from '../../../app/layouts/AppLayout'
import { EmptyState } from '../../../shared/components/empty-state/EmptyState'
import { Modal } from '../../../shared/components/modal/Modal'
import { PageHeader } from '../../../shared/components/page-header/PageHeader'
import { Spinner } from '../../../shared/components/spinner/Spinner'
import {
  useCreateTodoList,
  useDeleteTodoList,
  useTodoList,
  useTodoLists,
  useUpdateTodoList,
} from '../hooks/useTodoList'
import { TodoListForm } from '../components/forms/TodoListForm'
import { TodoListCard } from '../components/lists/TodoListCard'

export function TodoListsPage() {
  const [editingTodoListId, setEditingTodoListId] = useState<number>()

  const todoListsQuery = useTodoLists()
  const createTodoListMutation = useCreateTodoList()
  const deleteTodoListMutation = useDeleteTodoList()
  const editingTodoListQuery = useTodoList(editingTodoListId, Boolean(editingTodoListId))
  const updateTodoListMutation = useUpdateTodoList(editingTodoListId)

  const summary = useMemo(() => {
    const todoLists = todoListsQuery.data ?? []
    const totalItems = todoLists.reduce((count, todoList) => count + todoList.todoItems.length, 0)

    return {
      totalItems,
      totalLists: todoLists.length,
    }
  }, [todoListsQuery.data])

  async function handleCreateTodoList(payload: { name: string }) {
    await createTodoListMutation.mutateAsync(payload)
  }

  async function handleUpdateTodoList(payload: { name: string }) {
    await updateTodoListMutation.mutateAsync(payload)
    setEditingTodoListId(undefined)
  }

  async function handleDeleteTodoList(todoListId: number) {
    await deleteTodoListMutation.mutateAsync(todoListId)
  }

  return (
    <AppLayout
      description="Create, rename, and remove lists, then drill into each one for item-level work."
      title="To-Do Lists"
    >
      <div className="space-y-8">
        <PageHeader
          description={`${summary.totalLists} lists and ${summary.totalItems} total tasks across the workspace.`}
          eyebrow="Workspace"
          title="Organize work by list"
        />

        <section className="grid gap-8 xl:grid-cols-[24rem_1fr]">
          <div className="flex h-full flex-col rounded-[24px] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Create
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                Create a new list
              </h3>
            </div>
            <TodoListForm
              idPrefix="create-todo-list"
              isSubmitting={createTodoListMutation.isPending}
              onSubmit={handleCreateTodoList}
              submitLabel="Create list"
            />
          </div>

          <div>
            {todoListsQuery.isLoading ? (
              <div className="flex min-h-64 items-center justify-center">
                <Spinner label="Loading todo lists" />
              </div>
            ) : null}

            {todoListsQuery.isError ? (
              <EmptyState
                description="Try again in a moment or verify the backend is running."
                title="Could not load your lists"
              />
            ) : null}

            {!todoListsQuery.isLoading &&
            !todoListsQuery.isError &&
            todoListsQuery.data &&
            todoListsQuery.data.length === 0 ? (
              <EmptyState
                description="Create the first list to start grouping tasks by project, team, or context."
                title="No lists yet"
              />
            ) : null}

            {!todoListsQuery.isLoading &&
            !todoListsQuery.isError &&
            todoListsQuery.data &&
            todoListsQuery.data.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {todoListsQuery.data.map((todoList) => (
                  <TodoListCard
                    isDeleting={deleteTodoListMutation.isPending}
                    key={todoList.id}
                    onDelete={handleDeleteTodoList}
                    onEdit={setEditingTodoListId}
                    todoList={todoList}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <Modal
        description="Update the list title to keep the workspace easy to scan."
        isOpen={Boolean(editingTodoListId)}
        onClose={() => setEditingTodoListId(undefined)}
        title="Edit list"
      >
        {editingTodoListQuery.isLoading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Spinner label="Loading selected list" />
          </div>
        ) : null}

        {editingTodoListQuery.data ? (
          <TodoListForm
            idPrefix="edit-todo-list"
            initialValue={editingTodoListQuery.data.name}
            isSubmitting={updateTodoListMutation.isPending}
            onCancel={() => setEditingTodoListId(undefined)}
            onSubmit={handleUpdateTodoList}
            submitLabel="Save changes"
          />
        ) : null}
      </Modal>
    </AppLayout>
  )
}
