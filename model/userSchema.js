const mongoose = require("../database/connection");

const schema = mongoose.Schema({
  userName: {
    type: String,
    require: true,
    minlength: [5, "minimum length erorr"],
  },

  password: {
    type: String,
    require: true,
    minlength: [5, "minimum length erorr"],
  },
  orderDetails: [
    {
      id: {
        type: String,
        require: true,
      },

      amount: {
        type: Number,
        require: true,
      },

      currency: {
        type: String,
        require: true,
      },
      receipt: {
        type: String,
        require: true,
      },
      notes: [],
    },
  ],
});

module.exports = new mongoose.model("userData", schema);
