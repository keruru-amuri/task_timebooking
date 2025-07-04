import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { barcode } = await request.json();
    
    if (!barcode) {
      return json({ error: 'Barcode is required' }, { status: 400 });
    }

    // TODO: Replace with actual backend API call
    // For now, simulate processing the barcode
    const response = await fetch('http://localhost:3000/api/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ barcode }),
    });

    if (response.ok) {
      const data = await response.json();
      return json({
        workOrderNumber: data.workOrderNumber || barcode,
        success: true,
      });
    } else {
      // If backend is not available, return the barcode as work order number
      return json({
        workOrderNumber: barcode,
        success: true,
        offline: true,
      });
    }
  } catch (error) {
    console.error('Scan API error:', error);
    
    // Fallback: return the barcode as work order number
    const { barcode } = await request.json();
    return json({
      workOrderNumber: barcode,
      success: true,
      offline: true,
    });
  }
};
