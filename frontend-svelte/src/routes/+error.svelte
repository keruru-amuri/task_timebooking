<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
</script>

<svelte:head>
  <title>Error {$page.status} - Time Booking App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full">
    <Card class="text-center">
      <div class="w-16 h-16 bg-error-100 rounded-lg flex items-center justify-center mx-auto mb-6">
        <span class="text-3xl">⚠️</span>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Error {$page.status}
      </h1>
      
      <p class="text-gray-600 mb-6">
        {#if $page.status === 404}
          The page you're looking for doesn't exist.
        {:else if $page.status === 500}
          Something went wrong on our end. Please try again later.
        {:else}
          {$page.error?.message || 'An unexpected error occurred.'}
        {/if}
      </p>
      
      <div class="space-y-4">
        <Button variant="primary" fullWidth onclick={() => history.back()}>
          Go Back
        </Button>
        
        <Button variant="ghost" fullWidth>
          <a href="/">Return Home</a>
        </Button>
      </div>
    </Card>
  </div>
</div>
