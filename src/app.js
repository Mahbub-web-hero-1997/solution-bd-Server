import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(
  express.json({
    extended: true,
    limit: '16kb',
  })
);
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    sameSite: 'None',
  })
);
app.use(express.static('./public/temp'));
app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  })
);

app.use(
  cookieParser({
    secure: false,
    httpOnly: true,
  })
);
// Link To Route
import userRoute from './Routes/user.route.js';
app.use('/api/v1/user', userRoute);

app.get('/', (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Welcome to Daily Lens API'));
});
export default app;
