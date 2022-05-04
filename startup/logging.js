const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
	const exceptionLogger = winston.createLogger({
		level: "error",
		format: winston.format.json(),
		defaultMeta: { service: "user-service" },
		transports: [
			new winston.transports.File({
				filename: "exceptions.log",
				level: "error",
			}),
			new winston.transports.MongoDB({
				db: "mongodb://localhost/vidly",
				collection: "exceptionLogs",
				options: { useUnifiedTopology: true },
				level: "error",
			}),
		],
	});

	const rejectionLogger = winston.createLogger({
		level: "error",
		format: winston.format.json(),
		defaultMeta: { service: "user-service" },
		transports: [
			new winston.transports.File({
				filename: "rejections.log",
				level: "error",
			}),
			new winston.transports.MongoDB({
				db: "mongodb://localhost/vidly",
				collection: "rejectionLogs",
				options: { useUnifiedTopology: true },
				level: "error",
			}),
		],
	});

	if (process.env.NODE_ENV !== "production") {
		exceptionLogger.add(
			new winston.transports.Console({
				format: winston.format.simple(),
			})
		);
		rejectionLogger.add(
			new winston.transports.Console({
				format: winston.format.simple(),
			})
		);
	}

	process.on("uncaughtException", (ex) => {
		exceptionLogger.error(ex.message, ex);
		exceptionLogger.on("finish", () => process.exit(1));
		exceptionLogger.end();
	});

	process.on("unhandledRejection", (ex) => {
		rejectionLogger.error(ex.message, ex);
		rejectionLogger.on("finish", () => process.exit(1));
		rejectionLogger.end();
	});
};
