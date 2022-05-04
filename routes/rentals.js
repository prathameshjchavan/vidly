const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const express = require("express");
const Fawn = require("fawn");
const router = express.Router();

Fawn.init("mongodb://localhost/vidly");

// Get all rentals
router.get("/", async (req, res) => {
	const rentals = await Rental.find().sort("-dateOut");

	if (!rentals) return res.status(404).send("No rentals found");

	res.status(200).send(rentals);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) {
		const errorMessage = error.details.map((err) => err.message).join("\n");
		return res.status(400).send(errorMessage);
	}

	const { customerId, movieId } = req.body;

	const customer = await Customer.findById(customerId);
	if (!customer) return res.status(400).send("Invalid customer");

	const movie = await Movie.findById(movieId);
	if (!movie) return res.status(400).send("Invalid movie");

	if (movie.numberInStock === 0)
		return res.status(400).send("Movie not in stock");

	const rental = new Rental({
		customer: {
			_id: customer._id,
			name: customer.name,
			phone: customer.phone,
		},
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate,
		},
	});

	try {
		new Fawn.Task()
			.save("rentals", rental)
			.update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
			.run();
		res.status(201).send(rental);
	} catch (ex) {
		res.status(500).send("Something went wrong");
	}
});

module.exports = router;
