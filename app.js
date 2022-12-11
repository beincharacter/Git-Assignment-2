const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const postRoute = require("./routes/posts")
const jwt = require("jsonwebtoken");
const secret = "RESTAUTHAPI";

const app = express();
app.use(bodyParser.json());

app.use("/posts", (req, res, next) => {
    if(req.headers.authorization) {
        const token = req.headers.authorization;
        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    return res.status(403).json({
                        status: "Failed",
                        message: "Not valid token"
                    })
                }

                req.user =  decoded.data
                next();
            })
        } else {
            return res.status(401).json({
                status: "Failed",
                message: "Token is missing"
            })
        }
    }
    else {
        return res.status(403).json({
            status: "Failed",
            message: "Not authenticated user"
        })
}
    
})

app.use("/user", userRoute)
app.use("/user", postRoute)


app.get("*", (req, res) => {
    res.json({
        status: "Failed"
    })
})

app.listen(5000, () => console.log("Server Started"))