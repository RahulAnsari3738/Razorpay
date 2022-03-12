var express = require("express");
var router = express.Router();
const userController = require("../controller/user.Controller");
const verfiyToken = require("../middleware/verifyjwt");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", userController.register);
router.post("/login", userController.login);

router.post("/order", verfiyToken, userController.createOrder);
router.post("/verfiy", verfiyToken, userController.verifyOrder);

module.exports = router;
