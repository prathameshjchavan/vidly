const request = require("supertest");
const { default: mongoose } = require("mongoose");
const { Rental } = require("../../../models/rental");
const { User } = require("../../../models/user");
const moment = require("moment");
const { Movie } = require("../../../models/movie");

describe("/api/returns", () => {
	let server, customerId, movieId, rental, token, movie;

	const exec = () => {
		return request(server)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({
				customerId,
				movieId,
			});
	};

	beforeEach(async () => {
		server = require("../../../index");
		customerId = mongoose.Types.ObjectId();
		movieId = mongoose.Types.ObjectId();
		token = new User().generateAuthToken();
		movie = new Movie({
			_id: movieId,
			title: "abcde",
			dailyRentalRate: 2,
			genre: { name: "abcde" },
			numberInStock: 10,
		});
		await movie.save();

		rental = new Rental({
			customer: {
				_id: customerId,
				name: "abcde",
				phone: "1234567890",
			},
			movie: {
				_id: movieId,
				title: "movie title",
				dailyRentalRate: 2,
			},
		});
		await rental.save();
	});

	afterEach(async () => {
		server.close();
		await Rental.deleteMany();
		await Movie.deleteMany();
	});

	it("should work!", async () => {
		const res = await Rental.findById(rental._id);

		expect(res).not.toBeNull();
	});

	it("should return 401 if client is not logged in", async () => {
		token = "";

		const res = await exec();

		expect(res.status).toBe(401);
	});

	it("should return 400 if customerId is not provided", async () => {
		customerId = null;

		const res = await exec();

		expect(res.status).toBe(400);
	});

	it("should return 400 if movieId is not provided", async () => {
		movieId = null;

		const res = await exec();

		expect(res.status).toBe(400);
	});

	it("should return 404 if no rental found for this customer/movie", async () => {
		await Rental.deleteMany();

		const res = await exec();

		expect(res.status).toBe(404);
	});

	it("should return 400 if return is already processed", async () => {
		rental.dateReturned = Date.now();
		rental.rentalFee = 10;
		await rental.save();

		const res = await exec();

		expect(res.status).toBe(400);
	});

	it("should return 200 if valid request", async () => {
		const res = await exec();

		expect(res.status).toBe(200);
	});

	it("should set the return date if input is valid", async () => {
		await exec();

		const rentalInDb = await Rental.findById(rental._id);
		const diff = new Date() - rentalInDb.dateReturned;

		expect(diff).toBeLessThan(10 * 1000);
	});

	it("should calculate the rental fee if input is valid", async () => {
		rental.dateOut = moment().add(-7, "days").toDate();
		await rental.save();

		await exec();

		const rentalInDb = await Rental.findById(rental._id);

		expect(rentalInDb.rentalFee).toBe(14);
	});

	it("should increase the movie stock", async () => {
		await exec();

		const movieInDb = await Movie.findById(movieId);

		expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
	});

	it("should return the rental if input is valid", async () => {
		await exec();

		const rentalInDb = await Rental.findById(rental._id);

		expect(Object.keys(rentalInDb._doc)).toEqual(
			expect.arrayContaining([
				"dateOut",
				"dateReturned",
				"rentalFee",
				"customer",
				"movie",
			])
		);
	});
});
