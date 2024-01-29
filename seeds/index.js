

const mongoose = require('mongoose');
const Ski = require('../Models/Ski');
const cities = require('./cities');
const mountain = require('./skiResorts')
const { places, descriptors } = require('./seedhelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Ski.deleteMany({});
    for (let i = 0; i < 4; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const city = mountain[i].location.city;
        const state = mountain[i].location.state || '';
        const province = mountain[i].location.province || '';
        const country = mountain[i].location.country;

      const locationString = `${city}, ${state}, ${province} ${country}`;
        const ski = new Ski({
           // location: `${cities[random1000].city}, ${cities[random1000].state}`,
            location: locationString,
            author: '65ac294e0b2eae124806ba76',
            //title: `${sample(descriptors)} ${sample(places)}`,
            title: `${mountain[i].name}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dekyrm7c6/image/upload/v1706241184/YelpCamp/qbkbww2kb6l1wo71ibqk.jpg',
                  filename: 'YelpCamp/qbkbww2kb6l1wo71ibqk',
                },
                {
                  url: 'https://res.cloudinary.com/dekyrm7c6/image/upload/v1706241184/YelpCamp/ljoetet8d9jxyzxxswwa.jpg',
                  filename: 'YelpCamp/ljoetet8d9jxyzxxswwa',
                }
              ],
            description:`${mountain[i].description}`,
            price,
            geometry: {
              type: "Point",
              coordinates: [mountain[i].location.coordinates.longitude, mountain[i].location.coordinates.latitude]
            },


        })
        await ski.save();
    }
    }

seedDB();
