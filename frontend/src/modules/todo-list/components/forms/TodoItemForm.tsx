import { useState } from 'react'
import { Button } from '../../../../shared/components/button/Button'
import { FormField } from '../../../../shared/components/form-field/FormField'
import { Input } from '../../../../shared/components/input/Input'
import { Textarea } from '../../../../shared/components/textarea/Textarea'
import type { TodoItemFormProps } from './TodoItemForm.types'

export function TodoItemForm({
  idPrefix = 'todo-item',
  initialValues,
  isSubmitting = false,
  onCancel,
  onSubmit,
  submitLabel,
}: TodoItemFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const nameId = `${idPrefix}-name`
  const descriptionId = `${idPrefix}-description`

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      return
    }

    await onSubmit({
      description: description.trim() || undefined,
      name: trimmedName,
    })

    if (!initialValues?.name) {
      setName('')
      setDescription('')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <FormField
          hint="Keep the task title action-oriented."
          htmlFor={nameId}
          label="Task name"
        >
          <Input
            id={nameId}
            onChange={(event) => setName(event.target.value)}
            placeholder="Review the design system"
            value={name}
          />
        </FormField>
        <FormField
          hint="Optional notes help clarify the task."
          htmlFor={descriptionId}
          label="Description"
        >
          <Textarea
            id={descriptionId}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add context, links, or acceptance criteria..."
            rows={3}
            value={description}
          />
        </FormField>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={isSubmitting || !name.trim()} type="submit">
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}
