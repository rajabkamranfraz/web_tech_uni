const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // CSS, JS, images
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout"); // layout.ejs as main template

// --- Page Routes ---
app.get("/", (req, res) => {
  res.render("index", { title: "BeKravMaga" });
});

// --- 404 Route ---
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
