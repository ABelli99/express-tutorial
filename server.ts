import path from 'path';
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import fileupload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import errorHandler from './middleware/error';
import connectDB from './config/db';

dotenv.config({ path: './config/config.env' });

connectDB();

import bootcamps from './routes/bootcamps';
import courses from './routes/courses';
import auth from './routes/auth';
import users from './routes/users';
import reviews from './routes/reviews';

const app: Express = express();

app.use(express.json());

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(fileupload());

app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(hpp());

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT || "5000", 10);

const server = app.listen(
  PORT,
  () => console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on('unhandledRejection', (err: Error, promise: Promise<any>) => {
  console.log(`Error: ${err.message}`.red);
});