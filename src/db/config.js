const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/users-db", {
}).then(() => {
  console.log("Connected to MongoDB successfully");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});
