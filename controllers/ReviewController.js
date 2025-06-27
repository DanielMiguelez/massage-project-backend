const Review = require("../models/Review")

const ReviewController = {
    async createReview(req, res) {
        try {
            const { comment, rating } = req.body;
            const { _id, name, email } = req.user;

            const review = await Review.create({
                userId: _id,
                name,
                email,
                comment,
                rating
            });

            res.status(201).send({ msg: "Review created successfully", review });
        } catch (error) {
            res.status(500).send({ msg: "Error creating review", error });
        }
    },

    async getAllReviews(req, res) {
        try {
            const reviews = await Review.find().sort({ createdAt: -1 });
            res.status(200).send({ msg: "All reviews", reviews });
        } catch (error) {
            res.status(500).send({ msg: "Error getting reviews", error });
        }
    },

    async deleteReview(req, res) {
        try {
            const { id } = req.params;
            await Review.findByIdAndDelete(id);
            res.status(200).send({ msg: "Review deleted successfully" });
        } catch (error) {
            res.status(500).send({ msg: "Error deleting review", error });
        }
    }
}

module.exports = ReviewController;