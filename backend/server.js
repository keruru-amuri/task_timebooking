const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Ensure output directory exists
const OUTPUT_DIR = path.join(__dirname, 'xml_output');

async function ensureOutputDir() {
  try {
    await fs.access(OUTPUT_DIR);
  } catch (error) {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }
}

// Input validation schema
const bookingSchema = Joi.object({
  userSign: Joi.string().required(),
  barcode: Joi.string().required(),
  entryStart: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/).required(),
  entryEnd: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/).required()
});

// Generate XML content
function generateXML(userSign, barcode, entryStart, entryEnd) {
  return `<?xml version="1.0" ?>
<transferBooking version="1.0">
  <interval>
    <employee>
      <userSign>${userSign}</userSign>
    </employee>
    <bookings>
      <booking>
        <entityCode>330R</entityCode>
        <barcode>${barcode}</barcode>
        <timePeriod>
          <entryStart>${entryStart}</entryStart>
          <entryEnd>${entryEnd}</entryEnd>
        </timePeriod>
      </booking>
    </bookings>
  </interval>
</transferBooking>`;
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/booking', async (req, res) => {
  try {
    // Validate input
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const { userSign, barcode, entryStart, entryEnd } = value;

    // Validate datetime format and logic
    const startMoment = moment(entryStart);
    const endMoment = moment(entryEnd);
    
    if (!startMoment.isValid() || !endMoment.isValid()) {
      return res.status(400).json({
        error: 'Invalid datetime format'
      });
    }

    if (endMoment.isSameOrBefore(startMoment)) {
      return res.status(400).json({
        error: 'entryEnd must be after entryStart'
      });
    }

    // Generate XML
    const xmlContent = generateXML(userSign, barcode, entryStart, entryEnd);
    
    // Generate filename with timestamp and UUID
    const timestamp = moment().format('YYYYMMDD_HHmmss');
    const fileId = uuidv4().substring(0, 8);
    const filename = `booking_${timestamp}_${fileId}.xml`;
    const filepath = path.join(OUTPUT_DIR, filename);

    // Save XML file
    await fs.writeFile(filepath, xmlContent, 'utf8');

    res.json({
      success: true,
      message: 'Booking XML generated successfully',
      filename: filename,
      filepath: filepath,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process booking'
    });
  }
});

// Get list of generated XML files
app.get('/api/files', async (req, res) => {
  try {
    const files = await fs.readdir(OUTPUT_DIR);
    const xmlFiles = files.filter(file => file.endsWith('.xml'));
    
    const fileDetails = await Promise.all(
      xmlFiles.map(async (file) => {
        const filepath = path.join(OUTPUT_DIR, file);
        const stats = await fs.stat(filepath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
    );

    res.json({
      files: fileDetails.sort((a, b) => new Date(b.created) - new Date(a.created))
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({
      error: 'Failed to list files'
    });
  }
});

// Start server
async function startServer() {
  await ensureOutputDir();
  app.listen(PORT, () => {
    console.log(`Timebooking backend server running on port ${PORT}`);
    console.log(`XML output directory: ${OUTPUT_DIR}`);
  });
}

startServer().catch(console.error);

module.exports = app;
