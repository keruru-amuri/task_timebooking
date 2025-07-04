<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  
  interface $$Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    icon?: boolean;
    fullWidth?: boolean;
  }
  
  export let variant: $$Props['variant'] = 'primary';
  export let size: $$Props['size'] = 'medium';
  export let loading: $$Props['loading'] = false;
  export let icon: $$Props['icon'] = false;
  export let fullWidth: $$Props['fullWidth'] = false;
  export let disabled: $$Props['disabled'] = false;
  export let type: $$Props['type'] = 'button';
  
  $: buttonClass = [
    'btn',
    `btn-${variant}`,
    size === 'small' ? 'btn-small' : size === 'large' ? 'btn-large' : '',
    icon ? 'btn-icon' : '',
    fullWidth ? 'w-full' : '',
    loading ? 'cursor-wait' : '',
  ].filter(Boolean).join(' ');
</script>

<button
  {type}
  class={buttonClass}
  disabled={disabled || loading}
  on:click
  on:focus
  on:blur
  on:mouseenter
  on:mouseleave
  {...$$restProps}
>
  {#if loading}
    <div class="spinner w-4 h-4 mr-2" aria-hidden="true"></div>
    <span class="sr-only">Loading...</span>
  {/if}
  
  <slot />
</button>

<style>
  /* Additional component-specific styles if needed */
  button:disabled {
    pointer-events: none;
  }
</style>
