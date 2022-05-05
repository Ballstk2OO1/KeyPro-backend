const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');

app.use(helmet());

const corsOptions = {
  exposedHeaders: 'Authorization',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/public/image', express.static(__dirname + '/public/image'));
app.use('/api', require('./src/middlewares/api'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
