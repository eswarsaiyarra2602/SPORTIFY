const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req, res, next) {
    const userUid = req.cookies.uid;
    if (!userUid) return res.redirect("/login");
    
    try {
        const user = await getUser(userUid);
        if (!user) return res.redirect("/login");
        
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.redirect("/login");
    }
}

module.exports = {
    restrictToLoggedInUserOnly
};
