<script lang="ts">
  interface Props {
    variant?: 'success' | 'warning' | 'error' | 'info';
    dismissible?: boolean;
    title?: string;
    children?: any;
  }

  let {
    variant = 'info',
    dismissible = false,
    title = '',
    children
  }: Props = $props();

  let visible = $state(true);

  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ'
  };

  let alertClass = $derived([
    'alert',
    `alert-${variant}`,
    'flex items-start space-x-3'
  ].join(' '));

  function dismiss() {
    visible = false;
  }
</script>

{#if visible}
  <div class={alertClass} role="alert">
    <div class="flex-shrink-0 text-lg" aria-hidden="true">
      {icons[variant]}
    </div>
    
    <div class="flex-1 min-w-0">
      {#if title}
        <h4 class="font-medium mb-1">{title}</h4>
      {/if}
      <div class="text-sm">
        {@render children?.()}
      </div>
    </div>
    
    {#if dismissible}
      <button
        type="button"
        class="flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
        on:click={dismiss}
        aria-label="Dismiss alert"
      >
        <span class="text-lg" aria-hidden="true">✕</span>
      </button>
    {/if}
  </div>
{/if}
