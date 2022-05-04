const mongoose = require("mongoose");
const logger = require("./consoleLogger");

module.exports = function () {
	const node_env = process.env.NODE_ENV;
	const mongo_uri =
		node_env === "production"
			? process.env.MONGO_URI
			: process.env.MONGO_URI_TEST;
	mongoose
		.connect(mongo_uri)
		.then(() => logger.info(`Conneted to ${mongo_uri}...`));
};
