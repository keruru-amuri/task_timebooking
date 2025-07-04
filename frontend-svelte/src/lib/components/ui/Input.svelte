<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    label?: string;
    error?: string;
    help?: string;
    required?: boolean;
    fullWidth?: boolean;
  }

  let {
    label = '',
    error = '',
    help = '',
    required = false,
    fullWidth = true,
    value = $bindable(''),
    type = 'text',
    id = '',
    placeholder = '',
    disabled = false,
    ...restProps
  }: Props = $props();

  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  let inputClass = $derived([
    'form-input',
    error ? 'form-input-error' : '',
    fullWidth ? 'w-full' : '',
  ].filter(Boolean).join(' '));
</script>

<div class={fullWidth ? 'w-full' : ''}>
  {#if label}
    <label for={inputId} class="form-label">
      {label}
      {#if required}
        <span class="text-error-500 ml-1" aria-label="required">*</span>
      {/if}
    </label>
  {/if}
  
  <input
    {type}
    id={inputId}
    class={inputClass}
    bind:value
    {placeholder}
    {disabled}
    {required}
    aria-invalid={error ? 'true' : 'false'}
    aria-describedby={error ? `${inputId}-error` : help ? `${inputId}-help` : undefined}
    {...restProps}
  />
  
  {#if error}
    <div id="{inputId}-error" class="form-error" role="alert">
      {error}
    </div>
  {:else if help}
    <div id="{inputId}-help" class="form-help">
      {help}
    </div>
  {/if}
</div>
