<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  
  interface Settings {
    serverUrl: string;
    autoSync: boolean;
    defaultStartTime: string;
    notifications: boolean;
    darkMode: boolean;
    cameraPreferences: {
      preferredCamera: 'front' | 'back' | 'auto';
      enableTorch: boolean;
      enableZoom: boolean;
    };
  }
  
  let settings = $state<Settings>({
    serverUrl: 'http://localhost:3000',
    autoSync: true,
    defaultStartTime: '',
    notifications: true,
    darkMode: false,
    cameraPreferences: {
      preferredCamera: 'back',
      enableTorch: true,
      enableZoom: true,
    }
  });
  
  let loading = $state(false);
  let saving = $state(false);
  let error = $state('');
  let success = $state('');

  onMount(async () => {
    await loadSettings();
  });

  async function loadSettings() {
    loading = true;
    try {
      // Load from localStorage first
      const savedSettings = localStorage.getItem('timeBookingSettings');
      if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
      }

      // TODO: Also load from server if needed
      // const response = await fetch('/api/settings');
      // if (response.ok) {
      //   const serverSettings = await response.json();
      //   settings = { ...settings, ...serverSettings };
      // }
    } catch (err) {
      error = 'Failed to load settings';
    } finally {
      loading = false;
    }
  }

  async function saveSettings() {
    saving = true;
    error = '';
    success = '';
    
    try {
      // Save to localStorage
      localStorage.setItem('timeBookingSettings', JSON.stringify(settings));
      
      // TODO: Also save to server if needed
      // const response = await fetch('/api/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to save to server');
      // }
      
      success = 'Settings saved successfully!';
    } catch (err) {
      error = 'Failed to save settings';
    } finally {
      saving = false;
    }
  }

  async function testConnection() {
    try {
      const response = await fetch(`${settings.serverUrl}/api/health`);
      if (response.ok) {
        success = 'Connection successful!';
        error = '';
      } else {
        throw new Error('Server responded with error');
      }
    } catch (err) {
      error = 'Failed to connect to server. Please check the URL.';
      success = '';
    }
  }

  function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      settings = {
        serverUrl: 'http://localhost:3000',
        autoSync: true,
        defaultStartTime: '',
        notifications: true,
        darkMode: false,
        cameraPreferences: {
          preferredCamera: 'back',
          enableTorch: true,
          enableZoom: true,
        }
      };
      saveSettings();
    }
  }

  function exportData() {
    // TODO: Implement data export
    const data = {
      settings,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-booking-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          settings = { ...settings, ...data.settings };
          saveSettings();
          success = 'Settings imported successfully!';
        } else {
          throw new Error('Invalid file format');
        }
      } catch (err) {
        error = 'Failed to import settings. Please check the file format.';
      }
    };
    reader.readAsText(file);
  }
</script>

<svelte:head>
  <title>Settings - Time Booking App</title>
  <meta name="description" content="Configure your time booking app preferences" />
</svelte:head>

<div class="py-8">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p class="text-gray-600">
        Configure your preferences and app behavior.
      </p>
    </div>

    <!-- Alerts -->
    {#if error}
      <div class="mb-6">
        <Alert variant="error" title="Error" dismissible>
          {error}
        </Alert>
      </div>
    {/if}

    {#if success}
      <div class="mb-6">
        <Alert variant="success" title="Success" dismissible>
          {success}
        </Alert>
      </div>
    {/if}

    {#if loading}
      <Card>
        <div class="text-center py-8">
          <div class="spinner w-8 h-8 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading settings...</p>
        </div>
      </Card>
    {:else}
      <div class="space-y-6">
        <!-- Server Configuration -->
        <Card>
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Server Configuration</h2>
          <div class="space-y-4">
            <Input
              label="Server URL"
              placeholder="http://localhost:3000"
              bind:value={settings.serverUrl}
              help="URL of the backend server for syncing data"
            />
            
            <div class="flex space-x-4">
              <Button variant="secondary" onclick={testConnection}>
                Test Connection
              </Button>
            </div>
          </div>
        </Card>

        <!-- General Settings -->
        <Card>
          <h2 class="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
          <div class="space-y-6">
            <Input
              label="Default Start Time"
              type="time"
              bind:value={settings.defaultStartTime}
              help="Default time to use when creating new entries"
            />

            <div class="space-y-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={settings.autoSync}
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">
                  Auto-sync with server when online
                </span>
              </label>

              <label class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={settings.notifications}
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">
                  Enable notifications
                </span>
              </label>

              <label class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={settings.darkMode}
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">
                  Dark mode (coming soon)
                </span>
              </label>
            </div>
          </div>
        </Card>

        <!-- Camera Settings -->
        <Card>
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Camera Settings</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Preferred Camera
              </label>
              <select
                bind:value={settings.cameraPreferences.preferredCamera}
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="auto">Auto-detect</option>
                <option value="back">Back Camera</option>
                <option value="front">Front Camera</option>
              </select>
            </div>

            <div class="space-y-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={settings.cameraPreferences.enableTorch}
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">
                  Enable flashlight/torch button
                </span>
              </label>

              <label class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={settings.cameraPreferences.enableZoom}
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">
                  Enable zoom controls
                </span>
              </label>
            </div>
          </div>
        </Card>

        <!-- Data Management -->
        <Card>
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
          <div class="space-y-4">
            <div class="flex flex-wrap gap-4">
              <Button variant="secondary" onclick={exportData}>
                Export Settings
              </Button>
              
              <label class="btn btn-secondary cursor-pointer">
                Import Settings
                <input
                  type="file"
                  accept=".json"
                  class="hidden"
                  onchange={importData}
                />
              </label>
              
              <Button variant="danger" onclick={resetSettings}>
                Reset to Defaults
              </Button>
            </div>
          </div>
        </Card>

        <!-- Save Button -->
        <div class="flex justify-end">
          <Button
            variant="primary"
            loading={saving}
            onclick={saveSettings}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>
