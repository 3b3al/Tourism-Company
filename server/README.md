# Tourism Company API

Backend API for a Tourism Company application built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based auth with role-based access (Tourist, Guide, Admin)
- **Tours Management**: CRUD operations, search, filtering by category/difficulty/price
- **Bookings System**: Create bookings, check availability, manage reservations
- **User Roles**: 
  - **Tourists**: Browse tours, make bookings
  - **Guides**: Create and manage tours, view bookings
  - **Admins**: Full access

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment variables**:
   Create a `.env` file in the server directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tourism-app
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=7d
   ```

3. **Install MongoDB** (if not already installed):
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud)

4. **Run the server**:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/updateprofile` - Update profile (Protected)

### Tours
- `GET /api/tours` - Get all tours (with filters)
- `GET /api/tours/:id` - Get single tour
- `GET /api/tours/guide/:guideId` - Get tours by guide
- `POST /api/tours` - Create tour (Guide only)
- `PUT /api/tours/:id` - Update tour (Guide/Admin)
- `DELETE /api/tours/:id` - Delete tour (Guide/Admin)

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings/my` - Get my bookings (Protected)
- `GET /api/bookings/:id` - Get single booking (Protected)
- `PUT /api/bookings/:id` - Update booking status (Guide/Admin)
- `DELETE /api/bookings/:id` - Cancel booking (Protected)

## Database Models

### User
- name, email, password, role, phone, avatar
- Guide-specific: bio, languages, rating

### Tour
- title, description, guide, locations, duration
- maxGroupSize, price, difficulty, category
- availableDates (with time slots and spots)
- images, included/excluded items

### Booking
- tour, tourist, guide
- selectedDate, selectedTime, numberOfPeople
- totalPrice, status, paymentStatus
- contactPhone, contactEmail

## Project Structure

```
server/
├── controllers/
│   ├── authController.js
│   ├── tourController.js
│   └── bookingController.js
├── models/
│   ├── User.js
│   ├── Tour.js
│   └── Booking.js
├── routes/
│   ├── auth.js
│   ├── tours.js
│   └── bookings.js
├── middleware/
│   └── auth.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Notes

- Make sure MongoDB is running before starting the server
- Default port is 5000
- JWT tokens expire in 7 days (configurable)
- Passwords are hashed using bcrypt
