const mongoose = require("mongoose");

const Customer = mongoose.model(
	"Customer",
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
			minlength: 2,
			maxlength: 30,
			trim: true,
		},
		isGold: { type: Boolean, default: false },
		phone: {
			type: String,
			required: true,
			length: 10,
			trim: true,
		},
	})
);

function validate(customer) {
	const schema = Joi.object({
		name: Joi.string().min(2).max(30).required(),
		isGold: Joi.boolean().required(),
		phone: Joi.string().length(10).required(),
	});

	return schema.validate(customer, { abortEarly: false });
}

exports.Customer = Customer;
exports.validate = validate;
