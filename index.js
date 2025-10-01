import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Parse JSON body

// For testing server
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running and ready for requests.' });
});

// Existing bookings endpoint
const bookings = [];
app.post('/api/bookings', (req, res) => {
  const newBooking = req.body;
  newBooking.timestamp = new Date();
  bookings.push(newBooking);
  console.log('New booking received:', newBooking);
  res.status(201).json({ message: 'Booking received successfully', booking: newBooking });
});

// ✅ New Contact Form Endpoint
const messages = []; // Store messages in memory (for demo)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newMessage = {
    name,
    email,
    message,
    timestamp: new Date()
  };

  messages.push(newMessage); // store message
  console.log('New contact message received:', newMessage);

  res.status(201).json({ message: 'Message sent successfully', data: newMessage });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
