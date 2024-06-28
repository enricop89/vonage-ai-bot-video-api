require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./routes");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Set up EJS as templating engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files (like CSS, JS) from a 'public' directory
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
