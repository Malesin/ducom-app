const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

app.use(express.json())

const mongoUrl = "mongodb+srv://rifzky:admin@cluster0.as0eld6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const JWT_SECRET = "dskfbdsaifvdsfvqueqbegfdbhfvsdbfioh23b4235145bj134[][ewfddsafcdsacdsj13"

mongoose.connect(mongoUrl).then(() => {
    console.log("MongoDB Connected")
}).catch((err) => {
    console.log(err)
})
require('./UserDetails')

const User = mongoose.model("UserInfo")

app.get("/", (req, res) => {
    res.send({ status: "Hello World" })
})

app.post("/register", async (req, res) => {
    const { name, username, email, password } = req.body

    const oldUserEmail = await User.findOne({ email: email })
    const oldUserUsername = await User.findOne({ username: username })

    if (oldUserEmail || oldUserUsername) {
        return res.send({ data: "User Already Exists!!" })
    }

    const encryptedpassword = await bcrypt.hash(password, 10)

    try {
        await User.create({
            name: name,
            username: username,
            email: email,
            password: encryptedpassword
        })
        res.send({ status: "ok", data: "User Created" })
    } catch (error) {
        res.send({ status: "error", data: error })

    }
})

app.post("/login-user", async (req, res) => {
    const { email, password } = req.body

    const oldUserEmail = await User.findOne({ email: email })
    // const oldUserUsername = await User.findOne({ email: username })

    if (!oldUserEmail) {
        return res.send({ data: "Email Doesn't Exists!!" })
    } 
    // else if (!oldUserUsername) {
    //     return res.send({ data: "User Doesn't Exists!!" })
    // }
    // SEMENTARA KITA PAKAI EMAIL DULU

    if (await bcrypt.compare(password, oldUserEmail.password)) {
        const token = jwt.sign({ email: oldUserEmail.email }, JWT_SECRET)

        if (res.status(201)) {
            return res.send({ status: "ok", data: token })
        } else {
            res.send({ status: "error" })
        }
    }

})

app.listen(5001, () => {
    console.log("server is running on port 5001")
})