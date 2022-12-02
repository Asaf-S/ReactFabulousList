import express from 'express';
import cors from 'cors';
import json_stringify_safe from 'json-stringify-safe';
import resulter from './index';

import IOptions from './lib/IOptions';

const PORT = process.env.PORT || 5000;

function convertToString(value: any) {
  const isError = (obj: any) => {
    return Object.prototype.toString.call(obj) === '[object Error]';
    // return obj && obj.stack && obj.message && typeof obj.stack === 'string'
    //        && typeof obj.message === 'string';
  };

  try {
    switch (typeof value) {
      case 'string':
      case 'boolean':
      case 'number':
      case 'undefined':
      default:
        return '' + value;
      case 'object':
        if (isError(value)) {
          return value.stack;
        } else {
          return json_stringify_safe(value, null, 2);
        }
    }
  } catch (e) {
    return '' + value;
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error(`ERROR: Promise: ${promise}\nReason: ${convertToString(reason)}`);
});

process.on('uncaughtException', err => {
  console.error('---------\nUncaught Exception at: ' + err.stack + '\n---------');
});

console.log('WEB SERVER - STARTED!');

const app = express()
  // Middlewares
  .use(cors())
  .use(express.json())
  .use(
    express.urlencoded({
      extended: true,
    })
  )

  // API routes
  .get('/', (req, res, next) => {
    return res.json({
      result: resulter(),
    });
  })

  // Wildcard
  .all('*', (req: express.Request, res: express.Response) => {
    console.error(`Express - Wildcard was caught! ${req.path}`);
    return res.sendStatus(404);
  });

app.listen(PORT, () => console.log(`Express - Listening on ${PORT}\nhttp://localhost:${PORT}`));
