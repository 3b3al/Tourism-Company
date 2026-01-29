const mongoose = require('mongoose');

beforeAll(async () => {
    // Connect to a test database
    const url = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/tourism-app-test';
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Drop the database and close connection
    if (mongoose.connection.db) {
        await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
});
