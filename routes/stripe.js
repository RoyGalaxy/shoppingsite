const router = require("express").Router()
const dotenv = require("dotenv")
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_KEY)
// const stripe = require("stripe")('sk_test_51LlpoqSCw4adMApfZwBysTYcKdcubVGGdej9jo5AReNVuc0fTuWpXpBl0uyFa6vHprRCvdTJR0KbOnBGMqia1obg00i5bPlvTc');

function calculateAmount(items){
    let amount = 0
    items.forEach(item => {
        amount += item.price * item.quantity
    })
    return amount
}

router.post("/create-payment-intent", async (req, res) => {
    const { user,items,shipping } = req.body;
    const amount = calculateAmount(items)

    const paymentIntent = await stripe.paymentIntents.create({
        description: 'Software development services',
        shipping,
        amount: amount * 100,
        currency: 'usd',
        automatic_payment_methods: {enabled: true},
    });

    // Create a PaymentIntent with the order amount and currency
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: calculateOrderAmount(items),
    //   currency: "usd",
    //   description: "Food Orders",
    //   automatic_payment_methods: {
    //     enabled: true,
    //   },
    // });

    res.send({
        clientSecret: paymentIntent.client_secret,
        amount: amount
    });
});

router.post("/payment", (req,res) => {
    const amount = 1400
    stripe.charges.create({
        source: req.body.tokenId,
        amount: 1400,
        currency:"inr",
    },(stripeErr,stripeRes) => {
        if(stripeErr){
            res.status(500).json(stripeErr)
        }else{
            res.status(200).json(stripeRes)
        }
    })
})

module.exports = router