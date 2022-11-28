


import express from 'express';
import * as tokenRouter from './routes/token.js';

const app = express()
const port = 3000


app.use('/token', tokenRouter.router);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
