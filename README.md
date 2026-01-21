# Tourism Company - Full Stack Application

A modern tourism booking platform built with **Node.js**, **Express**, **MongoDB**, and **Angular**.

## 🌟 Features

### For Tourists
- 🔍 Browse and search tours by category, difficulty, and price
- 📅 Book tours with specific dates and times
- 💳 Manage bookings and view booking history
- ⭐ View tour ratings and guide profiles

### For Tour Guides
- 🗺️ Create and manage tour listings
- 📊 View and manage bookings
- 👥 Track customer information
- 💼 Build your guide profile

### Technical Features
- 🔐 JWT-based authentication
- 🎨 Premium, modern UI design
- 📱 Fully responsive
- 🚀 RESTful API architecture
- 💾 MongoDB database

## 📁 Project Structure

```
Tourism Company/
├── server/                 # Backend (Node.js + Express)
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── server.js         # Entry point
│
└── client/                # Frontend (Angular)
    ├── src/
    │   ├── app/
    │   │   ├── components/    # Reusable components
    │   │   ├── pages/         # Page components
    │   │   ├── services/      # API services
    │   │   ├── models/        # TypeScript interfaces
    │   │   └── interceptors/  # HTTP interceptors
    │   └── styles.css         # Global styles
    └── angular.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tourism-app
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
Frontend will run on `http://localhost:4200`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/updateprofile` - Update profile (Protected)

### Tours
- `GET /api/tours` - Get all tours (with filters)
- `GET /api/tours/:id` - Get single tour
- `POST /api/tours` - Create tour (Guide only)
- `PUT /api/tours/:id` - Update tour (Guide/Admin)
- `DELETE /api/tours/:id` - Delete tour (Guide/Admin)

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings/my` - Get my bookings (Protected)
- `GET /api/bookings/:id` - Get single booking (Protected)
- `PUT /api/bookings/:id` - Update booking status (Guide/Admin)
- `DELETE /api/bookings/:id` - Cancel booking (Protected)

## 🎨 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **Angular 17** - Framework
- **TypeScript** - Language
- **RxJS** - Reactive programming
- **CSS3** - Styling (custom design system)

## 🔑 User Roles

1. **Tourist** - Can browse and book tours
2. **Guide** - Can create tours and manage bookings
3. **Admin** - Full access to all features

## 📝 Usage Guide

### As a Tourist
1. Register an account (role: tourist)
2. Browse available tours on the home page
3. Click on a tour to view details
4. Select date, time, and number of people
5. Complete the booking
6. View your bookings in "My Bookings"

### As a Guide
1. Register an account (role: guide)
2. Create your guide profile
3. Add new tours with locations, dates, and pricing
4. Manage incoming bookings
5. Update tour availability

## 🎯 Key Features Implemented

✅ User authentication with JWT  
✅ Role-based access control  
✅ Tour CRUD operations  
✅ Booking system with availability checking  
✅ Search and filter functionality  
✅ Responsive design  
✅ Premium UI with animations  
✅ HTTP interceptor for automatic token injection  

## 🔧 Development

### Backend Development
```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd client
ng serve --open
```

## 📦 Database Models

### User
- name, email, password (hashed)
- role (tourist/guide/admin)
- Guide-specific: bio, languages, rating

### Tour
- title, description, locations
- duration, maxGroupSize, price
- availableDates with time slots
- category, difficulty, images

### Booking
- tour, tourist, guide references
- selectedDate, selectedTime, numberOfPeople
- totalPrice, status, paymentStatus

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify as needed.

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check the `MONGODB_URI` in your `.env` file

**Port Already in Use:**
- Change the `PORT` in `.env` (backend)
- Use `ng serve --port 4300` (frontend)

**CORS Issues:**
- Backend has CORS enabled by default
- Check that frontend is calling `http://localhost:5000`

## 📞 Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Happy Touring! 🌍✈️**
