<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { Html5QrcodeScanner } from 'html5-qrcode';
  
  let scannerElement: HTMLElement;
  let scanner: Html5QrcodeScanner | null = null;
  let scannedCode = $state('');
  let isScanning = $state(false);
  let error = $state('');
  let success = $state('');
  let manualEntry = $state(false);
  let workOrderNumber = $state('');
  let startTime = $state('');
  let endTime = $state('');

  onMount(() => {
    initializeScanner();
  });

  onDestroy(() => {
    if (scanner) {
      scanner.clear();
    }
  });

  function initializeScanner() {
    if (!scannerElement) return;

    scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2,
      },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);
    isScanning = true;
  }

  function onScanSuccess(decodedText: string, decodedResult: any) {
    scannedCode = decodedText;
    success = `Successfully scanned: ${decodedText}`;
    error = '';
    
    // Stop scanning after successful scan
    if (scanner) {
      scanner.clear();
      isScanning = false;
    }

    // Process the scanned code
    processScannedCode(decodedText);
  }

  function onScanFailure(errorMessage: string) {
    // Handle scan failure silently - this is called frequently
    // Only show error for actual problems, not normal scanning attempts
  }

  async function processScannedCode(code: string) {
    try {
      // TODO: Replace with actual API call to backend
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode: code }),
      });

      if (response.ok) {
        const data = await response.json();
        workOrderNumber = data.workOrderNumber || code;
        startTime = new Date().toTimeString().slice(0, 5); // Current time in HH:MM format
        success = `Work order ${workOrderNumber} loaded successfully!`;
      } else {
        throw new Error('Failed to process barcode');
      }
    } catch (err) {
      error = 'Failed to process scanned barcode. Please try manual entry.';
      manualEntry = true;
    }
  }

  function restartScanner() {
    error = '';
    success = '';
    scannedCode = '';
    initializeScanner();
  }

  function toggleManualEntry() {
    manualEntry = !manualEntry;
    if (manualEntry && scanner) {
      scanner.clear();
      isScanning = false;
    } else if (!manualEntry) {
      initializeScanner();
    }
  }

  async function submitTimeEntry() {
    if (!workOrderNumber || !startTime) {
      error = 'Please fill in all required fields';
      return;
    }

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workOrderNumber,
          startTime,
          endTime: endTime || null,
        }),
      });

      if (response.ok) {
        success = 'Time entry submitted successfully!';
        // Reset form
        workOrderNumber = '';
        startTime = '';
        endTime = '';
        scannedCode = '';
        manualEntry = false;
        initializeScanner();
      } else {
        throw new Error('Failed to submit time entry');
      }
    } catch (err) {
      error = 'Failed to submit time entry. Please try again.';
    }
  }
</script>

<svelte:head>
  <title>Scan Barcode - Time Booking App</title>
  <meta name="description" content="Scan work order barcodes for quick time tracking" />
</svelte:head>

<div class="py-8">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Scan Barcode</h1>
      <p class="text-gray-600">
        Scan a work order barcode or enter details manually to start time tracking.
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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Scanner Section -->
      <Card>
        <div class="text-center">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Barcode Scanner</h2>
          
          {#if !manualEntry}
            <div id="qr-reader" bind:this={scannerElement} class="mb-4"></div>
            
            <div class="space-y-4">
              <Button variant="secondary" on:click={toggleManualEntry}>
                Switch to Manual Entry
              </Button>
              
              {#if scannedCode}
                <Button variant="primary" on:click={restartScanner}>
                  Scan Another Code
                </Button>
              {/if}
            </div>
          {:else}
            <div class="py-8">
              <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">📝</span>
              </div>
              <p class="text-gray-600 mb-4">Manual entry mode enabled</p>
              <Button variant="secondary" on:click={toggleManualEntry}>
                Switch to Scanner
              </Button>
            </div>
          {/if}
        </div>
      </Card>

      <!-- Time Entry Form -->
      <Card>
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Time Entry Details</h2>
        
        <form on:submit|preventDefault={submitTimeEntry} class="space-y-6">
          <Input
            label="Work Order Number"
            placeholder="Enter or scan work order number"
            bind:value={workOrderNumber}
            required
            disabled={!manualEntry && !scannedCode}
          />

          <Input
            label="Start Time"
            type="time"
            bind:value={startTime}
            required
            help="Time when work started"
          />

          <Input
            label="End Time (Optional)"
            type="time"
            bind:value={endTime}
            help="Leave empty if work is ongoing"
          />

          <div class="flex space-x-4">
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth
              disabled={!workOrderNumber || !startTime}
            >
              Submit Time Entry
            </Button>
          </div>
        </form>
      </Card>
    </div>

    <!-- Instructions -->
    <Card class="mt-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
        <div>
          <div class="font-medium text-gray-900 mb-2">1. Scan or Enter</div>
          <p>Use the camera to scan a barcode or manually enter the work order number.</p>
        </div>
        <div>
          <div class="font-medium text-gray-900 mb-2">2. Set Times</div>
          <p>Enter start time and optionally end time. Current time is used by default.</p>
        </div>
        <div>
          <div class="font-medium text-gray-900 mb-2">3. Submit</div>
          <p>Review details and submit. The entry will be saved and synced to the server.</p>
        </div>
      </div>
    </Card>
  </div>
</div>
