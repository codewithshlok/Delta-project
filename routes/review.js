const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapasync.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const { reviewSchema } = require("../schema.js")
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../Controllers/reviews.js")



// Review create route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

// Review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))



module.exports = router