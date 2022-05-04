const express = require("express");
const logger = require("./startup/consoleLogger");
const app = express();

require("./startup/config")();
require("./startup/logging")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/validation")();

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
