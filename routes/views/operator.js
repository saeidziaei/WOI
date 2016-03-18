module.exports = function (req, res, next) {
	res.locals.userType = 'operator';
	next();
}