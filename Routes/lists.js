const router = require("express").Router();
const List = require("../Models/List");
const verify = require("../verifyTokens");

//CREATE

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const deletedList = await List.findByIdAndDelete(req.params.id);
      res.status(201).json(deletedList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});
router.get("/find/:id", verify, async (req, res) => {
  try {
    const getList = await List.findById(req.params.id);
    res.status(201).json(getList);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET
router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let foundList = [];
  if (req.user.isAdmin) {
    try {
      if (typeQuery) {
        if (genreQuery) {
          foundList = await List.aggregate([
            { $match: { type: typeQuery, genre: genreQuery } },
            { $sample: { size: 10 } },
          ]);
        } else {
          foundList = await List.aggregate([
            { $match: { type: typeQuery } },
            { $sample: { size: 10 } },
          ]);
        }
      } else {
        foundList = await List.aggregate([
          {
            $sample: { size: 10 },
          },
        ]);
      }

      res.status(201).json(foundList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

module.exports = router;
