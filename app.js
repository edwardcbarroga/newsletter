//jshint esversion:6
const HTTP_PORT = process.env.PORT || 3000;
const { subscribe } = require("diagnostics_channel");
const express = require("express");
const https = require("https");
const app = express();
require("dotenv").config();

const MAPI_KEY = process.env.API_KEY;
const MLIST_ID = process.env.LIST_ID;
const MAPI_SERVER = process.env.API_SERVER;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    // console.log(firstName + " " + lastName + " " + email);
    // res.write(firstName + " " + lastName + " " + email);
    // res.send();

    const jsonData = JSON.stringify(data);
    const url = "https://" + MAPI_SERVER + ".api.mailchimp.com/3.0/lists/" + MLIST_ID;
    const options = {
        method: "POST",
        auth: "edward:" + MAPI_KEY
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req,res) {
    res.redirect("/");
});

app.listen(HTTP_PORT, function () {
    console.log("server is running on port .");
});