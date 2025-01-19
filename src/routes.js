const express = require("express");
const router = express.Router();
const authController = require('./controller/authController')


router.get("/", (req, res) => {
    res.send("Welcome to the Theta Network");
});


router.get('/auth/google', authController.googleAuthController);
router.get('/auth/google/callback',authController.googleCallbackController)







router.get('*' , (req,res) => {
    res.send("Route Not Found");
})
router.post('*' , (req,res) => {
    res.send("Route Not Found");
})




module.exports = router;