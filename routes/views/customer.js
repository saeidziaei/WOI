module.exports = function (req, res, next) {
	res.locals.userType = 'customer';
	next();
}