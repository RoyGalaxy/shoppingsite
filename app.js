const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const cors = require("cors")

const app = express()
app.use("/api/checkout/webhook",bodyParser.raw({type: '*/*'}));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const stripeRoute = require("./routes/stripe")


dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to database"))
    .catch(err => console.log(err))

app.use(cors())
app.use(express.static("./public"))
app.use(express.json())
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/products",productRoute)
app.use("/api/carts",cartRoute)
app.use("/api/orders",orderRoute)
app.use("/api/checkout",stripeRoute)

app.get("/checkout")

app.listen(process.env.PORT || 3000,() => {
    console.log("server started at port:",process.env.PORT || 3000)
})
