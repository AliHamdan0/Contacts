const mongoose = require('mongoose');
const DATABASE = process.env.DATABASE;

const connect = async () => {
  try {
    const connection = await mongoose.connect(DATABASE);
    console.log(
      'Database connected: ',
      connection.connection.host,
      connection.connection.name
    );
  } catch (e) {
    console.log("Can't connect ot database", e);
    process.exit(1);
  }
};

module.exports = connect;
