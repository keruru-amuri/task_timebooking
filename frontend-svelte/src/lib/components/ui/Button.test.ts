import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(Button, { children: () => 'Click me' });
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('btn', 'btn-primary');
  });

  it('renders different variants', () => {
    const { rerender } = render(Button, { 
      variant: 'secondary',
      children: () => 'Secondary'
    });
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('btn-secondary');

    rerender({ variant: 'danger', children: () => 'Danger' });
    button = screen.getByRole('button');
    expect(button).toHaveClass('btn-danger');
  });

  it('renders different sizes', () => {
    const { rerender } = render(Button, { 
      size: 'small',
      children: () => 'Small'
    });
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('btn-small');

    rerender({ size: 'large', children: () => 'Large' });
    button = screen.getByRole('button');
    expect(button).toHaveClass('btn-large');
  });

  it('shows loading state', () => {
    render(Button, { 
      loading: true,
      children: () => 'Loading'
    });
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-wait');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(Button, { 
      disabled: true,
      children: () => 'Disabled'
    });
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders full width', () => {
    render(Button, { 
      fullWidth: true,
      children: () => 'Full Width'
    });
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('handles different button types', () => {
    render(Button, { 
      type: 'submit',
      children: () => 'Submit'
    });
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
