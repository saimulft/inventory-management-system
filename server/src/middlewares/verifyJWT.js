const jwt = require("jsonwebtoken")
const verifyJWT = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1]
        if (token === 'undefined') {
            return res.send({status: 'failed' , message: "Unauthorized access" })
        }
        else {
            jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {

                if (err) {
                    return res.status(403).send({ error: true, message: "forbidden access" });
                }
                const { role, id, email } = decode
                req.role = role,
                    req.id = id,
                    req.email = email
                next()
            })

        }
    } catch (error) {
        next(error)
    }
}

module.exports = verifyJWT;