import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Bookings endpoint
app.post('/api/bookings', (req, res) => {
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

// Contact endpoint
app.post('/api/contact', (req, res) => {
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// 404 handler
app.use((req, res) => {
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
