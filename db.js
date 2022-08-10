const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/cars?readPreference=primary&directConnection=true&tls=false";

const connectToMongo = ()=>{

    mongoose.connect(mongoURI,()=>{
        console.log("connected to database");
    })

}

module.exports = connectToMongo;