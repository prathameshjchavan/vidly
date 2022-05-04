const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) {
		const errorMessage = error.details.map((err) => err.message).join("\n");
		return res.status(400).send(errorMessage);
	}

	let user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Invalid email or password.");

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send("Invalid email or password.");

	const token = user.generateAuthToken();

	res.header("x-auth-token", token).status(200).send(true);
});

function validate(req) {
	const schema = Joi.object({
		email: Joi.string().email().min(5).max(255).required(),
		password: Joi.string().min(6).max(1024).required(),
	});

	return schema.validate(req, { abortEarly: false });
}

module.exports = router;
