const User = require("../models/User")
const jwt = require("jsonwebtoken")

const authentication = async(req, res, next) =>{
    try{
        const authorizationHeader = req.headers.authorization;

        if(!authorizationHeader){
            return res.status(401).send({ msg: "No token provided" });
        }

        const token = authorizationHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send({ msg: "Token malformed" });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.userId);

        if (!user) {
            return res.status(401).send({ msg: "You have no permission" });
        }

        req.user = user;
        next();

    }catch(error){
        console.error(error);
        return res.status(500).send({ error, message: 'There was a problem with the token' });
    }
}

const isAdmin = async (req, res, next) => {

    const admins = ['admin', 'superadmin'];

    if (!admins.includes(req.user.role)) {
        return res.status(403).send({
            message: `${req.user.name} you are not an admin.`
        });
    }
    next();
}



module.exports = { authentication, isAdmin}