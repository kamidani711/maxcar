const mongoose = require('mongoose');

const { Schema } = mongoose;

const CarsSchema = new Schema({
  auction:String,
  lot:   String,
  dateOfSale:Date,
  year: Number,
  vin: String,
  condition:String,
  engine:String,
  mileage: String,
  make: String,
  model: String,
  color: String,
  drive: String,
  key:String,
  location:String,
  document:String,
  primaryDamage:String,
  secondaryDamage:String,
  retail:Number,
  repair:Number,
  cylinder:Number,
  transmission:String,
  fuel:String,
  url1:String,
  url2:String,
  url3:String,
  url4:String,
  url5:String,
  url6:String,
  url7:String,
  url8:String,
  url9:String,
  url10:String,
});

module.exports = mongoose.model("car",CarsSchema);