# Timebooking Backend

A Node.js Express backend service that processes user input and generates XML files for timebooking entries.

## Features

- REST API for creating timebooking XML files
- Input validation and sanitization
- Rate limiting for security
- Health check endpoint
- File listing endpoint
- Docker containerization
- Comprehensive error handling

## API Endpoints

### POST /api/booking
Creates a new timebooking XML file.

**Request Body:**
```json
{
  "userSign": "2352191",
  "barcode": "WO4320474", 
  "entryStart": "2024-12-05T04:00:00",
  "entryEnd": "2024-12-05T05:00:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking XML generated successfully",
  "filename": "booking_20241205_120000_a1b2c3d4.xml",
  "filepath": "/app/xml_output/booking_20241205_120000_a1b2c3d4.xml",
  "timestamp": "2024-12-05T12:00:00.000Z"
}
```

### GET /api/files
Lists all generated XML files.

**Response:**
```json
{
  "files": [
    {
      "filename": "booking_20241205_120000_a1b2c3d4.xml",
      "size": 425,
      "created": "2024-12-05T12:00:00.000Z",
      "modified": "2024-12-05T12:00:00.000Z"
    }
  ]
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-12-05T12:00:00.000Z"
}
```

## XML Output Format

Generated XML files follow this structure:
```xml
<?xml version="1.0" ?>
<transferBooking version="1.0">
  <interval>
    <employee>
      <userSign>2352191</userSign>
    </employee>
    <bookings>
      <booking>
        <entityCode>330R</entityCode>
        <barcode>WO4320474</barcode>
        <timePeriod>
          <entryStart>2024-12-05T04:00:00</entryStart>
          <entryEnd>2024-12-05T05:00:00</entryEnd>
        </timePeriod>
      </booking>
    </bookings>
  </interval>
</transferBooking>
```

## Development

### Local Development
```bash
npm install
npm run dev
```

### Testing
```bash
npm test
```

### Docker Development
```bash
docker build -t timebooking-backend .
docker run -p 3000:3000 timebooking-backend
```

## Deployment

### Using Docker Compose
```bash
docker-compose up -d
```

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Security Features

- Rate limiting (100 requests per 15 minutes per IP)
- Input validation and sanitization
- Helmet.js security headers
- CORS enabled
- Non-root user in Docker container
