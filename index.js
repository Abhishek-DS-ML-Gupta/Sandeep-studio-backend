import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite default port
  'https://sandeep-studio-website.vercel.app' // Your frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// In-memory storage (for demo - replace with database in production)
const bookings = [];
const messages = [];

// Test endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running and ready for requests.',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Bookings endpoint - POST only
app.post('/bookings', (req, res) => {
  try {
    const newBooking = req.body;
    newBooking.timestamp = new Date();
    bookings.push(newBooking);
    console.log('New booking received:', newBooking);
    
    res.status(201).json({ 
      message: 'Booking received successfully', 
      booking: newBooking 
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Error processing booking' });
  }
});

// Handle GET requests to /bookings (return error)
app.get('/bookings', (req, res) => {
  res.status(405).json({ 
    message: 'Method not allowed. Please use POST to create bookings.',
    path: req.path,
    method: req.method
  });
});

// Contact endpoint - POST only
app.post('/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'All fields are required',
        missing: !name ? 'name' : !email ? 'email' : 'message'
      });
    }

    const newMessage = {
      name,
      email,
      message,
      timestamp: new Date()
    };

    messages.push(newMessage);
    console.log('New contact message received:', newMessage);

    res.status(201).json({ 
      message: 'Message sent successfully', 
      data: newMessage 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Handle GET requests to /contact (return error)
app.get('/contact', (req, res) => {
  res.status(405).json({ 
    message: 'Method not allowed. Please use POST to send messages.',
    path: req.path,
    method: req.method
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path} not found`);
  res.status(404).json({ 
    message: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export for Vercel
export default app;
