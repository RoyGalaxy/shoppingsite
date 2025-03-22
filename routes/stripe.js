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

router.post("/create-checkout-session", async (req, res) => {
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: { name: "Product Name" },
						unit_amount: 1000,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: "http://localhost:5173/success",
			cancel_url: "http://localhost:5173/cancel",
			custom_text: {
				submit: {
					message: "Secure payment powered by Stripe",
				},
			},
		});

		res.json({ url: session.url });
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: error.message });
	}
});

router.post("/create-payment-intent", async (req, res) => {
	console.log(req.body)
	const { user, items, shipping } = req.body;
	// const amount = calculateAmount(items) || 0
	const amount = 1000

	const customer = await stripe.customers.create({
		// name: user.phone,
		name: '+918824707969',
		metadata: {
			// userId: user._id,
			userId: 'v012ghjewer'
		}
	})

	const options = {
		description: 'Food Delivery Service',
		shipping: {
			name: '+918824707969',
			address: {
				line1: `Longitude: 1`,
				line2: `Latitude: 1`,
				country: "AE"
			}
		},
		amount: 1000,
		currency: 'aed',
		customer: customer.id,
		payment_method_types: ["card"]
	}

	const paymentIntent = await stripe.paymentIntents.create(options);

	res.send({
		clientSecret: paymentIntent.client_secret,
		amount: amount
	});
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_40d2861bc58ad315a2d232f5e5468571e94f8bef71de9f51b698731858b02845";

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


// ! It's alternate has been used above, so can be deleted
// router.post("/payment", (req,res) => {
//     const amount = 1400
//     stripe.charges.create({
//         source: req.body.tokenId,
//         amount: 1400,
//         currency:"inr",
//     },(stripeErr,stripeRes) => {
//         if(stripeErr){
//             res.status(500).json(stripeErr)
//         }else{
//             res.status(200).json(stripeRes)
//         }
//     })
// })

module.exports = router