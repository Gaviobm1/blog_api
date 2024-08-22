const express = require("express");
const routes = require("./routes");
const { errorHandler } = require("./errors");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use("/users", routes.user);
app.use("/posts", routes.post);
app.use(errorHandler);
app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
