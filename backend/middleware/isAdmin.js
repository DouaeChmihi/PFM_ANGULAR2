const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      console.log('admin user:', req.user, req.user.role); // Log user info
      next(); // Proceed if user is admin
    } else {
      res.sendStatus(403); // If user is not admin, send Forbidden
    }
  };
  
  module.exports = isAdmin;
  