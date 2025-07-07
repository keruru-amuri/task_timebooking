# Timebooking Helper

A complete SvelteKit web application with Node.js backend for creating timebooking XML files. The app is mobile-friendly and designed to run in web browsers, especially on mobile devices.

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Location**: `./backend/`
- **Port**: 3000
- **Features**:
  - REST API for creating timebooking entries
  - XML file generation with proper structure
  - Input validation and error handling
  - Rate limiting and security headers
  - Docker containerization support

### Frontend (SvelteKit + TypeScript)
- **Location**: `./frontend-svelte/`
- **Port**: 5173
- **Features**:
  - Mobile-friendly responsive design with Tailwind CSS
  - Touch-optimized form controls
  - **Camera barcode scanning** with html5-qrcode library
  - **Manual barcode entry** (desktop/fallback)
  - **Device capability detection**
  - Date/time pickers
  - Real-time validation
  - API integration with backend

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Docker (optional, for containerized deployment)

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```
Backend will be available at: http://localhost:3000

### 2. Start the Frontend
```bash
cd frontend-svelte
npm install
npm run dev
```
Frontend will be available at: http://localhost:5173

### 3. Test the Application
```bash
# Test backend health
curl http://localhost:3000/health

# Test frontend
curl http://localhost:5173
```

## 📱 Usage

1. **Open the app**: Navigate to http://localhost:5173 in your mobile browser
2. **Dashboard**: View quick actions and recent time entries
3. **Scan Barcode**:
   - **Mobile devices**: Tap "Start Scanning" to use camera for barcode scanning
   - **Desktop**: Manual entry available as fallback
   - **HTTPS Required**: Camera access requires HTTPS or localhost
4. **Time Entry**:
   - **Work Order**: Scanned automatically or entered manually
   - **Start Time**: Current time used by default
   - **End Time**: Optional, leave empty for ongoing work
5. **Submit**: Tap "Submit Time Entry" to generate the XML file
6. **History**: View and manage previous time entries

### 📷 Barcode Scanning Features
- **html5-qrcode Library**: Cross-platform barcode scanning
- **Multiple Formats**: QR codes, Code 128, EAN, UPC, and more
- **Mobile Optimized**: Back camera preference, touch-friendly interface
- **Manual Fallback**: Always available when camera access is denied
- **Permission Handling**: Graceful camera permission management

## 📋 API Endpoints

### Backend API (http://localhost:3000)

#### POST /api/booking
Create a new timebooking XML file.

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

#### GET /api/files
List all generated XML files.

#### GET /health
Health check endpoint.

## 📄 XML Output Format

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

## 🐳 Docker Deployment

### Build and Run with Docker Compose
```bash
docker-compose up -d
```

This will:
- Build the backend container
- Start the backend on port 3000
- Create a persistent volume for XML files

### Manual Docker Build
```bash
cd backend
docker build -t timebooking-backend .
docker run -p 3000:3000 timebooking-backend
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Integration Tests
```bash
# PowerShell
powershell -ExecutionPolicy Bypass -File simple-test.ps1

# Or manual API testing
curl -X POST http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{"userSign":"TEST123","barcode":"TEST001","entryStart":"2024-12-05T09:00:00","entryEnd":"2024-12-05T17:00:00"}'
```

## 📁 Project Structure

```
timebooking-helper/
├── backend/                    # Node.js backend
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   ├── Dockerfile             # Docker configuration
│   ├── test/                  # Test files
│   └── xml_output/            # Generated XML files
├── frontend-svelte/           # SvelteKit frontend
│   ├── src/                   # Source code
│   │   ├── routes/            # SvelteKit routes
│   │   ├── lib/               # Components and utilities
│   │   └── app.html           # HTML template
│   ├── package.json           # Dependencies
│   ├── vite.config.ts         # Vite configuration
│   ├── svelte.config.js       # Svelte configuration
│   └── tailwind.config.js     # Tailwind CSS configuration
├── docker-compose.yml         # Docker Compose configuration
├── setup-ngrok.ps1           # HTTPS tunnel setup for mobile testing
└── README.md                 # This file
```

## 🔧 Configuration

### Backend Configuration
- **Port**: Set via `PORT` environment variable (default: 3000)
- **XML Output**: Files saved to `./xml_output/` directory
- **Entity Code**: Fixed value "330R" (as specified)

### Frontend Configuration
- **Backend URL**: Configure in SvelteKit API routes or environment variables
- **Port**: Set in `vite.config.ts` (default: 5173)
- **HTTPS**: Required for camera access on mobile devices

## 🛡️ Security Features

- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes per IP)
- CORS enabled for cross-origin requests
- Helmet.js security headers
- Non-root user in Docker container

## 📱 Mobile Optimization

- Responsive design with Tailwind CSS
- Touch-friendly form controls (minimum 44px touch targets)
- **Camera barcode scanning with html5-qrcode**
- **Permission handling for camera access**
- Mobile-optimized date/time inputs
- Optimized button sizes for touch interaction
- Device capability detection and adaptive UI
- Progressive Web App (PWA) capabilities

## 🚨 Troubleshooting

### Common Issues

1. **Backend not starting**: Check if port 3000 is available (`netstat -ano | findstr :3000`)
2. **Frontend build errors**: Run `npm install` in frontend-svelte directory
3. **TypeScript errors**: Run `npm run check` to see detailed errors
4. **Camera not working**: Ensure HTTPS or localhost, check browser permissions
5. **CORS errors**: Ensure backend is running and accessible
6. **XML files not generated**: Check backend logs and file permissions

### Logs
- **Backend logs**: Check terminal where `npm start` was run
- **Frontend logs**: Check browser developer console and Vite dev server output
- **Docker logs**: `docker-compose logs timebooking-backend`

### Mobile Testing
- **HTTPS Required**: Use ngrok or setup-https.ps1 for mobile camera access
- **Permission Denied**: Check browser settings for camera permissions
- **Scanner Not Working**: Try manual entry as fallback

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Test with the provided integration scripts
4. Check browser developer tools for frontend issues
