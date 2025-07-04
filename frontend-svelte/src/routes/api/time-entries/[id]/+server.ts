import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface TimeEntry {
  id: number;
  workOrderNumber: string;
  startTime: string;
  endTime?: string;
  date: string;
  duration?: number;
  status: 'active' | 'completed' | 'submitted';
}

// This would be replaced with actual database operations in production
// For now, we'll simulate with in-memory storage
let timeEntries: TimeEntry[] = [
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
    date: '2025-07-04',
    status: 'active'
  }
];

function calculateDuration(startTime: string, endTime?: string): number {
  if (!endTime) return 0;
  
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 100) / 100;
}

export const GET: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id);
    const entry = timeEntries.find(e => e.id === id);
    
    if (!entry) {
      return json({ error: 'Time entry not found' }, { status: 404 });
    }
    
    return json(entry);
  } catch (error) {
    console.error('GET time entry error:', error);
    return json({ error: 'Failed to fetch time entry' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    
    const entryIndex = timeEntries.findIndex(e => e.id === id);
    if (entryIndex === -1) {
      return json({ error: 'Time entry not found' }, { status: 404 });
    }
    
    const { workOrderNumber, startTime, endTime, date } = data;
    
    if (!workOrderNumber || !startTime || !date) {
      return json({ 
        error: 'Work order number, start time, and date are required' 
      }, { status: 400 });
    }
    
    const duration = calculateDuration(startTime, endTime);
    const status = endTime ? 'completed' : 'active';
    
    const updatedEntry: TimeEntry = {
      ...timeEntries[entryIndex],
      workOrderNumber,
      startTime,
      endTime,
      date,
      duration,
      status
    };
    
    timeEntries[entryIndex] = updatedEntry;
    
    // TODO: Also update in backend server
    try {
      await fetch(`http://localhost:3000/api/time-entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEntry),
      });
    } catch (backendError) {
      console.warn('Backend not available, updating locally only');
    }
    
    return json(updatedEntry);
  } catch (error) {
    console.error('PUT time entry error:', error);
    return json({ error: 'Failed to update time entry' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id);
    const entryIndex = timeEntries.findIndex(e => e.id === id);
    
    if (entryIndex === -1) {
      return json({ error: 'Time entry not found' }, { status: 404 });
    }
    
    const deletedEntry = timeEntries.splice(entryIndex, 1)[0];
    
    // TODO: Also delete from backend server
    try {
      await fetch(`http://localhost:3000/api/time-entries/${id}`, {
        method: 'DELETE',
      });
    } catch (backendError) {
      console.warn('Backend not available, deleting locally only');
    }
    
    return json({ success: true, deletedEntry });
  } catch (error) {
    console.error('DELETE time entry error:', error);
    return json({ error: 'Failed to delete time entry' }, { status: 500 });
  }
};
