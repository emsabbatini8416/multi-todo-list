import { faPen, faTrash, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { Button } from '../../../../shared/components/button/Button'
import { Chip } from '../../../../shared/components/chip/Chip'
import { Icon } from '../../../../shared/components/icon/Icon'
import type { TodoListCardProps } from './TodoListCard.types'

export function TodoListCard({
  isDeleting = false,
  onDelete,
  onEdit,
  todoList,
}: TodoListCardProps) {
  const completedItems = todoList.todoItems.filter((item) => item.done).length

  return (
    <article className="flex h-full flex-col rounded-[24px] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Todo list
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
            {todoList.name}
          </h3>
        </div>
        <Chip label={`${todoList.todoItems.length} tasks`} />
      </div>
      <p className="mb-6 text-sm text-[var(--text-secondary)]">
        {completedItems} completed, {todoList.todoItems.length - completedItems} pending.
      </p>
      <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          aria-label={`Open ${todoList.name}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          to={`/todo-lists/${todoList.id}`}
        >
          Open list
          <Icon icon={faArrowRight} />
        </Link>
        <Button
          aria-label={`Edit ${todoList.name}`}
          icon={faPen}
          onClick={() => onEdit(todoList.id)}
          variant="secondary"
        >
          Edit
        </Button>
        <Button
          aria-label={`Delete ${todoList.name}`}
          disabled={isDeleting}
          icon={faTrash}
          onClick={() => onDelete(todoList.id)}
          variant="danger"
        >
          Delete
        </Button>
      </div>
    </article>
  )
}
