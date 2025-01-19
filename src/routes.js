const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.send("Welcome to the Theta Network");
});








router.get('*' , (req,res) => {
    res.send("Route Not Found");
})
router.post('*' , (req,res) => {
    res.send("Route Not Found");
})




module.exports = router;