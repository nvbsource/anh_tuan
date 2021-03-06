require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const publicDirectory = path.join(__dirname, "./public");
app.use("/public", express.static(publicDirectory));
app.use(cors());
app.use(express.json());

app.use(cookieParser());
// Routes
app.use("/user", require("./routes/userRoute"));
app.use("/api", require("./routes/upload"));
// app.use('/api', require('./routes/uploadIdeaRoute'))

//connect to mongodb
const URI = process.env.MONGODB_URL;
mongoose.connect(
    URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log("Connect to mongodb");
    }
);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});