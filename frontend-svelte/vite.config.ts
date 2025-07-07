import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		port: 5173,
		// Allow mobile access
		cors: true,
		// Mobile-friendly headers
		headers: {
			'Cross-Origin-Embedder-Policy': 'unsafe-none',
			'Cross-Origin-Opener-Policy': 'same-origin'
		}
	},
	preview: {
		host: '0.0.0.0',
		port: 5173
	}
});
