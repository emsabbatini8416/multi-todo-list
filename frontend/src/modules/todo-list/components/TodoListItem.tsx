import { faGripVertical, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '../../../shared/components/button/Button'
import { Checkbox } from '../../../shared/components/checkbox/Checkbox'
import { cn } from '../../../shared/lib/cn'
import type { TodoListItemProps } from './TodoListItem.types'

export function TodoListItem({
  isDeleting = false,
  isEditing = false,
  isToggling = false,
  item,
  onDelete,
  onEdit,
  onToggle,
}: TodoListItemProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  })

  const isBusy = isDeleting || isEditing || isToggling
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      className={cn(
        'rounded-[24px] border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-sm',
        isDragging && 'border-slate-400 shadow-lg',
      )}
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center gap-4">
        <button
          aria-label={`Reorder ${item.name}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[var(--text-secondary)] hover:border-slate-400 hover:bg-slate-100/60 touch-none"
          style={{ touchAction: 'none' }}
          type="button"
          {...attributes}
          {...listeners}
        >
          <span aria-hidden="true" className="text-lg">
            ⋮⋮
          </span>
        </button>
        <Checkbox
          aria-label={`Mark ${item.name} as ${item.done ? 'pending' : 'completed'}`}
          checked={item.done}
          disabled={isBusy}
          onClick={() => onToggle(item)}
        />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-xl font-semibold text-[var(--text-primary)]',
              item.done && 'text-[var(--text-secondary)] line-through decoration-2',
            )}
          >
            {item.name}
          </p>
          {item.description ? (
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {item.description}
            </p>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            aria-label={`Edit ${item.name}`}
            className="h-10 w-10"
            disabled={isBusy}
            icon={faPen}
            onClick={() => onEdit(item.id)}
            shape="circle"
            variant="secondary"
          />
          <Button
            aria-label={`Delete ${item.name}`}
            className="h-10 w-10"
            disabled={isBusy}
            icon={faTrash}
            onClick={() => onDelete(item.id)}
            shape="circle"
            variant="ghost"
          />
        </div>
      </div>
    </li>
  )
}
