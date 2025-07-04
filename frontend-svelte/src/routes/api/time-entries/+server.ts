import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface TimeEntry {
  id?: number;
  workOrderNumber: string;
  startTime: string;
  endTime?: string;
  date: string;
  duration?: number;
  status: 'active' | 'completed' | 'submitted';
}

// In-memory storage for demo purposes
// In production, this would be replaced with a database
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

let nextId = 4;

function calculateDuration(startTime: string, endTime?: string): number {
  if (!endTime) return 0;
  
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 100) / 100;
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const date = url.searchParams.get('date');
    const workOrder = url.searchParams.get('workOrder');
    
    let filteredEntries = timeEntries;
    
    if (date) {
      filteredEntries = filteredEntries.filter(entry => entry.date === date);
    }
    
    if (workOrder) {
      filteredEntries = filteredEntries.filter(entry => 
        entry.workOrderNumber.toLowerCase().includes(workOrder.toLowerCase())
      );
    }
    
    return json(filteredEntries);
  } catch (error) {
    console.error('GET time entries error:', error);
    return json({ error: 'Failed to fetch time entries' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const { workOrderNumber, startTime, endTime } = data;
    
    if (!workOrderNumber || !startTime) {
      return json({ error: 'Work order number and start time are required' }, { status: 400 });
    }
    
    const duration = calculateDuration(startTime, endTime);
    const status = endTime ? 'completed' : 'active';
    
    const newEntry: TimeEntry = {
      id: nextId++,
      workOrderNumber,
      startTime,
      endTime,
      duration,
      date: new Date().toISOString().split('T')[0],
      status
    };
    
    timeEntries.push(newEntry);
    
    // TODO: Also send to backend server
    try {
      await fetch('http://localhost:3000/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });
    } catch (backendError) {
      console.warn('Backend not available, storing locally only');
    }
    
    return json(newEntry, { status: 201 });
  } catch (error) {
    console.error('POST time entry error:', error);
    return json({ error: 'Failed to create time entry' }, { status: 500 });
  }
};
