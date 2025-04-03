const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product")
const Stripe = require("stripe");

// Global Variables
const currency = 'aed';
const deliveryFee = 10;

// Initialize stripe
const stripe = new Stripe(process.env.STRIPE_KEY)

const placeStripeOrder = async (req,res)  => {
  try {

    const { userId, items, amount, address, restaurantId } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      restaurantId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      paymentStatus: 'no',
    }

    const newOrder = new Order(orderData)
    newOrder.save();

    const line_items = items.map(item => ({
      price_data: {
        currency,
        product_data: {
          name: item.itemId
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }))

    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: 'Delivery Fee'
        },
        unit_amount: deliveryFee * 100
      },
      quantity: 1
    })

    const session = await stripe.checkout.sessions.create({
      // success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      success_url: `${origin}/`,
      cancel_url: `${origin}/`,
      line_items,
      mode: 'payment',
    });

    return res.json({success: true, session_url: session.url, message: 'order has been placed'})

    
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports =  { placeStripeOrder }