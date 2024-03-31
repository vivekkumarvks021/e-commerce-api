const mongoose = require("mongoose");
const express = require("express");
const app = express();
const checkToken = require("./middleware/auth");
const validate = require("./middleware/validation");
const asyncMiddleware = require("./middleware/asyncMiddleware");
const error = require("./middleware/error");

mongoose
  .connect("mongodb://localhost/ecommerceapp")
  .then(() => console.log("Connected to database MongoDB..."))
  .catch((error) =>
    console.error("Could not connect to database MongoDB...", error)
  );

let bodyParser = require("body-parser");

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send({ port: "Server Started." });
});

const register = require("./route/auth/register");

app.post(
  "/register",
  validate(register.registerSchema),
  asyncMiddleware(register.register)
);

const login = require("./route/auth/login");
app.post("/login", validate(login.loginSchema), asyncMiddleware(login.login));

//to get all users
const usersRouter = require("./route/users/route");
app.use("/users", checkToken, usersRouter);

const productRoutes = require("./route/products/route");
app.use("/products", checkToken, productRoutes);

const cartRoutes = require("./route/carts/route");

app.use("/carts", checkToken, cartRoutes);

app.use(error);

//PORT
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
