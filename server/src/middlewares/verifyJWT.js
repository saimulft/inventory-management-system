const jwt = require("jsonwebtoken")
const verifyJWT = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const { role, id, email } = decode
            req.role = role,
            req.id = id,
            req.email = email
        next()
    } catch (error) {
        next("check login error")
    }
}

module.exports = verifyJWT;