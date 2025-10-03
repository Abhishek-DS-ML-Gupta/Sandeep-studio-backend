const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    // Determine API URL based on environment
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? '/api/bookings'  // Use relative path in production
      : 'http://localhost:3001/api/bookings';  // Use localhost in development
    
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
