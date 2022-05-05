// POST /api/rentals/returns {customerId, movieId}

// Return 401 if client is not logged in ✅
// Return 400 if customerId is not provided ✅
// Return 400 if movieId is not provided ✅
// Return 404 if no rental found for this customer and movie ✅
// Return 400 if return already processed ✅
// Return 200 if valid request ✅
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental
