const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 50,
		trim: true,
	},
	genre: { type: genreSchema, required: true },
	numberInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
	dailyRentalRate: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
});

const Movie = mongoose.model("Movie", movieSchema);

function validate(movie) {
	const schema = Joi.object({
		title: Joi.string().required().min(2).max(50),
		genreId: Joi.objectId().required(),
		numberInStock: Joi.number(),
		dailyRentalRate: Joi.number(),
	});

	return schema.validate(movie, { abortEarly: false });
}

exports.Movie = Movie;
exports.validate = validate;
