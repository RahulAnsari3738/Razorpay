const userData = require("../model/userSchema");
const razorpayInstance = require("../helper/razorpay");

const crypto = require("crypto");
const webToken = require("../middleware/genjwt");
class userController {
  register = async (req, res) => {
    try {
      const { userName, password } = req.body;
      console.log(req.body);
      if (!userName || !password) {
        return res
          .status(206)
          .json({ message: "please fill the field", success: false });
      }
      const userexits = await userData.findOne({ userName: userName });

      if (userexits) {
        return res
          .status(409)
          .json({ message: "User Already Exist", success: false });
      } else {
        const adding = new userData({
          userName: userName,
          password: password,
        });
        const result = await adding.save();
        return res.status(200).json({
          message: "user successfully register",
          success: true,
       
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e.message, success: false });
    }
  };

  login = async (req, res) => {
    try {
      const { userName, password } = req.body;

      if (!userName || !password) {
        return res
          .status(206)
          .json({ message: "please fill the field", success: false });
      }
      const usercheck = await userData.findOne({ userName });
      if (!usercheck) {
        return res
          .status(404)
          .json({ message: "user not found", success: false });
      }
      if (usercheck.password != password) {
        return res
          .status(206)
          .json({ message: "invalid detail", success: false });
      } else {
        const token = webToken(usercheck);
        return res
          .status(200)
          .json({ message: "login successfully", success: true, token });
      }
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json(e, { message: "server error", success: false });
    }
  };

  createOrder = async (req, res) => {
    try {
      const { userName, amount, currency, receipt, notes } = req.body;
      const userinfo = await userData.findOne({ userName });
   

      if (!userinfo) {
        return res
          .status(404)
          .json({ message: "user not found", success: false });
      }

      if (!amount || !currency || !receipt || !notes) {
        return res
          .status(206)
          .json({ message: "please fill the field", success: false });
      } else {
        razorpayInstance.orders.create(
          { amount, currency, receipt, notes },
          async (err, order) => {
            if (!err) {
              const id = userinfo._id;
              const adding = await userData.findByIdAndUpdate(
                { _id: id },
                {
                  $set: {
                    orderDetails: [
                      {
                        id: order.id,
                        amount: amount,
                        currency: currency,
                        receipt: receipt,
                        notes: notes,
                      },
                    ],
                  },
                },
                { new: true }
              );
              // console.log(adding);

              return res
                .status(200)
                .json({ message: "order place successfully", success: true });
            }
          }
        );
      }
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json(e, { message: "server error", success: false });
    }
  };

  verifyOrder = async (req, res) => {
    try {
      const { order_id, payment_id } = req.body;
      const razorpay_signature = req.headers["x-razorpay-signature"];

      console.log(razorpay_signature);

      // Pass yours key_secret here
      const key_secret = "fNfzdOuSKwLmCFEvJUMfyDQS";

      // STEP 8: Verification & Send Response to User

      // Creating hmac object
      let hmac = crypto.createHmac("sha256", key_secret);

      // Passing the data to be hashed
      hmac.update(order_id + "|" + payment_id);

      // Creating the hmac in the required format
      const generated_signature = hmac.digest("hex");
      console.log(generated_signature);

      if (razorpay_signature === generated_signature) {
        res
          .staus(200)
          .json({ success: true, message: "Payment has been verified" });
      } else
        res
          .staus(400)
          .json({ success: false, message: "Payment verification failed" });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json(e, { message: "server error", success: false });
    }
  };
}

module.exports = new userController();
