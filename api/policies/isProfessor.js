module.exports = async function (req, res, proceed) {
    if (req.session.role !=undefined && req.session.role === 'professor') {
      return proceed();
    }
    return res.redirect('/user/login');
  };
  