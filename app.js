
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

require('dotenv').config();




const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./Utilities/catchAsync');
const Joi = require('joi');
const {skiSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./Utilities/expresserror');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Ski = require('./Models/Ski');
const Review = require('./Models/review');
const User = require('./Models/User');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const UserRoute = require('./routes/users')
const skis = require('./routes/ski');
const reviews = require('./routes/reviews')
const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL;
//const dbUrl = 'mongodb://localhost:27017/yelp-camp';

//'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:") );
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'))

app.use(express.urlencoded({ extended:true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}));
const store = MongoStore.create({
 mongoUrl: dbUrl,
 touchAfter: 24 * 60 * 60,
 crypto: {
    secret: 'thisshouldbeasecret'
 }
});

store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(helmet());
app.use(flash());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://code.jquery.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://maxcdn.bootstrapcdn.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            scriptSrcElem: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            styleSrcElem: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dekyrm7c6/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);





app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/skis', skis);
app.use('/skis/:id/reviews', reviews)
app.use('/', UserRoute);


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/test-error', (req, res, next) => {
    next(new ExpressError('Test Error', 500));
});
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
