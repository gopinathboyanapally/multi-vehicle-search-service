import express from 'express';
import cors from 'cors';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import searchRouter from './routes/search.mjs';
import config from '../webpack.server.cjs';


const app = express();
const port = process.env.PORT || 3000;

const compiler = webpack(config);

const loggingMiddleware = (req, res, next) => {
  console.info(`${req.method} - ${req.url}`);
  next();
};

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
