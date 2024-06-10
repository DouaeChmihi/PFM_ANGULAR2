// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config.js');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const uuid = require('uuid');
const jwt = require('jsonwebtoken');


const app = express();
app.use(
    cors({
      origin: 'http://localhost:4200',
      credentials: true, // If you're sending cookies or authentication headers
    })
  );
// Connect to database
connectDB();


// Middleware
app.use(bodyParser.json());
app.use(cookieParser());


const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      console.log('Authenticated user:', req.user); // Log user info

      next();
    });
  } else {
    next();
  }
};
app.use(authenticateJWT);



// Middleware to handle session ID for non-authenticated users
const sessionMiddleware = (req, res, next) => {
  if (!req.cookies.sessionId) {
    const newSessionId = uuid.v4();
    res.cookie('sessionId', newSessionId, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
    req.sessionId = newSessionId;
    console.log('New session ID created:', newSessionId); // Log new session ID
  } else {
    req.sessionId = req.cookies.sessionId;
    console.log('Existing session ID:', req.sessionId); // Log existing session ID
  }
  next();
};
app.use(sessionMiddleware);

//admin




// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
