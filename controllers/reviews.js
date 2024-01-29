const Ski = require('../Models/Ski')
const Review = require('../Models/review');
const catchAsync = require('../Utilities/catchAsync');
const {isLoggedIn, isAuthor, ValidateSki} = require('../routes/middleware');

module.exports.createReview = async (req, res) => {
    const ski = await Ski.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    ski.reviews.push(review);
    await review.save();
    await ski.save();
    req.flash('success', 'Created new review');
    res.redirect(`/skis/${ski._id}`)
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params
    await Ski.findByIdAndUpdate(id, {$pull: {reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');

    res.redirect(`/skis/${id}`)
}
