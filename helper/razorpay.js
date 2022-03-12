var Razorpay = require("razorpay");
var bodyParser = require("body-parser");

let instance = new Razorpay({
  key_id: "rzp_test_DwcpHHoAbyHrdn", // your `KEY_ID`
  key_secret: "tFjHJQW3QC4WFX7DhfeNnlY3", // your `KEY_SECRET`
});

module.exports = instance;
