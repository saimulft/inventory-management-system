const jwt = require("jsonwebtoken")
const verifyJWT = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1]
        if (token === 'undefined') {
            return res.json({ message: "Unauthorized access" })
        }
        else {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            const { role, id, email } = decode
            req.role = role,
                req.id = id,
                req.email = email
            next()
        }
    } catch (error) {
        next(error)
    }
}

module.exports = verifyJWT;