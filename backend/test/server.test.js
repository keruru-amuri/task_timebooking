const request = require('supertest');
const app = require('../server');

describe('Timebooking Backend API', () => {
  
  test('GET /health should return OK status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
    expect(response.body.timestamp).toBeDefined();
  });

  test('POST /api/booking should create XML file with valid data', async () => {
    const bookingData = {
      userSign: '2352191',
      barcode: 'WO4320474',
      entryStart: '2024-12-05T04:00:00',
      entryEnd: '2024-12-05T05:00:00'
    };

    const response = await request(app)
      .post('/api/booking')
      .send(bookingData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.filename).toMatch(/^booking_\d{8}_\d{6}_[a-f0-9]{8}\.xml$/);
    expect(response.body.message).toBe('Booking XML generated successfully');
  });

  test('POST /api/booking should reject invalid datetime format', async () => {
    const invalidData = {
      userSign: '2352191',
      barcode: 'WO4320474',
      entryStart: '2024-12-05 04:00:00', // Invalid format
      entryEnd: '2024-12-05T05:00:00'
    };

    const response = await request(app)
      .post('/api/booking')
      .send(invalidData)
      .expect(400);

    expect(response.body.error).toBe('Validation failed');
  });

  test('POST /api/booking should reject when entryEnd is before entryStart', async () => {
    const invalidData = {
      userSign: '2352191',
      barcode: 'WO4320474',
      entryStart: '2024-12-05T05:00:00',
      entryEnd: '2024-12-05T04:00:00' // End before start
    };

    const response = await request(app)
      .post('/api/booking')
      .send(invalidData)
      .expect(400);

    expect(response.body.error).toBe('entryEnd must be after entryStart');
  });

  test('POST /api/booking should reject missing required fields', async () => {
    const incompleteData = {
      userSign: '2352191',
      // Missing barcode, entryStart, entryEnd
    };

    const response = await request(app)
      .post('/api/booking')
      .send(incompleteData)
      .expect(400);

    expect(response.body.error).toBe('Validation failed');
  });

  test('GET /api/files should return list of XML files', async () => {
    const response = await request(app)
      .get('/api/files')
      .expect(200);

    expect(response.body.files).toBeDefined();
    expect(Array.isArray(response.body.files)).toBe(true);
  });

});
