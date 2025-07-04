<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  
  interface $$Props extends HTMLInputAttributes {
    label?: string;
    error?: string;
    help?: string;
    required?: boolean;
    fullWidth?: boolean;
  }
  
  export let label: $$Props['label'] = '';
  export let error: $$Props['error'] = '';
  export let help: $$Props['help'] = '';
  export let required: $$Props['required'] = false;
  export let fullWidth: $$Props['fullWidth'] = true;
  export let value: $$Props['value'] = '';
  export let type: $$Props['type'] = 'text';
  export let id: $$Props['id'] = '';
  export let placeholder: $$Props['placeholder'] = '';
  export let disabled: $$Props['disabled'] = false;
  
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  $: inputClass = [
    'form-input',
    error ? 'form-input-error' : '',
    fullWidth ? 'w-full' : '',
  ].filter(Boolean).join(' ');
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
    on:input
    on:change
    on:focus
    on:blur
    on:keydown
    on:keyup
    {...$$restProps}
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
