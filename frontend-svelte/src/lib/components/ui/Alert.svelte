<script lang="ts">
  interface $$Props {
    variant?: 'success' | 'warning' | 'error' | 'info';
    dismissible?: boolean;
    title?: string;
  }
  
  export let variant: $$Props['variant'] = 'info';
  export let dismissible: $$Props['dismissible'] = false;
  export let title: $$Props['title'] = '';
  
  let visible = true;
  
  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ'
  };
  
  $: alertClass = [
    'alert',
    `alert-${variant}`,
    'flex items-start space-x-3'
  ].join(' ');
  
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
        <slot />
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
