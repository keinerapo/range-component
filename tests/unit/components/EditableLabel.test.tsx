import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditableLabel } from '@/components/range/EditableLabel'

describe('EditableLabel', () => {
  it('renders the value as a button initially', () => {
    render(
      <EditableLabel value={25} min={1} max={100} onChange={vi.fn()} label="Minimum price" />
    )
    expect(screen.getByRole('button', { name: /minimum price/i })).toBeInTheDocument()
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  })

  it('displays the formatted value', () => {
    render(
      <EditableLabel value={25} min={1} max={100} onChange={vi.fn()} label="Minimum price" />
    )
    expect(screen.getByText('25 €')).toBeInTheDocument()
  })

  it('switches to input when clicked', async () => {
    render(
      <EditableLabel value={25} min={1} max={100} onChange={vi.fn()} label="Minimum price" />
    )
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onChange with the new value on Enter', async () => {
    const onChange = vi.fn()
    render(
      <EditableLabel value={25} min={1} max={100} onChange={onChange} label="Minimum price" />
    )
    await userEvent.click(screen.getByRole('button'))
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.type(input, '50')
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(50)
  })

  it('commits value on blur', async () => {
    const onChange = vi.fn()
    render(
      <EditableLabel value={25} min={1} max={100} onChange={onChange} label="Minimum price" />
    )
    await userEvent.click(screen.getByRole('button'))
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.type(input, '40')
    await userEvent.tab()
    expect(onChange).toHaveBeenCalledWith(40)
  })

  it('clamps value to max when input exceeds max', async () => {
    const onChange = vi.fn()
    render(
      <EditableLabel value={25} min={1} max={100} onChange={onChange} label="Minimum price" />
    )
    await userEvent.click(screen.getByRole('button'))
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.type(input, '200')
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(100)
  })

  it('clamps value to min when input is below min', async () => {
    const onChange = vi.fn()
    render(
      <EditableLabel value={25} min={1} max={100} onChange={onChange} label="Minimum price" />
    )
    await userEvent.click(screen.getByRole('button'))
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.type(input, '-10')
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('reverts to original value on Escape', async () => {
    const onChange = vi.fn()
    render(
      <EditableLabel value={25} min={1} max={100} onChange={onChange} label="Minimum price" />
    )
    await userEvent.click(screen.getByRole('button'))
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.type(input, '99')
    await userEvent.keyboard('{Escape}')
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('25 €')).toBeInTheDocument()
  })

  it('keeps original value when input is empty and Enter is pressed', async () => {
    const onChange = vi.fn()
    render(
      <EditableLabel value={25} min={1} max={100} onChange={onChange} label="Minimum price" />
    )
    await userEvent.click(screen.getByRole('button'))
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(25)
  })
})
