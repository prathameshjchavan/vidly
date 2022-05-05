const { default: mongoose } = require("mongoose");
const auth = require("../../../middlewares/auth");
const { User } = require("../../../models/user");
require("dotenv").config();

describe("auth middleware", () => {
	it("should populate req.user with the payload of a valid JWT", () => {
		const user = {
			_id: new mongoose.Types.ObjectId().toHexString(),
			isAdmin: true,
		};
		const token = new User(user).generateAuthToken();
		const req = {
			header: jest.fn().mockReturnValue(token),
		};
		const next = jest.fn();
		const res = {};

		auth(req, res, next);

		expect(req.user).toMatchObject(user);
	});
});
