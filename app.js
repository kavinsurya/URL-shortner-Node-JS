const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();
var shortUrl = require('node-url-shortener');

const mongodb = require('mongodb');
const client = mongodb.MongoClient;


const app = express()
app.use(cors());
app.use(bodyParser.json())



const url = "mongodb://localhost:27017";
let urlshortner = [];


// var urlshortner ="";



app.get('/users', async function (req, res) {
    try {
        let connection = await client.connect(url);
        let dataBase = connection.db("url_shortner");
        let data = await dataBase.collection("users").find().toArray();
        await connection.close();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }

})


app.post('/register', async (req, res) => {
    try {
        let connection = await client.connect(url);
        let dataBase = connection.db("url_shortner");
        let data = await dataBase.collection("users").findOne({ email: req.body.email })
        if (data) {
            res.status(400).json({
                message: "User already exists"
            });
        } else {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt);
            req.body.password = hash;
            await dataBase.collection("users").insertOne(req.body);
            res.status(200).json({
                message: "Registration Successful"
            });
        }
        await connection.close();
    } catch (error) {
        console.log(error);
    }

})

app.post('/login', async (req, res) => {
    try {
        let connection = await client.connect(url);
        let dataBase = connection.db('url_shortner');
        let data = await dataBase.collection('users').findOne({ email: req.body.email });
        if (data) {
            let compare = await bcrypt.compare(req.body.password, data.password);
            if (compare) {
                res.status(200).json({
                    message: "Logged in Successfully"
                });
            } else {
                res.status(400).json({
                    message: "Login Failed"
                });
            }
        } else {
            res.status(401).json({
                message: "E-mail is not registered"
            })
        }
        await connection.close();
    } catch (error) {
        console.log(error);
    }
})



app.post('/sendMail', async (req, res) => {
    try {
        let connection = await client.connect(url);
        let db = connection.db("url_shortner");
        let checkvalidity = await db.collection("users").findOne({ email: req.body.email });
        console.log(checkvalidity);
        if (checkvalidity) {
            let data = await db.collection("reset").insertOne(req.body);
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.mail,
                    pass: process.env.password
                }
            });

            let mailOptions = {
                from: "kavinguvi@gmail.com",
                to: req.body.email,
                subject: "Password reset",
                html: `<div>
                <p>Hello ${checkvalidity.name},</p>

                <p>Enter the code <b>${req.body.code}</b> in the webpage!!</p>

                <p>Regards,</p>
                <p>Password reset team</p>
                </div>`
            }
            console.log(mailOptions);

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    res.status(401).json({ message: "Error occured while sending mail" })
                } else {
                    res.status(200).json({ message: "Email sent !!" })
                }
            })
            await connection.close();
        } else {
            res.status(402).json({ message: "User doesn't exist in data base!" })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error while sending mail !!" })
    }
})





app.post('/code', async (req, res) => {
    let connection = await client.connect(url);
    let db = connection.db("url_shortner");
    let ismatching = await db.collection('reset').findOne({ "code": req.body.code });
    if (ismatching !== null) {
        res.status(200).json({
            message: "success"
        });
    } else {
        res.status(400).json({
            message: "code doesn't match"
        });
    }
    await connection.close();
})

app.put('/resetpassword', async (req, res) => {
    let connection = await client.connect(url);
    let db = connection.db("url_shortner");
    let isAvailable = await db.collection("users").findOne({ email: req.body.email });
    if (isAvailable) {
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        let updatepassword = await db.collection("users").updateOne({ "email": req.body.email }, { $set: { "password": req.body.password } });
        if (updatepassword) {
            res.status(200).json({
                message: "Password Updated successfully"
            })
        } else {
            res.status(400).json({
                message: "Password reset failed"
            })
        }
        await connection.close();
    } else {
        res.status(401).json({
            message: "Email doesn't exist"
        })
    }


})



app.post('/urlShortner', (req, res) => {
    console.log(req.body.url)
    shortUrl.short(`${req.body.url}`, function (err, url) {
        // console.log(url);
        urlshortner.push(url);
        res.json(urlshortner)
    });

})


app.get('/getUrl', (req, res) => {
    res.json(urlshortner);
})



app.post('/sendLink', async (req, res) => {
    try {
        let connection = await client.connect(url);
        let db = connection.db("url_shortner");
        let checkvalidity = await db.collection("users").findOne({ email: req.body.email });
        console.log(checkvalidity);
        if (checkvalidity) {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.mail,
                    pass: process.env.password
                }
            });

            let mailOptions = {
                from: "kavinguvi@gmail.com",
                to: req.body.email,
                subject: "Password reset",
                html: `<div>
                <p>Hello ${checkvalidity.name},</p>

                <p>Enter the code <b>http://127.0.0.1:5500/assets/login/login.html</b> in the webpage!!</p>

                <p>Regards,</p>
                <p>Password reset team</p>
                </div>`
            }
            console.log(mailOptions);

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    res.status(401).json({ message: "Error occured while sending mail" })
                } else {
                    res.status(200).json({ message: "Email sent !!" })
                }
            })
            await connection.close();
        } else {
            res.status(402).json({ message: "User doesn't exist in data base!" })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error while sending mail !!" })
    }
})


app.listen(3000, () => {
    console.log('Listening to port 3000');
})