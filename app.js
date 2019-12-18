const express = require("express");
const morgan = require("morgan"); //xử lý body trong request
const bodyParser = require("body-parser"); //đọc body được gửi từ client
const cookieParser = require('cookie-parser'); // đọc cookie được gửi từ client
const cors = require('cors'); // Thư viện quản lý CORS

var admin = require("firebase-admin"); // Thư viện quản lý firebase cho server side JS
var serviceAccount = require("./huynhnhondevfirebasesdk.json"); //file key

// Chứng thực kết nối với tài khoản firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://examreg-19a52.firebaseio.com"
});

require('dotenv').config(); // quản lý các biến môi trường env

const app = express();

app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:4200', 'https://uni.tuhoc247.com'],
    credentials: true,
}))

app.use('/uploads', express.static('uploads')) //public thư mục upload

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "https://uni.tuhoc247.com");
    // res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
        return res.status(200).json({});
    }
    next();
})
// khai báo các router
const userRouters = require('./api/routers/user');
const courseRouter = require('./api/routers/courses');
const termRouter = require('./api/routers/term');
const sessionRouter = require('./api/routers/session'); 
const registerExamRouter = require('./api/routers/dkthi');

//kết nối tới các router
app.use("/api/v1/user", userRouters);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/term", termRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/dkthi", registerExamRouter);

//xử lý ngoại lệ (sai link)
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({

        message: error.message

    })
});

module.exports = app;