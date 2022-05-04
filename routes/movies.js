const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

// Get all movies
router.get("/", async (req, res) => {
	const movies = await Movie.find().sort("title");

	if (movies.length === 0) return res.status(404).send("No Movies Found");

	res.status(200).send(movies);
});

// Get a movie by id
router.get("/:id", async (req, res) => {
	const movie = await Movie.findById(req.params.id);

	if (!movie)
		return res.status(404).send("The movie with the given ID was not found.");

	res.status(200).send(movie);
});

// Create a movie
router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) {
		const errorMessage = error.details.map((err) => err.message).join("\n");
		return res.status(400).send(errorMessage);
	}

	const { title, genreId, numberInStock, dailyRentalRate } = req.body;

	const genre = await Genre.findById(genreId).select("_id name");
	if (!genre) return res.status(400).send("Invalid Genre");

	const movie = new Movie({
		title,
		genre,
		numberInStock,
		dailyRentalRate,
	});
	await movie.save();
	res.status(201).send(movie);
});

// Modify a movie
router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) {
		const errorMessage = error.details.map((err) => err.message).join("\n");
		return res.status(400).send(errorMessage);
	}

	const { title, genreId, numberInStock, dailyRentalRate } = req.body;

	const genre = await Genre.findById(genreId).select("_id name");
	if (!genre) return res.status(400).send("Invalid Genre");

	const movie = await Movie.findByIdAndUpdate(
		req.params.id,
		{
			$set: { title, "genre.name": genre.name, numberInStock, dailyRentalRate },
		},
		{
			new: true,
		}
	);

	if (!movie)
		return res.status(404).send("The movie with the given ID was not found.");

	res.status(200).send(movie);
});

// Delete a movie
router.delete("/:id", async (req, res) => {
	const result = await Movie.findByIdAndDelete(req.params.id, { new: true });

	if (!result)
		return res.status(404).send("The movie with the given ID was not found.");

	res.status(200).send(result);
});

module.exports = router;
