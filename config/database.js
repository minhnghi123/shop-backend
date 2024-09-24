const mongoose = require("mongoose");
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("The database connected successfully !");
  } catch (error) {
    console.log(error);
    console.log("The database is errored and please try again !!!");
  }
};
module.exports = connect;
