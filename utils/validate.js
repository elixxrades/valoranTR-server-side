const jwt = require("jsonwebtoken");


module.exports.isLoggedIn = (req, res, next) => {
    try {
        const input = req.headers.authorization.split(' ');

        if (!input[0] === "Bearer") return res.status(401).send({
            msg: 'Your session is not valid!'
        });

        const decoded = jwt.verify(
            input[1],
            process.env.SECRET_KEY
        );
        req.userData = decoded;
        next();
    } catch (err) {
        return res.status(401).send({
            msg: 'Your session is not valid!'
        });
    }
}
