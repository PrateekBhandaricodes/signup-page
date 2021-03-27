
const express = require("express");
const https = require("https");
const request = require("request");
const bodyparser = require("body-parser");

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is online");
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function (req, res) {
    const firstname = req.body.first;
    const secondname = req.body.second;
    const email = req.body.mail;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: secondname
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us1.api.mailchimp.com/3.0/lists/0d3b6f60e2";
    const options = {
        method: "POST",
        auth: "prat:d9c5c178c4618d86e4410790d7619e51-us1"
    }
    const request = https.request(url, options, function (response) {
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

//d9c5c178c4618d86e4410790d7619e51-us1
//0d3b6f60e2