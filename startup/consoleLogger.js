const winston = require("winston");
const { format } = require("winston");

const consoleFormat = format.printf(
	({ level, message }) => `${level}: ${message}`
);

const logger = winston.createLogger({
	level: "info",
	format: consoleFormat,
	transports: [new winston.transports.Console()],
});

module.exports = logger;
