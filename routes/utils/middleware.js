const config = require('../../config/config');

function isValid(token){
    return token == config.TOKEN_CLI;
}

module.exports = {
  validateAccess: function (req, res, next) {
    if(!req.headers.authorization || !isValid(req.headers.authorization)){
      var err = new Error('Forbidden');
      err.status = 403;
      next(err);
    }
    next();
  },

  // catch 404 and forward to error handler
	notFound: function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	},

	// error handler
	processError: function(err, req, res, next) {
	  // set locals, only providing error in development
	  res.locals.message = err.message;
	  res.locals.error = req.app.get('env') === 'development' ? err : {};

	  // render the error page
	  res.status(err.status || 500);
	  res.render('error');
	}
};