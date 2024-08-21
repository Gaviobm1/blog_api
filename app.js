const express = require("express");
const routes = require("./routes");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use("/users", routes.user);
app.use("/posts", routes.post);
app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
