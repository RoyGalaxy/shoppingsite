const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const cors = require("cors")

const Product = require('./models/Product')



const app = express()

dotenv.config();


app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "font-src 'self' https://js.stripe.com data:; "
    );
    next();
});

app.use("/api/checkout/webhook", bodyParser.raw({ type: '*/*' }));
app.use("/api/whatsapp/webhook", bodyParser.raw({ type: '*/*' }));
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get("/secure", (req, res) => {
    process.env.secured = "true";
    res.send("Evertyhing under control")
})
app.get("/de-secure", (req, res) => {
    process.env.secured = "false";
    res.send("Evertyhing under control")
})

const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const restaurantRoute = require("./routes/restaurant")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const stripeRoute = require("./routes/stripe")
const colorSchemeRoute = require("./routes/colorScheme")

app.use(cors({
    // origin: "http://localhost:5173", // Your frontend URL
    origin: "https://realitydiner.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.static("./public"))
app.use(express.json())
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/restaurants/", restaurantRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/orders", orderRoute)
app.use("/api/checkout", stripeRoute)
app.use("/api/colors", colorSchemeRoute)

mongoose.set('strictQuery', false)
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to database")
        app.listen(process.env.PORT || 3000, () => {
            console.log("server started at port:", process.env.PORT || 3000)
        })
    })
    .catch(err => console.log(err))
