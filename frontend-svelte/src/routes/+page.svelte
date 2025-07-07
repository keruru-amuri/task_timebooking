<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import { onMount } from 'svelte';

  interface TimeEntry {
    id: number;
    workOrder: string;
    startTime: string;
    endTime: string;
    duration: number;
  }

  let recentEntries = $state<TimeEntry[]>([]);
  let todayHours = $state(0);
  let weekHours = $state(0);
  let loading = $state(false);

  onMount(async () => {
    // Start camera permission request immediately as the highest priority
    const permissionPromise = preRequestCameraPermission();

    // Load dashboard data in parallel (don't wait for permission)
    const dashboardPromise = loadDashboardData();

    // Wait for both to complete (permission request gets maximum time)
    await Promise.all([permissionPromise, dashboardPromise]);
  });

  async function preRequestCameraPermission() {
    try {
      // Only request permission if we're in a browser environment
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        console.log('🚀 PRIORITY: Pre-requesting camera permission immediately...');

        // Request camera permission with optimal settings for speed
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Back camera for barcode scanning
            width: { ideal: 640 },     // Lower resolution for faster initialization
            height: { ideal: 480 }
          }
        });

        // Store permission state immediately
        localStorage.setItem('cameraPermissionGranted', 'true');
        localStorage.setItem('cameraPermissionTime', Date.now().toString());

        // Stop the stream immediately - we just wanted permission
        stream.getTracks().forEach(track => track.stop());

        console.log('✅ Camera permission granted and cached!');
      }
    } catch (error) {
      console.log('❌ Camera permission denied or unavailable:', error instanceof Error ? error.message : error);
      localStorage.setItem('cameraPermissionGranted', 'false');
    }
  }

  async function loadDashboardData() {
    loading = true;
    try {
      // TODO: Replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      recentEntries = [
        { id: 1, workOrder: 'WO-12345', startTime: '09:00', endTime: '12:00', duration: 3 },
        { id: 2, workOrder: 'WO-12346', startTime: '13:00', endTime: '17:00', duration: 4 },
      ];

      todayHours = 7;
      weekHours = 35;
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Dashboard - Time Booking App</title>
  <meta name="description" content="Time booking dashboard with quick actions and recent entries" />
</svelte:head>

<div class="py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Dashboard
      </h1>
      <p class="text-gray-600">
        Track your time entries and manage work orders efficiently.
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card hover clickable>
        <div class="text-center">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📱</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Scan Barcode</h3>
          <p class="text-gray-600 mb-4">Quickly scan work order barcodes to start time tracking</p>
          <Button variant="primary" fullWidth>
            <a href="/scan" class="block">Start Scanning</a>
          </Button>
        </div>
      </Card>

      <Card hover clickable>
        <div class="text-center">
          <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">⏱️</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Manual Entry</h3>
          <p class="text-gray-600 mb-4">Enter time manually for work orders without barcodes</p>
          <Button variant="secondary" fullWidth>
            Manual Entry
          </Button>
        </div>
      </Card>

      <Card hover clickable>
        <div class="text-center">
          <div class="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📊</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">View History</h3>
          <p class="text-gray-600 mb-4">Review and manage your previous time entries</p>
          <Button variant="ghost" fullWidth>
            <a href="/history" class="block">View History</a>
          </Button>
        </div>
      </Card>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <div class="text-center">
          <div class="text-3xl font-bold text-primary-600 mb-2">{todayHours}h</div>
          <div class="text-sm text-gray-600">Today</div>
        </div>
      </Card>

      <Card>
        <div class="text-center">
          <div class="text-3xl font-bold text-success-600 mb-2">{weekHours}h</div>
          <div class="text-sm text-gray-600">This Week</div>
        </div>
      </Card>

      <Card>
        <div class="text-center">
          <div class="text-3xl font-bold text-info-600 mb-2">{recentEntries.length}</div>
          <div class="text-sm text-gray-600">Recent Entries</div>
        </div>
      </Card>
    </div>

    <!-- Recent Entries -->
    <Card>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Recent Time Entries</h2>
        <Button variant="ghost" size="small">
          <a href="/history">View All</a>
        </Button>
      </div>

      {#if loading}
        <div class="text-center py-8">
          <div class="spinner w-8 h-8 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading recent entries...</p>
        </div>
      {:else if recentEntries.length === 0}
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl text-gray-400">📝</span>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
          <p class="text-gray-600 mb-4">Start by scanning a barcode or creating a manual entry</p>
          <Button variant="primary">
            <a href="/scan">Scan First Barcode</a>
          </Button>
        </div>
      {:else}
        <div class="space-y-4">
          {#each recentEntries as entry}
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div class="font-medium text-gray-900">{entry.workOrder}</div>
                <div class="text-sm text-gray-600">
                  {entry.startTime} - {entry.endTime} ({entry.duration}h)
                </div>
              </div>
              <Button variant="ghost" size="small">Edit</Button>
            </div>
          {/each}
        </div>
      {/if}
    </Card>

    <!-- Quick Tips -->
    <div class="mt-8">
      <Alert variant="info">
        <strong>Pro Tip:</strong> Use the barcode scanner for fastest time entry.
        The app works offline and will sync when you're back online.
      </Alert>
    </div>
  </div>
</div>
