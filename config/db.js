const mongoose = require("mongoose");

const config = require("config");

const database_URI = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(database_URI, {
      useNewUrlParser: true,
    });

    console.log("MongoDB connected...");
  } catch (error) {
    console.error(error);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
