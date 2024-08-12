// const MONGO_URL = process.env.MONGO_URL;
// const JWT_SECRET = process.env.JWT_SECRET;
// const PORT = process.env.PORT || 5001;

const MONGO_URL = "mongodb+srv://ducombackend:ducomadmin@ducomapp.nqicz5h.mongodb.net/?retryWrites=true&w=majority&appName=DucomApp"

const JWT_SECRET = "bfidkfdsajciusfweubfsdihugigfbrecfnsdprisca[][ewfddsafcdsacdsj13"

const PORT = 5001


const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect(MONGO_URL).then(() => {
    console.log("MongoDB Connected")
}).catch((err) => {
    console.log(err)
})

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    console.log("server is running on port " + PORT)
})

require('./Model/UserModel')
const User = mongoose.model("UserModel")

app.post("/register", async (req, res) => {
    const { name, username, email, password } = req.body
    const oldUserEmail = await User.findOne({ email: email })
    const oldUserUsername = await User.findOne({ username: username })

    if (oldUserUsername) {
        return res.send({ status: "alreadyUser", data: "User Already Exists!!" })
    }

    if (oldUserEmail) {
        return res.send({ status: "alreadyEmail", data: "Email Already Exists!!" })
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
    const { email, username, password } = req.body;

    let oldUser;

    // Jika email disediakan, cari berdasarkan email
    if (email || username) {
        if (email) oldUser = await User.findOne({ email: email });
        // Jika username disediakan, cari berdasarkan username
        if (!oldUser) {
            oldUser = await User.findOne({ username: email });
        }
    }
    // Jika tidak ada email atau username yang disediakan
    else {
        return res.send({ status: "error", data: "Email or Username is required" });
    }

    // Jika pengguna tidak ditemukan
    if (!oldUser) {
        return res.send({ status: "error", data: "User Not Found" });
    }

    // Periksa apakah password valid
    const isPasswordValid = await bcrypt.compare(password, oldUser.password);

    // Jika password valid, buat token JWT
    if (isPasswordValid) {
        const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
        return res.status(201).send({ status: "ok", data: token });
    } else {
        return res.send({ status: "errorPass", data: "Incorrect Password" });
    }
});

app.post("/userdata", async (req, res) => {
    const { token } = req.body
    try {
        const user = jwt.verify(token, JWT_SECRET)
        const useremail = user.email

        User
            .findOne({ email: useremail })
            .then(data => {
                return res.send({ status: "ok", data: data })
            })
    } catch (error) {
        return res.send({ status: 'error', error: error })
    }
})

// Multer configuration for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

require('./Model/ImageModel')
const Image = mongoose.model("ImageModel")

// Endpoint to upload image
app.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        const image = new Image({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            imageBase64: req.file.buffer.toString('base64'),
        });

        await image.save();
        res.status(201).send({ status: 'ok', data: 'Image uploaded successfully' });
    } catch (error) {
        res.status(500).send({ status: 'error', data: error.message });
    }
});


// Endpoint to get image by filename
app.get('/image/:filename', async (req, res) => {
    try {
        const image = await Image.findOne({ filename: req.params.filename });

        if (!image) {
            return res.status(404).send({ status: 'error', data: 'Image not found' });
        }

        res.set('Content-Type', image.contentType);
        res.send(Buffer.from(image.imageBase64, 'base64'));
    } catch (error) {
        res.status(500).send({ status: 'error', data: error.message });
    }
});


// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: 'ducombackend@gmail.com',
        pass: 'qylfvgqpmmslwivq'
    }
});


// FORGOT PASSWORD
const otps = {};
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        // Periksa apakah email terdaftar di database
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.send({ status: "errorEmail", data: "Email not registered" });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

        // Simpan OTP dan waktu kadaluarsa di otps
        otps[email] = { otp, otpExpiry };

        const mailOptions = {
            from: 'ducombackend@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}. It will expire in 15 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.send({ status: "error", data: error.message });
            } else {
                return res.send({ status: "ok", data: "OTP sent to email" });
            }
        });
    } catch (error) {
        return res.send({ status: 'error', error: error.message });
    }
});


// VERIFY OTP
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const storedOtp = otps[email];

    if (!storedOtp) {
        return res.send({ status: "error", data: "OTP not found or expired" });
    }

    if (storedOtp.otp === otp) {
        if (Date.now() > storedOtp.otpExpiry) {
            delete otps[email]; // Hapus OTP jika kadaluarsa
            return res.send({ status: "errorExpired", data: "OTP expired" });
        }

        delete otps[email]; // Hapus OTP setelah verifikasi berhasil
        return res.send({ status: "ok", data: "OTP verified" });
    } else {
        return res.send({ status: "error", data: "Invalid OTP" });
    }
});


// CHANGE PASSWORD
app.post('/change-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email: email });
        // Verifikasi apakah password baru sama dengan password lama
        const isPasswordSame = await bcrypt.compare(newPassword, user.password);

        if (isPasswordSame) {
            return res.send({ status: 'errorPassSame', data: 'New password must be different from the old password' });
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email: email }, { $set: { password: encryptedPassword } });
        res.send({ status: 'ok', data: 'Password updated successfully' });
    } catch (error) {
        res.send({ status: 'error', data: error.message });
    }
});
