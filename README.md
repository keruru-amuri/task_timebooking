# Timebooking Helper

A complete Flutter web application with Node.js backend for creating timebooking XML files. The app is mobile-friendly and designed to run in web browsers, especially on mobile devices.

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

### Frontend (Flutter Web)
- **Location**: `./frontend/`
- **Port**: 8080
- **Features**:
  - Mobile-friendly responsive design
  - Touch-optimized form controls
  - **Camera barcode scanning** (mobile devices)
  - **Manual barcode entry** (desktop/fallback)
  - **Device capability detection**
  - Date/time pickers
  - Real-time validation
  - API integration with backend

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Flutter SDK (v3.32.5 or higher)
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
cd frontend
flutter pub get
flutter run -d web-server --web-port 8080
```
Frontend will be available at: http://localhost:8080

### 3. Test the Application
```bash
# Run integration tests
powershell -ExecutionPolicy Bypass -File simple-test.ps1
```

## 📱 Usage

1. **Open the app**: Navigate to http://localhost:8080 in your mobile browser
2. **Fill the form**:
   - **User Sign**: Your user identifier (e.g., "2352191")
   - **Barcode**:
     - **Mobile devices**: Tap "Scan" button to use camera for barcode scanning
     - **Desktop**: Manual entry (e.g., "WO4320474")
     - **Fallback**: Manual entry if camera is not available
   - **Entry Start**: Tap to select start date and time
   - **Entry End**: Tap to select end date and time
3. **Submit**: Tap "Submit Booking" to generate the XML file
4. **View Results**: Check the response message for confirmation

### 📷 Barcode Scanning Features
- **Automatic Detection**: App detects device capabilities and shows appropriate input method
- **Camera Scanning**: Full-screen camera interface with scanning overlay
- **Manual Fallback**: Always available for desktop or when camera access is denied
- **Device Info**: Shows current device type and available features

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
├── backend/                 # Node.js backend
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── Dockerfile          # Docker configuration
│   ├── test/               # Test files
│   └── xml_output/         # Generated XML files
├── frontend/               # Flutter web app
│   ├── lib/main.dart       # Main Flutter app
│   ├── pubspec.yaml        # Flutter dependencies
│   └── web/                # Web assets
├── docker-compose.yml      # Docker Compose configuration
├── simple-test.ps1         # Integration test script
└── README.md              # This file
```

## 🔧 Configuration

### Backend Configuration
- **Port**: Set via `PORT` environment variable (default: 3000)
- **XML Output**: Files saved to `./xml_output/` directory
- **Entity Code**: Fixed value "330R" (as specified)

### Frontend Configuration
- **Backend URL**: Update `backendUrl` in `frontend/lib/main.dart` if needed
- **Port**: Configurable via Flutter run command

## 🛡️ Security Features

- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes per IP)
- CORS enabled for cross-origin requests
- Helmet.js security headers
- Non-root user in Docker container

## 📱 Mobile Optimization

- Responsive design for mobile screens
- Touch-friendly form controls
- **Camera barcode scanning with mobile_scanner**
- **Permission handling for camera access**
- Native date/time pickers
- Optimized button sizes for touch
- Device capability detection and adaptive UI
- Smooth scrolling and navigation

## 🚨 Troubleshooting

### Common Issues

1. **Backend not starting**: Check if port 3000 is available
2. **Frontend build errors**: Run `flutter clean && flutter pub get`
3. **CORS errors**: Ensure backend is running and accessible
4. **XML files not generated**: Check backend logs and file permissions

### Logs
- **Backend logs**: Check terminal where `npm start` was run
- **Frontend logs**: Check browser developer console
- **Docker logs**: `docker-compose logs timebooking-backend`

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Test with the provided integration scripts
4. Check browser developer tools for frontend issues
