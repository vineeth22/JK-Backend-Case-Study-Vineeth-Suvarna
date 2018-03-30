const express = require('express');
const app = express();

const api = require('./routes/api');

app.use('/api', api);

app.listen(3030, () => console.log('App listening on port 3030'));
