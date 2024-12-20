import express, { NextFunction, Request, Response } from 'express';
import { PORT } from './helpers/constant.helper';
import cookieSession from 'cookie-session';
import cookieOptions from './config/cookie.config';
import cors from 'cors';
import corsOptions from './config/cors.config';
import { connectSequelize, syncModel } from './helpers/sequelize.helper';
import CustomError from './helpers/error.helper';
import authRouter from './routes/auth.route';
import groupRouter from './routes/group.route';
import questionRouter from './routes/question.route';
import quizRouter from './routes/quiz.route';
import userRouter from './routes/user.route';
import readingRouter from './routes/reading.route';
import predictionRouter from './routes/prediction.route';
const app = express();

app.use(cookieSession(cookieOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
app.use('/api/auth/', authRouter);
app.use('/api/users/', userRouter);
app.use('/api/groups/', groupRouter);
app.use('/api/questions/', questionRouter);
app.use('/api/readings/', readingRouter);
app.use('/api/', quizRouter);
app.use('/api/predictions', predictionRouter);

// Error handler
app.use((err, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.status).json({
      status: 'fail',
      message: err.message,
      data: err.data,
    });
    return;
  }

  if (err instanceof Error) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 'fail',
    message: 'Terjadi kegagalan pada server!',
  });
});

connectSequelize()
  .then(() => syncModel())
  .then(() => {
    app.listen(Number(PORT), '0.0.0.0', () => {
      return console.log(`Express is listening at port ${PORT}`);
    });
  });
