const loginRequired = function(req, res,next) {
    if (req.user) {
       next()
    } else {
         res.status(401).json({ message: 'Unauthorized user!!' });
    }
};
module.exports = {
    loginRequired
}