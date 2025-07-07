<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  
  interface TimeEntry {
    id: number;
    workOrderNumber: string;
    startTime: string;
    endTime?: string;
    duration?: number;
    date: string;
    status: 'active' | 'completed' | 'submitted';
  }
  
  let timeEntries = $state<TimeEntry[]>([]);
  let loading = $state(false);
  let error = $state('');
  let filterDate = $state('');
  let filterWorkOrder = $state('');
  let editingEntry: TimeEntry | null = $state(null);

  onMount(async () => {
    await loadTimeEntries();
  });

  async function loadTimeEntries() {
    loading = true;
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      timeEntries = [
        {
          id: 1,
          workOrderNumber: 'WO-12345',
          startTime: '09:00',
          endTime: '12:00',
          duration: 3,
          date: '2025-07-04',
          status: 'completed'
        },
        {
          id: 2,
          workOrderNumber: 'WO-12346',
          startTime: '13:00',
          endTime: '17:00',
          duration: 4,
          date: '2025-07-04',
          status: 'completed'
        },
        {
          id: 3,
          workOrderNumber: 'WO-12347',
          startTime: '08:30',
          duration: 0,
          date: '2025-07-04',
          status: 'active'
        }
      ];
    } catch (err) {
      error = 'Failed to load time entries';
    } finally {
      loading = false;
    }
  }

  function formatDuration(duration?: number): string {
    if (!duration) return 'In progress';
    return `${duration}h`;
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'text-warning-600 bg-warning-50';
      case 'completed': return 'text-success-600 bg-success-50';
      case 'submitted': return 'text-info-600 bg-info-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'In Progress';
      case 'completed': return 'Completed';
      case 'submitted': return 'Submitted';
      default: return status;
    }
  }

  function editEntry(entry: TimeEntry) {
    editingEntry = { ...entry };
  }

  function cancelEdit() {
    editingEntry = null;
  }

  async function saveEntry() {
    if (!editingEntry) return;

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/time-entries/${editingEntry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingEntry),
      });

      if (response.ok) {
        // Update local state
        const index = timeEntries.findIndex(e => e.id === editingEntry!.id);
        if (index !== -1) {
          timeEntries[index] = { ...editingEntry! };
        }
        editingEntry = null;
      } else {
        throw new Error('Failed to save entry');
      }
    } catch (err) {
      error = 'Failed to save changes';
    }
  }

  async function deleteEntry(id: number) {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/time-entries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        timeEntries = timeEntries.filter(e => e.id !== id);
      } else {
        throw new Error('Failed to delete entry');
      }
    } catch (err) {
      error = 'Failed to delete entry';
    }
  }

  let filteredEntries = $derived(timeEntries.filter(entry => {
    const matchesDate = !filterDate || entry.date === filterDate;
    const matchesWorkOrder = !filterWorkOrder ||
      entry.workOrderNumber.toLowerCase().includes(filterWorkOrder.toLowerCase());
    return matchesDate && matchesWorkOrder;
  }));

  let totalHours = $derived(filteredEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0));
</script>

<svelte:head>
  <title>Time History - Time Booking App</title>
  <meta name="description" content="View and manage your time entry history" />
</svelte:head>

<div class="py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Time Entry History</h1>
      <p class="text-gray-600">
        View, edit, and manage your time entries.
      </p>
    </div>

    <!-- Error Alert -->
    {#if error}
      <div class="mb-6">
        <Alert variant="error" title="Error" dismissible>
          {error}
        </Alert>
      </div>
    {/if}

    <!-- Filters and Summary -->
    <Card class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Filter by Date"
          type="date"
          bind:value={filterDate}
          placeholder="Select date"
        />
        
        <Input
          label="Filter by Work Order"
          placeholder="Enter work order number"
          bind:value={filterWorkOrder}
        />

        <div class="flex flex-col justify-end">
          <div class="text-sm text-gray-600 mb-1">Total Hours (Filtered)</div>
          <div class="text-2xl font-bold text-primary-600">{totalHours}h</div>
        </div>
      </div>
    </Card>

    <!-- Time Entries -->
    {#if loading}
      <Card>
        <div class="text-center py-8">
          <div class="spinner w-8 h-8 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading time entries...</p>
        </div>
      </Card>
    {:else if filteredEntries.length === 0}
      <Card>
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl text-gray-400">📝</span>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
          <p class="text-gray-600 mb-4">
            {timeEntries.length === 0 
              ? 'You haven\'t created any time entries yet.' 
              : 'No entries match your current filters.'}
          </p>
          <Button variant="primary">
            <a href="/scan">Create First Entry</a>
          </Button>
        </div>
      </Card>
    {:else}
      <div class="space-y-4">
        {#each filteredEntries as entry}
          <Card>
            {#if editingEntry && editingEntry.id === entry.id}
              <!-- Edit Mode -->
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    label="Work Order"
                    bind:value={editingEntry.workOrderNumber}
                    required
                  />
                  <Input
                    label="Start Time"
                    type="time"
                    bind:value={editingEntry.startTime}
                    required
                  />
                  <Input
                    label="End Time"
                    type="time"
                    bind:value={editingEntry.endTime}
                  />
                  <Input
                    label="Date"
                    type="date"
                    bind:value={editingEntry.date}
                    required
                  />
                </div>
                
                <div class="flex space-x-4">
                  <Button variant="primary" onclick={saveEntry}>Save</Button>
                  <Button variant="secondary" onclick={cancelEdit}>Cancel</Button>
                </div>
              </div>
            {:else}
              <!-- View Mode -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-4">
                    <div>
                      <div class="font-semibold text-gray-900">{entry.workOrderNumber}</div>
                      <div class="text-sm text-gray-600">{entry.date}</div>
                    </div>
                    
                    <div>
                      <div class="text-sm text-gray-600">
                        {entry.startTime} {entry.endTime ? `- ${entry.endTime}` : '(ongoing)'}
                      </div>
                      <div class="text-sm font-medium text-gray-900">
                        {formatDuration(entry.duration)}
                      </div>
                    </div>
                    
                    <div>
                      <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full {getStatusColor(entry.status)}">
                        {getStatusText(entry.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="flex space-x-2">
                  <Button variant="ghost" size="small" onclick={() => editEntry(entry)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="small" onclick={() => deleteEntry(entry.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            {/if}
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</div>
