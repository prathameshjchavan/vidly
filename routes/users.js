const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate: validateUser } = require("../models/user");
const validate = require("../middlewares/validate");

router.get("/me", auth, async (req, res) => {
	const user = await User.findById(req.user._id).select("-password");
	res.status(200).send(user);
});

router.post("/", validate(validateUser), async (req, res) => {
	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).send("User already registered.");

	user = new User(req.body);
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	await user.save();

	const token = user.generateAuthToken();
	res
		.header("x-auth-token", token)
		.status(201)
		.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
