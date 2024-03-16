const expres = require("express")
const router = expres.Router();
const wrapAsync = require("../utils/wrapasync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// index route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("./listings/index.ejs", { allListings })
}

// New and create route
module.exports.renderNewform = (req, res) => {
    res.render("./listings/new.ejs")
}

module.exports.createNewListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();


    let url = req.file.path
    let filename = req.file.filename

    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = { url, filename }
    newListing.geometry = response.body.features[0].geometry

    let savedlisting = await newListing.save();
    console.log(savedlisting);


    req.flash("success", "New Listing Created.")
    res.redirect("/listings")
}



// Show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate("owner")
    if (!listing) {
        req.flash("error", "Listing does not exist. Please try again.")
        return res.redirect("/listings")

    }
    res.render("./listings/show.ejs", { listing })

}


// edit and Update route


module.exports.renderUpdateForm = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Listing does not exist. Please try again.")
        return res.redirect("/listings")

    }
    res.render("./listings/edit.ejs", { listing })
}

// module.exports.updateListing = async (req, res) => {
//     try{
//         const listing = await Listing.findByIdAndUpdate(req.params.id , req.body,{
//             new :true,
//             runValidators : true
//         })

//         if(!listing){
//             return res.status(404).json({errors : ["Listing not found."]});
//         }


//         if(typeof req.file !== "undefined"){
//             let url = req.file.path
//             let filename = req.file.filename
//             listing.image = {url, filename}
//             await listing.save()
//         }
//         req.flash("success", "Listing Updated.")
//         res.redirect(`/listings/${id}`)
//     }
//     catch(err){
//         res.send(err)
//     }


module.exports.updateListing = async (req, res) => {
    let { id } = req.params
    console.log(req.body)
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

    if (typeof req.file !== "undefined") {
        let url = req.file.path
        let filename = req.file.filename
        listing.image = { url, filename }
        await listing.save()
    }
    req.flash("success", "Listing Updated.")
    res.redirect(`/listings/${id}`)
}



// Delete Route

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash("success", "Listing Deleted.")
    res.redirect("/listings")
}