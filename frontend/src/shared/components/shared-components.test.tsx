import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { fireEvent, render, screen } from '@testing-library/react'
import { Button } from './button/Button'
import { Checkbox } from './checkbox/Checkbox'
import { EmptyState } from './empty-state/EmptyState'
import { FormField } from './form-field/FormField'
import { Icon } from './icon/Icon'
import { Input } from './input/Input'
import { PanelLayout } from './layout/PanelLayout'
import { Modal } from './modal/Modal'
import { PageHeader } from './page-header/PageHeader'
import { Spinner } from './spinner/Spinner'
import { Textarea } from './textarea/Textarea'

describe('shared components', () => {
  it('renders Button and matches snapshot', () => {
    const { container } = render(
      <Button icon={faPlus} variant="secondary">
        Create
      </Button>,
    )

    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders Input and matches snapshot', () => {
    const { container } = render(<Input placeholder="Type here" />)

    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders Checkbox checked state and matches snapshot', () => {
    const { container } = render(<Checkbox checked onClick={() => undefined} />)

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders Icon and matches snapshot', () => {
    const { container } = render(<Icon icon={faPlus} />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders PanelLayout and matches snapshot', () => {
    const { container } = render(
      <PanelLayout>
        <div>Content</div>
      </PanelLayout>,
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders FormField hint and error states', () => {
    const { rerender } = render(
      <FormField hint="Helpful hint" htmlFor="field" label="Field label">
        <Input id="field" />
      </FormField>,
    )

    expect(screen.getByText('Helpful hint')).toBeInTheDocument()

    rerender(
      <FormField error="Required" htmlFor="field" label="Field label">
        <Input id="field" />
      </FormField>,
    )

    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('renders Textarea and matches snapshot', () => {
    const { container } = render(<Textarea placeholder="Details" />)

    expect(screen.getByPlaceholderText('Details')).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders EmptyState and matches snapshot', () => {
    const { container } = render(
      <EmptyState
        action={<Button>Retry</Button>}
        description="No data was found."
        title="Empty"
      />,
    )

    expect(screen.getByText('Empty')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders Spinner and matches snapshot', () => {
    const { container } = render(<Spinner label="Loading spinner" />)

    expect(screen.getByRole('status', { name: /loading spinner/i })).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders PageHeader and matches snapshot', () => {
    const { container } = render(
      <PageHeader
        actions={<Button>Action</Button>}
        description="Description"
        eyebrow="Overview"
        title="Heading"
      />,
    )

    expect(screen.getByText('Heading')).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders Modal and closes through the close button', () => {
    const onClose = jest.fn()
    const { container } = render(
      <Modal isOpen onClose={onClose} title="Dialog title">
        <div>Modal body</div>
      </Modal>,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Modal body')).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()

    fireEvent.click(screen.getByRole('button', { name: /close dialog/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not render Modal when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => undefined} title="Hidden dialog">
        <div>Hidden</div>
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders Button danger circle variant and matches snapshot', () => {
    const { container } = render(
      <Button shape="circle" size="lg" variant="danger">
        !
      </Button>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders Button ghost small variant', () => {
    render(
      <Button size="sm" variant="ghost">
        Back
      </Button>,
    )

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  it('renders EmptyState without optional content', () => {
    render(<EmptyState title="Only title" />)

    expect(screen.getByText('Only title')).toBeInTheDocument()
    expect(screen.queryByText(/no data/i)).not.toBeInTheDocument()
  })

  it('renders Modal footer and description', () => {
    render(
      <Modal
        description="Dialog description"
        footer={<Button>Confirm</Button>}
        isOpen
        onClose={() => undefined}
        title="Dialog title"
      >
        <div>Body</div>
      </Modal>,
    )

    expect(screen.getByText('Dialog description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
  })

  it('renders PageHeader without optional elements', () => {
    render(<PageHeader title="Simple heading" />)

    expect(screen.getByText('Simple heading')).toBeInTheDocument()
  })
})
