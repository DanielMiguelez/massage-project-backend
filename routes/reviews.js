const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/ReviewController");
const { authentication } = require("../middlewares/authentication");

router.post("/createReview", authentication, ReviewController.createReview);
router.get("/getAllReviews", ReviewController.getAllReviews);
router.delete("/deleteReview/:id", authentication, ReviewController.deleteReview);

module.exports = router;