const router = require("express").Router();
const User = require("../Models/User");
const verify = require("../verifyTokens");
// UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are advised to update only your data");
  }
});
//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      res.status(200).json(deletedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are advised to delete only your data");
  }
});
//GET
router.get("/find/:id", async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    res.status(200).json(foundUser);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/", verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query ? await User.find().limit(10) : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(403).json("You are not authorized user");
    }
  }
});
router.get("/stats", async (req, res) => {
  const today = new Date();
  const latYear = today.setFullYear(today.setFullYear() - 1);
  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
