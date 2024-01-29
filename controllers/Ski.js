const Ski = require('../Models/Ski')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken });
const { cloudinary } = require('../Cloudinary');



module.exports.index = async (req, res) => {
    const skis = await Ski.find({});
    res.render('skis/index', { skis })
}

module.exports.renderNewForm = (req, res) => {
    res.render('skis/new');
}

module.exports.createNewSki = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.ski.location,
        limit: 1
    }).send()
    const ski = new Ski(req.body.ski);
    ski.geometry = geoData.body.features[0].geometry;
    ski.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    ski.author = req.user._id;
    await ski.save();
    req.flash('success', 'Successfully made a new mountain');
    res.redirect(`/skis/${ski._id}`)
};

module.exports.showSki = async (req, res) => {
    const ski = await Ski.findById(req.params.id).populate({path:'reviews', populate: {
        path: 'author'
    }}).populate('author');
    if(!ski){
        req.flash('error', 'Cannot find that mountain!');
        return res.redirect('/skis');
    }
    res.render('skis/show', { ski });
};

module.exports.editSki = async (req, res) => {
    const {id} = req.params;
    const ski = await Ski.findById(id)
    if (!ski) {
        req.flash('error', 'Cannot find that mountain!');
        return res.redirect('/skis');
    }
    res.render('skis/edit', { ski });

};

module.exports.updateSki = async (req, res) => {
    const {id} = req.params;
    const ski = await Ski.findByIdAndUpdate(id, { ...req.body.ski });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    ski.images.push(...imgs);
    await ski.save();
    if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
        cloudinary.uploader.destroy(filename);
    }
    await ski.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})

    }
    req.flash('success', 'You have successfully updated the mountain');
    res.redirect(`/skis/${ski._id}`);
};

module.exports.deleteSki = async (req, res) =>{
    const { id } = req.params;
    const ski =  await Ski.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted mountain');
    res.redirect('/skis')
};
