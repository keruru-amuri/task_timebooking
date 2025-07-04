<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';

  let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Navigation -->
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold text-primary-600">
            Time Booking
          </a>
        </div>

        <div class="flex items-center space-x-4">
          <a
            href="/"
            class="nav-link {$page.url.pathname === '/' ? 'nav-link-active' : ''}"
          >
            Dashboard
          </a>
          <a
            href="/scan"
            class="nav-link {$page.url.pathname === '/scan' ? 'nav-link-active' : ''}"
          >
            Scan
          </a>
          <a
            href="/history"
            class="nav-link {$page.url.pathname === '/history' ? 'nav-link-active' : ''}"
          >
            History
          </a>
          <a
            href="/settings"
            class="nav-link {$page.url.pathname === '/settings' ? 'nav-link-active' : ''}"
          >
            Settings
          </a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="flex-1">
    {@render children()}
  </main>
</div>

<style>
  .nav-link {
    @apply px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors;
  }

  .nav-link-active {
    @apply text-primary-600 bg-primary-50;
  }
</style>
