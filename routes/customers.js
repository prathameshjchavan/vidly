const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");

// Get all the customers
router.get("/", async (req, res) => {
	const customers = await Customer.find().sort("name");

	if (customers.length === 0) return res.status(404).send("No customers found");

	res.status(200).send(customers);
});

// Get cutomer by id
router.get("/:id", async (req, res) => {
	const customer = await Customer.findById(req.params.id);

	if (!customer)
		return res
			.status(404)
			.send("The customer with the given ID was not found.");

	res.status(200).send(customer);
});

// Create a customer
router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) {
		const errorMessage = error.details.map((err) => err.message).join("\n");
		return res.status(400).send(errorMessage);
	}

	const customer = new Customer(req.body);
	await customer.save();
	res.status(201).send(customer);
});

// Modify a customer
router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) {
		const errorMessage = error.details.map((err) => err.message).join("\n");
		return res.status(400).send(errorMessage);
	}

	const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});

	if (!customer)
		return res
			.status(404)
			.send("The customer with the given ID was not found.");

	res.status(200).send(customer);
});

// Delete a customer
router.delete("/:id", async (req, res) => {
	const result = await Customer.findByIdAndDelete(req.params.id, { new: true });

	if (!result)
		return res
			.status(404)
			.send("The customer with the given ID was not found.");

	res.status(200).send(result);
});

module.exports = router;
