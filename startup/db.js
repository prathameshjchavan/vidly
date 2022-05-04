const mongoose = require("mongoose");
const logger = require("./consoleLogger");

module.exports = function () {
	mongoose
		.connect("mongodb://localhost/vidly")
		.then(() => logger.info("Conneted to MongoDB..."));
};
