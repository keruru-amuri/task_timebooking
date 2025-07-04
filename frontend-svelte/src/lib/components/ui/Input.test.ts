import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Input from './Input.svelte';

describe('Input Component', () => {
  it('renders with default props', () => {
    render(Input);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('form-input');
  });

  it('renders with label', () => {
    render(Input, { label: 'Test Label' });
    
    const label = screen.getByText('Test Label');
    const input = screen.getByRole('textbox');
    
    expect(label).toBeInTheDocument();
    expect(input).toHaveAccessibleName('Test Label');
  });

  it('shows required indicator', () => {
    render(Input, { 
      label: 'Required Field',
      required: true 
    });
    
    const requiredIndicator = screen.getByLabelText('required');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveTextContent('*');
  });

  it('displays error message', () => {
    render(Input, { 
      label: 'Test Field',
      error: 'This field is required' 
    });
    
    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByRole('alert');
    
    expect(errorMessage).toHaveTextContent('This field is required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass('form-input-error');
  });

  it('displays help text', () => {
    render(Input, { 
      label: 'Test Field',
      help: 'Enter your information here' 
    });
    
    const helpText = screen.getByText('Enter your information here');
    const input = screen.getByRole('textbox');
    
    expect(helpText).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('handles different input types', () => {
    const { rerender } = render(Input, { type: 'email' });
    
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');

    rerender({ type: 'password' });
    // Password inputs don't have textbox role
    input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('can be disabled', () => {
    render(Input, { disabled: true });
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    let value = '';
    
    render(Input, { 
      value,
      onchange: (e) => { value = e.target.value; }
    });
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello World');
    
    expect(input).toHaveValue('Hello World');
  });

  it('renders full width by default', () => {
    render(Input);
    
    const container = screen.getByRole('textbox').parentElement;
    expect(container).toHaveClass('w-full');
  });

  it('can render without full width', () => {
    render(Input, { fullWidth: false });
    
    const container = screen.getByRole('textbox').parentElement;
    expect(container).not.toHaveClass('w-full');
  });
});
