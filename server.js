require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const connectDB = require('./config/dbConnection');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');

const app = express();
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/notes', require('./routes/noteRoutes'));

app.all('*', (req, res) => {
    res.status(404);

    if (req.accepts('html')) {
        return res.sendFile(path.join(__dirname, 'views', '404.html'));
    }

    if (req.accepts('json')) {
        return res.json({ "message": "404 Not Found" });
    }

    res.type('txt').send('404 Not Found');
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', (error) => {
    console.log(error);
    logEvents(`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`, 'mongoErrors.log')
});