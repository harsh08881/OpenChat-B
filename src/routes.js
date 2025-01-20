const express = require("express");
const router = express.Router();
const authController = require('./controller/authController')


router.get("/", (req, res) => {
    res.send("Welcome to the Theta Network");
});



router.post('/google', authController.googleLogin);






router.get('*' , (req,res) => {
    res.send("Route Not Found");
})
router.post('*' , (req,res) => {
    res.send("Route Not Found");
})




module.exports = router;