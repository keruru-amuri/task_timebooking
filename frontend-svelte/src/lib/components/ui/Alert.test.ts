import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Alert from './Alert.svelte';

describe('Alert Component', () => {
  it('renders with default props', () => {
    render(Alert, { children: () => 'Alert message' });
    
    const alert = screen.getByText('Alert message');
    expect(alert).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = render(Alert, { 
      variant: 'success',
      children: () => 'Success message'
    });
    
    let alertContainer = screen.getByText('Success message').closest('.alert');
    expect(alertContainer).toHaveClass('alert-success');

    rerender({ variant: 'error', children: () => 'Error message' });
    alertContainer = screen.getByText('Error message').closest('.alert');
    expect(alertContainer).toHaveClass('alert-error');
  });

  it('displays title when provided', () => {
    render(Alert, { 
      title: 'Alert Title',
      children: () => 'Alert content'
    });
    
    const title = screen.getByText('Alert Title');
    const content = screen.getByText('Alert content');
    
    expect(title).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it('shows dismiss button when dismissible', () => {
    render(Alert, { 
      dismissible: true,
      children: () => 'Dismissible alert'
    });
    
    const dismissButton = screen.getByLabelText('Dismiss alert');
    expect(dismissButton).toBeInTheDocument();
  });

  it('can be dismissed', async () => {
    const user = userEvent.setup();
    
    render(Alert, { 
      dismissible: true,
      children: () => 'Dismissible alert'
    });
    
    const dismissButton = screen.getByLabelText('Dismiss alert');
    const alertContent = screen.getByText('Dismissible alert');
    
    expect(alertContent).toBeInTheDocument();
    
    await user.click(dismissButton);
    
    expect(alertContent).not.toBeInTheDocument();
  });

  it('displays correct icons for variants', () => {
    const { rerender } = render(Alert, { 
      variant: 'success',
      children: () => 'Success'
    });
    
    let icon = screen.getByText('✓');
    expect(icon).toBeInTheDocument();

    rerender({ variant: 'warning', children: () => 'Warning' });
    icon = screen.getByText('⚠');
    expect(icon).toBeInTheDocument();

    rerender({ variant: 'error', children: () => 'Error' });
    icon = screen.getByText('✕');
    expect(icon).toBeInTheDocument();

    rerender({ variant: 'info', children: () => 'Info' });
    icon = screen.getByText('ℹ');
    expect(icon).toBeInTheDocument();
  });

  it('does not show dismiss button by default', () => {
    render(Alert, { children: () => 'Non-dismissible alert' });
    
    const dismissButton = screen.queryByLabelText('Dismiss alert');
    expect(dismissButton).not.toBeInTheDocument();
  });
});
