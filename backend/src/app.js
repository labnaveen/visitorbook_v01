require("dotenv").config({ path: "./.env" });

const express = require("express");
const fs = require("fs");
const https = require("http");
const path = require("path");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5005
const HOST = process.env.HOST || "0.0.0.0";
const APPNAME = process.env.APP_NAME;

// Read HTTPS credentials
const privateKey = fs.readFileSync("src/cert/app/key.pem", "utf8");
const certificate = fs.readFileSync("src/cert/app/cert.pem", "utf8");
const paymentController = require("../src/controllers/paymentControllers");
const helmet = require("helmet");

// Use Helmet

// app.use(helmet());

// app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));

// app.use(helmet.frameguard({ action: "deny" }));

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'"],
//             connectSrc: ["'self'", "https://api.staging.visitorbuk.com", "https://staging.visitorbuk.com"],
//             styleSrc: ["'self'", "https://fonts.googleapis.com"],
//             styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
//             fontSrc: ["'self'", "https://fonts.gstatic.com"],
//             scriptSrc: ["'self'"],
//             imgSrc: ["'self'", "data:", "blob:", "https://staging.visitorbuk.com", "https://api.staging.visitorbuk.com"],
//             objectSrc: ["'none'"],
//         },
//     })
// );

app.use(helmet.referrerPolicy({ policy: "no-referrer" }));

// Permissions Policy manually

app.use((req, res, next) => {
    res.setHeader(
        "Permissions-Policy",

        "geolocation=(self), microphone=(), camera=()"
    );

    next();
});

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'"],
//             connectSrc: ["'self'", "https://api.staging.visitorbuk.com"],
//             styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//             styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
//             fontSrc: ["'self'", "https://fonts.gstatic.com"],
//             scriptSrc: ["'self'", "'unsafe-inline'"],
//             imgSrc: ["'self'", "data:", "blob:"],
//             objectSrc: ["'none'"],
//         },
//     })
// );

app.post("/razorpay-webhook", express.raw({ type: "application/json" }), paymentController.razorPayWebhook);

const credentials = { key: privateKey, cert: certificate };

const cors = require("cors");
app.use(express.static("public/data"));

const morgan = require("morgan");

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
var config = require("config");
require("./config/db.config");
app.use(morgan("dev"));

// Serve static assets
app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));
app.use(express.static(__dirname));

// DB and routing setup
require("./config/db.config");
const routes = require("./routes/indexRoute");
routes.httpRoutes().forEach((item) => {
    app.use(`/api/${APPNAME}` + item.path, item.route);
});

// Serve index.html manually with CSP header applied
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start HTTPS server
https.createServer(credentials, app).listen(PORT, () => {
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});

module.exports = app;
