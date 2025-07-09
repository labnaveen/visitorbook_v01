const fs = require("fs");
const errorsHelper = require("../helpers/ErrorHelper");
module.exports.validate = (schema, property) => {
    return async (req, res, next) => {
        console.log(">>>>>>>>>>validation", req.body);
        const { error } = schema.validate(req[property]);
        console.log(error);
        if (error === undefined) {
            next();
        } else {
            // console.log("errorerrorerror", error)
            const message = error.details.map((i) => i.message).join(",");
            res.status(errorsHelper.bedRequest).json(await errorsHelper.BedRequest(message.replace(/[\\"]/g, ""), "Validation Error!"));
        }
    };
    // console.log(schema);
    // console.log(property);
};

module.exports.isSessionValid = (req, res, next) => {
    let sessionId = req.session.userid;
    fs.appendFile("./log/sessionerror.txt", "sessionId: " + sessionId, function (err) {
        if (err) throw err;
        console.log("File written successfully!");
    });
    if (sessionId == undefined || sessionId == "undefined") {
        return res.status(401).json({ success: false, message: "Session expired or invalid" });
    }
    next();
};
