const express = require("express");
const path = require("path");
const Insta = require("instamojo-nodejs");
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
require("dotenv").config();

Insta.setKeys(process.env.API_KEY, process.env.AUTH_KEY);

Insta.isSandboxMode(true);

const app = express();

app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/donate", (req, res) => {
  res.render("donate");
});

app.post("/donate", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const amount = req.body.amount;
  const data = new Insta.PaymentData();

  const REDIRECT_URL = `${req.protocol}://${req.get("host")}/success`;

  data.amount = amount;
  data.name = name;
  data.email = email;

  data.setRedirectUrl(REDIRECT_URL);
  data.send_email = "True";
  data.purpose = "Donation";

  Insta.createPayment(data, function (error, response) {
    if (error) {
      return;
    } else {
      res.render("payment");
    }
  });
});

app.get("/success", (req, res) => {
  res.render("success");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started");
});
