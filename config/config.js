const mongoose = require("mongoose")
require("dotenv").config()

const dbConnection = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database successfully connected");
    } catch (error) {
        console.error(error);
        throw new Error("not possible to conect yet...");
    }
}

module.exports ={
    dbConnection
}