const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

describe("user.generateAuthToken", () => {
	it("should return a valid JWT token", () => {
		const payload = { _id: new mongoose.Types.ObjectId(), isAdmin: true };
		const user = new User(payload);
		const token = user.generateAuthToken();
		const decode = jwt.verify(token, process.env.jwtPrivateKey);
		expect(decode).toMatchObject(payload);
	});
});
