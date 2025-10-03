const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    // Use relative path for production, localhost for development
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? '/api/bookings'  // This will work with Vercel routing
      : 'http://localhost:3001/api/bookings';
    
    console.log('Submitting to:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(formData)
    });
    
    if(response.ok) {
      navigate('/booking-confirmed',{state:{name:formData.name}});
    } else {
      const errorData = await response.json();
      setModalMessage(errorData.message || 'Booking failed. Please try again.');
    }
  } catch(error){
    console.error('Booking error:', error);
    setModalMessage('Network error. Please check your connection and try again.');
  } finally {
    setIsSubmitting(false);
  }
};
