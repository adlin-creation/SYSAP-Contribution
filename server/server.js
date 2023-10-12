require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const PORT = process.env.PORT;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max requests per window
});
const routeDir = `${__dirname}/routes`;

app.use(limiter);
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Middleware to load route files dynamically
fs.readdirSync(routeDir).forEach((file) => {
  if (file.endsWith('.js')) {
    const route = require(`${routeDir}/${file}`);
    const routePath = file.replace('.js', ''); // Use the filename as the route path
    app.use(`/api/${routePath}`, route);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});