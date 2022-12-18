import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan'
import {subscribeEnpoints,configRequestTypes} from './routes/endpoint.conf.js'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
import i18next from 'i18next'
import i18nextMiddleware from 'i18next-http-middleware'
import Backend from 'i18next-fs-backend'
import { promiseMiddleware } from './middleware/promise.middleware.js';

var app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

configRequestTypes(app)

app.use(express.static(path.join(__dirname, 'public')));


i18next
.use(Backend)
.use(i18nextMiddleware.LanguageDetector)
.init({
  backend: {
    loadPath: __dirname + '/public/locales/{{lng}}.json'
  },
  fallbackLng: 'en',
  preload: ['en','tr']
})

app.use(i18nextMiddleware.handle(i18next))
app.use(promiseMiddleware())

subscribeEnpoints(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

export default app;
