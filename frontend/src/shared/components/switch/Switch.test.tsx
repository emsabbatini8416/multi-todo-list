import { fireEvent, render, screen } from '@testing-library/react'
import { Switch } from './Switch'

describe('Switch', () => {
  it('calls onCheckedChange when clicked', () => {
    const onCheckedChange = jest.fn()

    render(<Switch checked={false} label="Theme" onCheckedChange={onCheckedChange} />)

    fireEvent.click(screen.getByRole('switch', { name: /theme/i }))

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('toggles with keyboard', () => {
    const onCheckedChange = jest.fn()

    render(<Switch checked={true} label="Theme" onCheckedChange={onCheckedChange} />)

    const toggle = screen.getByRole('switch', { name: /theme/i })

    fireEvent.keyDown(toggle, { key: 'Enter' })
    fireEvent.keyDown(toggle, { key: ' ' })

    expect(onCheckedChange).toHaveBeenCalledTimes(2)
  })

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn()

    render(
      <Switch checked={false} disabled label="Theme" onCheckedChange={onCheckedChange} />,
    )

    fireEvent.click(screen.getByRole('switch', { name: /theme/i }))

    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})

