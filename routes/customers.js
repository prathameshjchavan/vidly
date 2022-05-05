const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { Customer, validate: validateCustomer } = require("../models/customer");

// Get all the customers
router.get("/", async (req, res) => {
	const customers = await Customer.find().sort("name");

	if (customers.length === 0) return res.status(404).send("No customers found");

	res.send(customers);
});

// Get cutomer by id
router.get("/:id", async (req, res) => {
	const customer = await Customer.findById(req.params.id);

	if (!customer)
		return res
			.status(404)
			.send("The customer with the given ID was not found.");

	res.send(customer);
});

// Create a customer
router.post("/", validate(validateCustomer), async (req, res) => {
	const customer = new Customer(req.body);
	await customer.save();
	res.status(201).send(customer);
});

// Modify a customer
router.put("/:id", validate(validateCustomer), async (req, res) => {
	const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});

	if (!customer)
		return res
			.status(404)
			.send("The customer with the given ID was not found.");

	res.send(customer);
});

// Delete a customer
router.delete("/:id", async (req, res) => {
	const result = await Customer.findByIdAndDelete(req.params.id, { new: true });

	if (!result)
		return res
			.status(404)
			.send("The customer with the given ID was not found.");

	res.send(result);
});

module.exports = router;
