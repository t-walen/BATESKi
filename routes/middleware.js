
const { skiSchema } = require('../schemas.js');
const ExpressError = require('../Utilities/expresserror');
const Ski = require('../Models/Ski')
const { reviewSchema } = require('../schemas.js');
const Review = require('../Models/review')


module.exports.isLoggedIn = (req, res, next) => {
 if(!req.isAuthenticated()){
    req.session.returnTo = req.originalURL
    req.flash('error',  'You must be signed in');
    return res.redirect('/login');
}
next();
}


module.exports.ValidateSki = (req, res, next) => {
    const { error } = skiSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const ski = await Ski.findById(id);
    if(!ski.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
       return res.redirect(`/skis/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
       return res.redirect(`/ski/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
