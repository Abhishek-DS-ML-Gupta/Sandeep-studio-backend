const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    // Use environment variable for backend URL
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const apiUrl = `${backendUrl}/api/bookings`;
    
    console.log('Submitting to:', apiUrl);
    console.log('Form data:', formData);
    
    const response = await fetch(apiUrl, {
      method: 'POST', // Explicitly set method to POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      navigate('/booking-confirmed', {state: {name: formData.name}});
    } else {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      setModalMessage(errorData.message || 'Booking failed. Please try again.');
    }
  } catch(error){
    console.error('Booking error:', error);
    setModalMessage('Network error. Please check your connection and try again.');
  } finally {
    setIsSubmitting(false);
  }
};
