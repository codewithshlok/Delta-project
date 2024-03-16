const expres = require("express")
const router = expres.Router();
const wrapAsync = require("../utils/wrapasync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js") 
const upload = multer({ storage})



// Index Route

router.get("/", wrapAsync(listingController.index))


// new and create route

router.get("/new", isLoggedIn, listingController.renderNewform)


router.post("/", isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createNewListing))

// show route   
router.get("/:id", wrapAsync(listingController.showListing))

// edit and update route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderUpdateForm))

router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.updateListing))



// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))



module.exports = router