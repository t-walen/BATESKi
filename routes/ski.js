const express = require('express');
const router = express.Router();
const catchAsync = require('../Utilities/catchAsync.js');
const skis = require('../controllers/Ski.js');
const { SkiSchema } = require('../schemas.js');
const Ski = require('../Models/Ski.js');
const Review = require('../Models/review.js');
const {isLoggedIn, isAuthor, ValidateSki} = require('./middleware.js');
const multer  = require('multer')
const {storage} = require('../Cloudinary/index.js');
const upload = multer({ storage })

router.route('/')
.get(catchAsync(skis.index)).post(isLoggedIn, upload.array('image'), ValidateSki, catchAsync(skis.createNewSki));
//.post(isLoggedIn, ValidateCampground, catchAsync(campgrounds.createNewCampground));

router.get('/new', isLoggedIn, skis.renderNewForm);


router.route('/:id').get(catchAsync(skis.showSki)).put(isLoggedIn, isAuthor, upload.array('image'), ValidateSki, catchAsync(skis.updateSki)).delete( isLoggedIn, isAuthor, catchAsync(skis.deleteSki));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(skis.editSki));




module.exports = router;
