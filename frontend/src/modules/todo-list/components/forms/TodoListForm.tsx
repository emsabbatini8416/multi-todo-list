import { useState } from 'react'
import { Button } from '../../../../shared/components/button/Button'
import { FormField } from '../../../../shared/components/form-field/FormField'
import { Input } from '../../../../shared/components/input/Input'
import type { TodoListFormProps } from './TodoListForm.types'

export function TodoListForm({
  idPrefix = 'todo-list',
  initialValue = '',
  isSubmitting = false,
  onCancel,
  onSubmit,
  submitLabel,
}: TodoListFormProps) {
  const [name, setName] = useState(initialValue)
  const inputId = `${idPrefix}-name`

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      return
    }

    await onSubmit({ name: trimmedName })

    if (!initialValue) {
      setName('')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormField
        hint="Use a short, descriptive title people can scan quickly."
        htmlFor={inputId}
        label="List name"
      >
        <Input
          id={inputId}
          onChange={(event) => setName(event.target.value)}
          placeholder="Personal, Work, Groceries..."
          value={name}
        />
      </FormField>
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
