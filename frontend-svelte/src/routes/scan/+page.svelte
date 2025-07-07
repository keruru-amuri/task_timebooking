<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
  
  let scannerElement: HTMLElement | undefined;
  let scanner: Html5QrcodeScanner | null = null;
  let scannedCode = $state('');
  let isScanning = $state(false);
  let isInitializing = $state(true); // Track initialization state
  let cameraReady = $state(false); // Track when camera feed is visible
  let error = $state('');
  let success = $state('');
  let manualEntry = $state(false);
  let workOrderNumber = $state('');
  let startTime = $state('');
  let endTime = $state('');

  onMount(() => {
    // Check if camera permission was pre-granted on root page
    const permissionGranted = localStorage.getItem('cameraPermissionGranted') === 'true';
    const permissionTime = localStorage.getItem('cameraPermissionTime');
    const isRecentPermission = permissionTime && (Date.now() - parseInt(permissionTime)) < 300000; // 5 minutes

    if (permissionGranted && isRecentPermission) {
      console.log('Camera permission already granted, starting scanner immediately!');
      // Skip delay since permission is already granted
      cameraReady = true;
      isInitializing = false;
    }

    // Start scanner immediately on page load for seamless experience
    if (!manualEntry) {
      initializeScanner();
    }
  });

  onDestroy(() => {
    if (scanner) {
      scanner.clear();
    }
  });

  async function initializeScanner() {
    if (!scannerElement) {
      // Use requestAnimationFrame for faster DOM readiness check
      requestAnimationFrame(() => initializeScanner());
      return;
    }

    // Clear any existing scanner first
    if (scanner) {
      try {
        scanner.clear();
      } catch (e) {
        // Ignore errors when clearing
      }
      scanner = null;
    }

    try {
      // Check if we're on HTTPS or localhost
      const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
      if (!isSecure) {
        error = 'Camera access requires HTTPS. Please use HTTPS or localhost.';
        manualEntry = true;
        return;
      }

      // Optimized scanner configuration for faster startup
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 15, // Increased FPS for faster scanning
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: false, // Disable zoom for faster startup
          // Force back camera only - no camera selection UI
          videoConstraints: {
            facingMode: "environment", // Force back camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          // Disable UI elements for seamless experience
          rememberLastUsedCamera: false,
          // Support all barcode formats
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.CODE_93,
            Html5QrcodeSupportedFormats.CODABAR,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.DATA_MATRIX,
            Html5QrcodeSupportedFormats.AZTEC,
            Html5QrcodeSupportedFormats.PDF_417
          ]
        },
        false // Disable verbose logging for cleaner experience
      );

      scanner.render(onScanSuccess, onScanFailure);
      isScanning = true;
      isInitializing = false; // Scanner is ready
      error = ''; // Clear any previous errors

      // Immediate and aggressive auto-clicking for seamless experience
      const autoClickSequence = () => {
        // Click permission button immediately if available
        const permissionButton = scannerElement?.querySelector('#html5-qrcode-button-camera-permission');
        if (permissionButton) {
          (permissionButton as HTMLButtonElement).click();
        }

        // Aggressively check for start button every 100ms
        const checkForStartButton = () => {
          const startButton = scannerElement?.querySelector('#html5-qrcode-button-camera-start');
          if (startButton && startButton.textContent?.includes('Start Scanning')) {
            (startButton as HTMLButtonElement).click();
            return true;
          }
          return false;
        };

        // Check immediately and frequently
        if (!checkForStartButton()) {
          const interval = setInterval(() => {
            if (checkForStartButton()) {
              clearInterval(interval);
            }
          }, 100);

          // Stop checking after 5 seconds
          setTimeout(() => clearInterval(interval), 5000);
        }
      };

      // Start auto-clicking immediately
      autoClickSequence();

      // Simplified camera ready detection - adjust timeout based on permission status
      const permissionGranted = localStorage.getItem('cameraPermissionGranted') === 'true';
      const timeout = permissionGranted ? 1000 : 3000; // Faster if permission already granted

      setTimeout(() => {
        console.log('Scanner should be ready, showing camera interface...');
        cameraReady = true;
        isInitializing = false;
      }, timeout);

    } catch (err) {
      console.error('Scanner initialization error:', err);
      error = 'Failed to initialize camera. Please try manual entry.';
      manualEntry = true;
    }
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
    console.debug('Scan attempt:', errorMessage);

    // Check for specific camera errors
    if (errorMessage.includes('NotAllowedError') || errorMessage.includes('Permission denied')) {
      error = 'Camera permission denied. Please allow camera access in your browser settings.';
      manualEntry = true;
    } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('No camera found')) {
      error = 'No camera found. Please ensure your device has a camera.';
      manualEntry = true;
    } else if (errorMessage.includes('NotSupportedError')) {
      error = 'Camera not supported on this device. Please use manual entry.';
      manualEntry = true;
    }
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

  async function testCameraPermission() {
    try {
      error = '';
      success = '';

      // Test camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      // If successful, stop the stream and show success
      stream.getTracks().forEach(track => track.stop());
      success = 'Camera permission granted! You can now use the scanner.';

      // If we're in manual mode, offer to switch back
      if (manualEntry) {
        setTimeout(() => {
          if (confirm('Camera access is working! Would you like to try the scanner again?')) {
            manualEntry = false;
            initializeScanner();
          }
        }, 1000);
      }
    } catch (err: any) {
      console.error('Camera permission test failed:', err);
      if (err.name === 'NotAllowedError') {
        error = 'Camera permission denied. Please allow camera access in your browser settings and refresh the page.';
      } else if (err.name === 'NotFoundError') {
        error = 'No camera found on this device.';
      } else if (err.name === 'NotSupportedError') {
        error = 'Camera not supported. Please ensure you\'re using HTTPS or localhost.';
      } else {
        error = `Camera test failed: ${err.message || 'Unknown error'}`;
      }
    }
  }

  function testLibrary() {
    console.log('Testing html5-qrcode library...');
    console.log('Html5QrcodeScanner:', Html5QrcodeScanner);
    console.log('Html5QrcodeSupportedFormats:', Html5QrcodeSupportedFormats);
    console.log('scannerElement:', scannerElement);
    console.log('Current state:', { isScanning, manualEntry, scannedCode });
  }

  function inspectScanner() {
    console.log('=== Scanner Element Inspection ===');
    console.log('scannerElement:', scannerElement);
    console.log('scannerElement innerHTML:', scannerElement?.innerHTML);
    console.log('scannerElement children:', scannerElement?.children);

    const videoElement = scannerElement?.querySelector('video');
    console.log('Video element:', videoElement);
    if (videoElement) {
      console.log('Video src:', videoElement.src);
      console.log('Video srcObject:', videoElement.srcObject);
      console.log('Video dimensions:', videoElement.videoWidth, 'x', videoElement.videoHeight);
      console.log('Video style:', videoElement.style.cssText);
      console.log('Video display:', getComputedStyle(videoElement).display);
      console.log('Video visibility:', getComputedStyle(videoElement).visibility);
    }

    const canvasElement = scannerElement?.querySelector('canvas');
    console.log('Canvas element:', canvasElement);

    console.log('=== End Inspection ===');
  }

  function clickPermissionButton() {
    const permissionButton = scannerElement?.querySelector('#html5-qrcode-button-camera-permission');
    console.log('Manual permission button click:', permissionButton);
    if (permissionButton) {
      (permissionButton as HTMLButtonElement).click();
      console.log('Permission button clicked manually');
    } else {
      console.log('Permission button not found');
    }
  }

  function handleCameraSelection() {
    console.log('=== Camera Selection Debug ===');

    // Check for camera start button
    const cameraStartButton = scannerElement?.querySelector('#html5-qrcode-button-camera-start');
    console.log('Camera start button:', cameraStartButton);

    // Check for camera dropdown
    const cameraDropdown = scannerElement?.querySelector('select');
    console.log('Camera dropdown:', cameraDropdown);

    if (cameraDropdown) {
      console.log('Available cameras:');
      for (let i = 0; i < cameraDropdown.options.length; i++) {
        console.log(`  ${i}: ${cameraDropdown.options[i].text} (${cameraDropdown.options[i].value})`);
      }

      // Try to select back camera (environment)
      for (let i = 0; i < cameraDropdown.options.length; i++) {
        const option = cameraDropdown.options[i];
        if (option.text.toLowerCase().includes('back') ||
            option.text.toLowerCase().includes('environment') ||
            option.text.toLowerCase().includes('rear')) {
          cameraDropdown.selectedIndex = i;
          console.log('Selected back camera:', option.text);
          break;
        }
      }

      // Trigger change event
      cameraDropdown.dispatchEvent(new Event('change'));
    }

    // Click start button if available
    if (cameraStartButton) {
      console.log('Clicking camera start button...');
      (cameraStartButton as HTMLButtonElement).click();
    }

    console.log('=== End Camera Selection ===');
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

<style>
  /* Hide ALL html5-qrcode UI elements during initialization for seamless experience */
  :global(#qr-reader__status_span) {
    display: none !important;
  }

  :global(#qr-reader__header_message) {
    display: none !important;
  }

  /* Hide camera selection UI completely */
  :global(#qr-reader__camera_selection) {
    display: none !important;
  }

  /* Hide camera permission UI */
  :global(#qr-reader__camera_permission_container) {
    display: none !important;
  }

  /* Hide launching camera messages */
  :global(#qr-reader__camera_permission_button) {
    display: none !important;
  }

  /* Hide all intermediate buttons and messages */
  :global(#qr-reader__dashboard_section) {
    display: none !important;
  }

  /* Hide file selection UI */
  :global(#qr-reader__filescan_input_container) {
    display: none !important;
  }

  /* Hide scan type selector */
  :global(#qr-reader__scan_type_change) {
    display: none !important;
  }

  /* Only show the actual camera feed when ready */
  :global(#qr-reader__scan_region) {
    border-radius: 0.5rem;
    overflow: hidden;
  }

  /* Hide verbose messages during initialization */
  :global(.qr-code-text-div) {
    display: none !important;
  }

  /* Hide any text content in the scanner */
  :global(#qr-reader div:not(#qr-reader__scan_region)) {
    display: none !important;
  }

  /* Show only the video element when camera is active */
  :global(#qr-reader video) {
    display: block !important;
    border-radius: 0.5rem;
  }

  /* Hide stop scanning button initially */
  :global(#qr-reader__stop_button) {
    margin-top: 1rem;
  }
</style>

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
            <!-- Camera Status Info -->
            <div class="mb-4 p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-700">
                📱 <strong>Mobile Users:</strong> Ensure camera permission is granted and you're using HTTPS or localhost.
              </p>
            </div>

            <!-- Scanner element with loading overlay -->
            <div class="relative mb-4 min-h-[300px] w-full">
              <!-- Loading overlay - shown while initializing -->
              {#if isInitializing && !cameraReady}
                <div class="absolute inset-0 z-10 text-center border-2 border-blue-200 bg-blue-50 rounded-lg flex items-center justify-center">
                  <div>
                    <div class="flex items-center justify-center mb-4">
                      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                    <p class="text-blue-700 font-medium text-lg">Loading Camera...</p>
                  </div>
                </div>
              {/if}

              <!-- Scanner element - always present but hidden by overlay when loading -->
              <div id="qr-reader" bind:this={scannerElement} class="min-h-[300px] w-full">
                {#if !isScanning && !cameraReady && !isInitializing}
                  <div class="text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[300px]">
                    <div>
                      <p>Scanner not initialized</p>
                      <p class="text-sm">Click "Test Camera Permission" to begin</p>
                    </div>
                  </div>
                {/if}
              </div>
            </div>

            <div class="space-y-4">
              <Button variant="secondary" onclick={toggleManualEntry}>
                Switch to Manual Entry
              </Button>

              <Button variant="ghost" onclick={testCameraPermission}>
                Test Camera Permission
              </Button>

              {#if scannedCode}
                <Button variant="primary" onclick={restartScanner}>
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
              <div class="space-y-2">
                <Button variant="secondary" onclick={toggleManualEntry}>
                  Try Scanner Again
                </Button>
                <Button variant="ghost" onclick={testCameraPermission}>
                  Test Camera Permission
                </Button>
              </div>
            </div>
          {/if}
        </div>
      </Card>

      <!-- Time Entry Form -->
      <Card>
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Time Entry Details</h2>
        
        <form onsubmit={(e) => { e.preventDefault(); submitTimeEntry(); }} class="space-y-6">
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
