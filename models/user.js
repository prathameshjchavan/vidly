const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 30,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		maxlength: 1024,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, isAdmin: this.isAdmin },
		process.env.jwtPrivateKey
	);

	return token;
};

const User = mongoose.model("User", userSchema);

function validate(user) {
	const schema = Joi.object({
		name: Joi.string().min(2).max(30).required(),
		email: Joi.string().email().min(5).max(255).required(),
		password: Joi.string().min(6).max(1024).required(),
	});

	return schema.validate(user, { abortEarly: false });
}

exports.User = User;
exports.validate = validate;
