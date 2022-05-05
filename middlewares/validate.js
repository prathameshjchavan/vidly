module.exports = (validator) => {
	return (req, res, next) => {
		const { error } = validator(req.body);
		if (error) {
			const errorMessage = error.details.map((err) => err.message).join("\n");
			return res.status(400).send(errorMessage);
		}
		next();
	};
};
