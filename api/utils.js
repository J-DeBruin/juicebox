function requireUser(req, res, next) {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
      });
    }
  
    next();
  };

//   someRouter.post('/some/route', requireUser, async (req, res, next) => {

// });
  
  // = = = = = = = = = = MODULE EXPORTS = = = = = = = = = = = = = = = = = 
  module.exports = {
    requireUser
  }