const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		requried: true,
		minlength: 5,
		maxlength: 50,
		trim: true,
	},
});

const Genre = mongoose.model("Genre", genreSchema);

function validate(genre) {
	const schema = Joi.object({
		name: Joi.string().min(5).max(50).required(),
	});

	return schema.validate(genre);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validate;
