const User = require('../Models/User');


module.exports.renderRegister = (req , res) => {
    res.render('Users/register');
};

module.exports.registeruser = async(req, res, next) => {
    try {
    const { username, email, password } = req.body;
    const user = new User({email, username});
    const registereduser = await User.register(user, password);
    req.login(registereduser, err => {
        if(err) return next(err);
    req.flash('success', "Welcome");
    res.redirect('/skis');
})
} catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
}
};

module.exports.renderLogin = (re, res) => {
    res.render('Users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', "Welcome back");
    const redirectUrl = res.locals.returnTo || '/skis';
    res.redirect(redirectUrl);
     delete req.session.returnTo;}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye');
        res.redirect('/skis');
    });

};
