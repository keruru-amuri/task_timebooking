<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';

  let inputValue = '';
  let loading = false;

  function handleSubmit() {
    loading = true;
    setTimeout(() => {
      loading = false;
    }, 2000);
  }
</script>

<svelte:head>
  <title>Time Booking App - Design System Demo</title>
  <meta name="description" content="Task Time Booking Application Design System" />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Time Booking App
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        A comprehensive design system for the task time booking application,
        built with accessibility and mobile-first principles.
      </p>
    </div>

    <!-- Design System Demo -->
    <div class="space-y-12">

      <!-- Colors Section -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Color Palette</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card padding="small">
            <div class="w-full h-16 bg-primary-500 rounded-lg mb-3"></div>
            <h3 class="font-medium text-gray-900">Primary</h3>
            <p class="text-sm text-gray-500">#2563eb</p>
          </Card>

          <Card padding="small">
            <div class="w-full h-16 bg-success-500 rounded-lg mb-3"></div>
            <h3 class="font-medium text-gray-900">Success</h3>
            <p class="text-sm text-gray-500">#059669</p>
          </Card>

          <Card padding="small">
            <div class="w-full h-16 bg-warning-500 rounded-lg mb-3"></div>
            <h3 class="font-medium text-gray-900">Warning</h3>
            <p class="text-sm text-gray-500">#d97706</p>
          </Card>

          <Card padding="small">
            <div class="w-full h-16 bg-error-500 rounded-lg mb-3"></div>
            <h3 class="font-medium text-gray-900">Error</h3>
            <p class="text-sm text-gray-500">#dc2626</p>
          </Card>
        </div>
      </section>

      <!-- Typography Section -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Typography</h2>
        <Card>
          <div class="space-y-4">
            <div>
              <h1 class="text-4xl font-bold text-gray-900">Heading 1</h1>
              <p class="text-sm text-gray-500 mt-1">text-4xl font-bold</p>
            </div>
            <div>
              <h2 class="text-3xl font-semibold text-gray-900">Heading 2</h2>
              <p class="text-sm text-gray-500 mt-1">text-3xl font-semibold</p>
            </div>
            <div>
              <h3 class="text-2xl font-semibold text-gray-900">Heading 3</h3>
              <p class="text-sm text-gray-500 mt-1">text-2xl font-semibold</p>
            </div>
            <div>
              <p class="text-lg text-gray-900">Large body text for important content</p>
              <p class="text-sm text-gray-500 mt-1">text-lg</p>
            </div>
            <div>
              <p class="text-base text-gray-900">Regular body text for most content</p>
              <p class="text-sm text-gray-500 mt-1">text-base</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Small text for captions and metadata</p>
              <p class="text-sm text-gray-500 mt-1">text-sm</p>
            </div>
          </div>
        </Card>
      </section>

      <!-- Buttons Section -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Buttons</h2>
        <Card>
          <div class="space-y-6">
            <!-- Button Variants -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Variants</h3>
              <div class="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="danger">Danger Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
            </div>

            <!-- Button Sizes -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Sizes</h3>
              <div class="flex flex-wrap items-center gap-4">
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
              </div>
            </div>

            <!-- Button States -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">States</h3>
              <div class="flex flex-wrap gap-4">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button loading={loading} on:click={handleSubmit}>
                  {loading ? 'Loading...' : 'Click to Load'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <!-- Forms Section -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Form Elements</h2>
        <Card>
          <div class="space-y-6 max-w-md">
            <Input
              label="Work Order Number"
              placeholder="Enter work order number"
              bind:value={inputValue}
              required
            />

            <Input
              label="Start Time"
              type="time"
              help="Select the time you started working"
            />

            <Input
              label="Error Example"
              placeholder="This field has an error"
              error="This field is required"
            />

            <Input
              label="Disabled Field"
              placeholder="This field is disabled"
              disabled
            />
          </div>
        </Card>
      </section>

      <!-- Alerts Section -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Alerts</h2>
        <div class="space-y-4">
          <Alert variant="success" title="Success!" dismissible>
            Your time entry has been successfully submitted.
          </Alert>

          <Alert variant="warning" title="Warning">
            Please check your internet connection before submitting.
          </Alert>

          <Alert variant="error" title="Error">
            Failed to submit time entry. Please try again.
          </Alert>

          <Alert variant="info">
            Tip: You can scan barcodes by tapping the camera icon.
          </Alert>
        </div>
      </section>

      <!-- Cards Section -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Cards</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card hover>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Default Card</h3>
            <p class="text-gray-600">This is a standard card with hover effect.</p>
          </Card>

          <Card shadow="medium" border={false}>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Medium Shadow</h3>
            <p class="text-gray-600">Card with medium shadow and no border.</p>
          </Card>

          <Card padding="large" shadow="strong">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Large Padding</h3>
            <p class="text-gray-600">Card with large padding and strong shadow.</p>
          </Card>
        </div>
      </section>

    </div>
  </div>
</div>
