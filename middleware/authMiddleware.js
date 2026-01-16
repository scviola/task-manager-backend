//JWT identity verification - routes protection
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const protect = (req, res, next) => {
    try {
        //Get token from header
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({message: "Not authorized, no token"});

        const token = authHeader.split(" ")[1]; //extract token(split by space)
        
        //verify token with jwt secret
        const decoded = jwt.verify(token, jwtSecret)

        //Save the decoded info in req.user
        req.user = decoded;

        next(); //move to next middleware or route handler
    
    } catch (error) {
        res.status(401).json({message: "Token invalid or expired"});       
    }
};

module.exports = { protect };