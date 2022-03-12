const jwt = require("jsonwebtoken");
const secretKey = require("../config/token");
module.exports = async (req, res, next) => {
  try {
    const bear = req.headers.authorization.split(" ")[1];

    const decoded = await jwt.verify(bear, secretKey.unique);
    console.log(decoded);
    const role = decoded.info;
    if (!decoded) {
      return res
        .status(400)
        .json({ message: "Your are not Authorize User", sucess: false });
    } else {
      return next();
    }
  } catch (e) {
    return res.status(404).json({ message: "Not found", success: false });
    
    
    
    
  }
};
