const express = require("express")
const router = express.Router()
const dotenv = require("dotenv")
const Order = require("../models/Order")
const Cart = require("../models/Cart")
const deliveryCharge = 1
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_KEY)

function calculateAmount(items) {
	let amount = 0
	items.forEach(item => {
		amount += item.price * item.quantity
	})
	return amount
}

// Create Order
async function createOrder(cust, data) {
	try {
		const cart = await Cart.findOne({ userId: cust.metadata.userId })

		const options = {
			userId: cust.metadata.userId,
			customerId: data.customer,
			paymentIntentId: data.payment_intent,
			products: cart.products,
			amount: data.amount / 100,
			address: data.shipping.address,
			payment_status: data.status
		}

		const newOrder = new Order(options)
		const savedOrder = await newOrder.save()
		// Delete the pre-existing cart
		await Cart.findByIdAndDelete(cart._id)
	} catch (err) {
		console.log(err)
	}
}


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
	const sig = request.headers['stripe-signature'];
	let event;

	try {
		event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
	} catch (err) {
		console.log(err)
		response.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	// Handle the event
	switch (event.type) {
		case 'payment_intent.succeeded':
			const paymentInt = event.data.object
			stripe.customers.retrieve(paymentInt.customer).then(cust => {
				createOrder(cust, paymentInt)
			}).catch(err => console.log(err))
			break;
		// ... handle other event types
		// default:
		// 	console.log(`Unhandled event type ${event.type}`);
	}

	//* Return a 200 response to acknowledge receipt of the event
	response.send().end();
});




module.exports = router