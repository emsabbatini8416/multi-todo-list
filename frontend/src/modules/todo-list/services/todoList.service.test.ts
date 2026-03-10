jest.mock('../../../shared/lib/api', () => ({
  apiFetch: jest.fn(),
}))

import { apiFetch } from '../../../shared/lib/api'
import { todoListService } from './todoList.service'

describe('todoListService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls all todo list endpoints with the expected payloads', async () => {
    ;(apiFetch as jest.Mock).mockResolvedValue({})

    await todoListService.getTodoLists()
    await todoListService.createTodoList({ name: 'Work' })
    await todoListService.getTodoListById(1)
    await todoListService.updateTodoList(1, { name: 'Personal' })
    await todoListService.deleteTodoList(1)

    expect(apiFetch).toHaveBeenNthCalledWith(1, '/todo-lists')
    expect(apiFetch).toHaveBeenNthCalledWith(2, '/todo-lists', {
      body: { name: 'Work' },
      method: 'POST',
    })
    expect(apiFetch).toHaveBeenNthCalledWith(3, '/todo-lists/1')
    expect(apiFetch).toHaveBeenNthCalledWith(4, '/todo-lists/1', {
      body: { name: 'Personal' },
      method: 'PUT',
    })
    expect(apiFetch).toHaveBeenNthCalledWith(5, '/todo-lists/1', {
      method: 'DELETE',
    })
  })

  it('calls all todo item endpoints with the expected payloads', async () => {
    ;(apiFetch as jest.Mock).mockResolvedValue({})

    await todoListService.getTodoItems(4)
    await todoListService.createTodoItem(4, {
      description: 'Description',
      name: 'Task',
    })
    await todoListService.getTodoItemById(4, 2)
    await todoListService.updateTodoItem(4, 2, {
      done: true,
      name: 'Task',
    })
    await todoListService.deleteTodoItem(4, 2)

    expect(apiFetch).toHaveBeenNthCalledWith(1, '/todo-lists/4/todo-items')
    expect(apiFetch).toHaveBeenNthCalledWith(2, '/todo-lists/4/todo-items', {
      body: { description: 'Description', name: 'Task' },
      method: 'POST',
    })
    expect(apiFetch).toHaveBeenNthCalledWith(3, '/todo-lists/4/todo-items/2')
    expect(apiFetch).toHaveBeenNthCalledWith(4, '/todo-lists/4/todo-items/2', {
      body: { done: true, name: 'Task' },
      method: 'PUT',
    })
    expect(apiFetch).toHaveBeenNthCalledWith(5, '/todo-lists/4/todo-items/2', {
      method: 'DELETE',
    })
  })
})
