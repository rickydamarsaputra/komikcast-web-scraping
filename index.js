const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use('/api/v1/manga', require('./routes/manga.route'));

app.listen(port, () => console.log(`server running on port ${port}`));
