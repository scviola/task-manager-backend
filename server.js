// imports
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoute');
const taskRoutes = require('./routes/taskRoute');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

// configs
dotenv.config();

const app = express();

// middleware
app.use(express.json()); // json requests
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// mongodb connection
connectDB();

// routes loader
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// health check
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// error-handling middleware
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`);
});

