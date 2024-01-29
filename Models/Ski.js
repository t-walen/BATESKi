const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const { connections } = require('mongoose');

const ImageSchema = new Schema ({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = {toJSON: { virtuals: true } };


const SkiSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author:
        {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);


SkiSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/skis/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,25)}...</p>`
});

SkiSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('ski', SkiSchema);
