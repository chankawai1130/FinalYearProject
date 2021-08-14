module.exports = async function (req, res, proceed) {
    if (req.session.role !=undefined && req.session.role === 'student') {
      return proceed();
    }
    return res.redirect('/user/login');
  };
  