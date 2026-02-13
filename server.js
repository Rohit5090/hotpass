const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // serve static files

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/verify-payment", (req, res) => {
  const { transactionHash } = req.body;

  if (transactionHash === "demo123") {
    res.json({ success: true, access: "granted" });
  } else {
    res.json({ success: false, message: "Invalid transaction" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});