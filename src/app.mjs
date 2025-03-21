import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import searchRouter from './routes/search.mjs';
import config from '../webpack.server.cjs';

const app = express();
const port = process.env.PORT || 3000;

// Limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP, please try again later."
  }
});

const compiler = webpack(config);

const loggingMiddleware = (req, res, next) => {
  console.info(`${req.method} - ${req.url}`);
  next();
};

app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

app.use(searchRouter);

// Adding webpack to the node environment
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.path,
  })
);

// Enable hot reload
app.use(webpackHotMiddleware(compiler));

app.listen(port, error => {
  if (error) {
    console.error('This is a server error', error);
  } else {
    console.log(`Server listening on port ${port}`);
  }
});
