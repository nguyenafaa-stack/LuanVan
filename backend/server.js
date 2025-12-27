const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const db = require("./src/configs/database.js");

const productRoute = require("./src/routers/productRoute.js");
const cartRoute = require("./src/routers/cartRoute.js");
const authRoute = require("./src/routers/authRoute.js");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // Địa chỉ Vite của bạn
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Project Running!");
});

// ROUTE
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
