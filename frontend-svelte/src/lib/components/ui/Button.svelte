<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    icon?: boolean;
    fullWidth?: boolean;
    children?: any;
  }

  let {
    variant = 'primary',
    size = 'medium',
    loading = false,
    icon = false,
    fullWidth = false,
    disabled = false,
    type = 'button',
    children,
    ...restProps
  }: Props = $props();

  let buttonClass = $derived([
    'btn',
    `btn-${variant}`,
    size === 'small' ? 'btn-small' : size === 'large' ? 'btn-large' : '',
    icon ? 'btn-icon' : '',
    fullWidth ? 'w-full' : '',
    loading ? 'cursor-wait' : '',
  ].filter(Boolean).join(' '));
</script>

<button
  {type}
  class={buttonClass}
  disabled={disabled || loading}
  {...restProps}
>
  {#if loading}
    <div class="spinner w-4 h-4 mr-2" aria-hidden="true"></div>
    <span class="sr-only">Loading...</span>
  {/if}

  {@render children?.()}
</button>

<style>
  /* Additional component-specific styles if needed */
  button:disabled {
    pointer-events: none;
  }
</style>
