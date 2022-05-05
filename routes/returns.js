const express = require("express");
const auth = require("../middlewares/auth");
const moment = require("moment");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const validate = require("../middlewares/validate");
const Joi = require("joi");
require("joi-objectid");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
	const rental = await Rental.findOne({
		"customer._id": req.body.customerId,
		"movie._id": req.body.movieId,
	});
	if (!rental) return res.status(404).send("Rental not found");
	if (rental.dateReturned)
		return res.status(400).send("Rental is already processed");

	rental.dateReturned = Date.now();
	const rentalDays = moment().diff(rental.dateOut, "days");
	rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
	await rental.save();

	await Movie.updateOne(
		{ _id: rental.movie._id },
		{ $inc: { numberInStock: 1 } }
	);

	res.status(200).send(rental);
});

function validateReturn(req) {
	const schema = Joi.object({
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required(),
	});

	return schema.validate(req);
}

module.exports = router;
