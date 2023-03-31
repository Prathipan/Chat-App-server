const router = require("express").Router();
const User = require("../model/userModal");
const { verifyToken } = require("./verifyToken");

router.get("/all-users",verifyToken,async(req,res) => {
    const keyword = req.query.search ? {
        $or:[
            { name : { $regex: req.query.search, $options: "i"} },
            { email : { $regex: req.query.search, $options: "i"}},
        ]
    } : {}

    const users = await User.find(keyword).find({_id : {$ne : req.user._id}});
    res.send(users);
})


module.exports = router;