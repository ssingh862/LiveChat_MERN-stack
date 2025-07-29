const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return console.log("Mongodb is not define in env");
  }
  try {
    await mongoose.connect(uri);
    console.log("Mongodb Connect successfull");
  } catch (error) {
    console.log("Something wrong please check! ", error);
    process.exit();
  }
};

module.exports = connectDB;
