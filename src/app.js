const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to database"))
    .catch(err => console.log(err))

app.use(express.static("../public"))
app.use(express.json())
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)

app.get("/checkout")

app.listen(process.env.PORT || 3000,() => {
    console.log("serever started at port:",process.env.PORT || 3000)
})