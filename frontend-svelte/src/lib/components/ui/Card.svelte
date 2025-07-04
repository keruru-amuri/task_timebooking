<script lang="ts">
  interface $$Props {
    padding?: 'none' | 'small' | 'medium' | 'large';
    shadow?: 'none' | 'soft' | 'medium' | 'strong';
    border?: boolean;
    hover?: boolean;
    clickable?: boolean;
  }
  
  export let padding: $$Props['padding'] = 'medium';
  export let shadow: $$Props['shadow'] = 'soft';
  export let border: $$Props['border'] = true;
  export let hover: $$Props['hover'] = false;
  export let clickable: $$Props['clickable'] = false;
  
  $: cardClass = [
    'card',
    padding === 'none' ? '' : 
    padding === 'small' ? 'p-4' :
    padding === 'large' ? 'p-8' : 'p-6',
    shadow === 'none' ? 'shadow-none' :
    shadow === 'medium' ? 'shadow-medium' :
    shadow === 'strong' ? 'shadow-strong' : 'shadow-soft',
    border ? 'border border-gray-200' : 'border-0',
    hover ? 'hover:shadow-medium transition-shadow duration-200' : '',
    clickable ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' : '',
  ].filter(Boolean).join(' ');
</script>

<div
  class={cardClass}
  role={clickable ? 'button' : undefined}
  tabindex={clickable ? 0 : undefined}
  on:click={clickable ? (e) => { /* Handle click */ } : undefined}
  on:keydown={clickable ? (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      /* Handle click */
    }
  } : undefined}
  on:click
  on:keydown
>
  <slot />
</div>
