const express = require("express");
const cors = require("cors");
//mongoDB Connection
require("./config/db");
//Importing Routes
const users = require("./routes/api/user");

const app = express();
app.use(express.json());
app.get("/", (req, res) => res.send("hello"));

// Enable CORS and allow requests from your React frontend (localhost:3000)
app.use(
  cors({
    origin: "http://localhost:3000",  // Allow your frontend to access the backend
  })
);

// Use Routes
app.use("/api/users", users);

const port = process.env.PORT || 3008;

app.listen(port, () =>
  console.log(`server is running at http://localhost:${port}`)
);
