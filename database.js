const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let con = await mongoose.connect(process.env.DATABASE_URI);
    console.log(`Database is connected on ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
};
module.exports = { connectDB };
