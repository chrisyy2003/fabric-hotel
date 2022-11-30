


const express = require('express');
const tokenRouter = require('./routes/token');

const app = express()
const port = 3000


app.use('/token', tokenRouter.router);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
