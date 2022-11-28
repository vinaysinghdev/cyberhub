const isLogin = async (req, res, next) => {
  try {
    if (req.session.user_id) {
        next();
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = isLogin;
