const router = require("express").Router();
const User = require("../model/userModal");
const jwt = require("jsonwebtoken")
const CryptoJS = require("crypto-js");

router.post("/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    picture: req.body.picture,
  });

  const existedUser = await User.findOne({ email: newUser.email });
  if (existedUser) {
    res.status(403).json("User already Exists");
  } else {
    try {
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json({ message: "User not found" });

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SEC_KEY
    );
    const orgPassword = JSON.parse(hashedPassword.toString(CryptoJS.enc.Utf8));
    const checkPassword = JSON.parse(
      CryptoJS.AES.decrypt(req.body.password, process.env.SEC_KEY).toString(
        CryptoJS.enc.Utf8
      )
    );
    orgPassword != checkPassword &&
      res.status(401).send({ message: "wrong password!!!!" });

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SEC,
        { expiresIn: "2d" }
      );

      const {password,...others} = user._doc
      
      res.status(200).json({...others,token});

  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
