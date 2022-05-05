const express = require("express");
const auth = require("../middlewares/auth");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const validate = require("../middlewares/validate");
const Joi = require("joi");
require("joi-objectid");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
	const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

	if (!rental) return res.status(404).send("Rental not found");
	if (rental.dateReturned)
		return res.status(400).send("Rental is already processed");

	rental.return();
	await rental.save();

	await Movie.updateOne(
		{ _id: rental.movie._id },
		{ $inc: { numberInStock: 1 } }
	);

	res.send(rental);
});

function validateReturn(req) {
	const schema = Joi.object({
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required(),
	});

	return schema.validate(req);
}

module.exports = router;
