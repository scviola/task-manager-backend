//Role-based authorization
const authorize = (...allowedRoles) => {           //allowedRoles is an array of roles that are allowed
    return (req, res, next) => {
        //Check if user is logged in
        if(!req.user)
            return res.status(401).json({message: "Not authenticated"});

         // Check if user role is in the allowed roles
        if(!allowedRoles.includes(req.user.role))
            return res.status(403).json({message: "Access denied: insufficient permission"});

        next();
    }
};

module.exports = { authorize };

