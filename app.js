const express = require("express");
const cors = require("cors");
const app = express();
const candidatureRoute = require("./route/candidatureRoute");
const adminRoute = require("./route/adminRoute");



app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
    res.json({ message: "rendez vous à l'adresse https://ghostech-recrutement.netlify.app" });
});
app.use("/api/candidatures", candidatureRoute);
app.use("/api/admin", adminRoute);


app.listen(3000, () => console.log("Server started on port 3000"));