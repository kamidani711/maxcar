const mongoose = require('mongoose');

const { Schema } = mongoose;

const CarsSchema = new Schema({
  dateOfSale:String,
  lot:   String,
  year: Number,
  make: String,
  model: String,
  auction:String,
  color: String,
  primaryDamage:String,
  secondaryDamage:String,
  key:String,
  vin: String,
  mileage: String,
  retail:Number,
  repair:Number,
  engine:String,
  drive: String,
  transmission:String,
  fuel:String,
  cylinder:Number,
  condition:String,
  saleStatus:String,
  location:String,
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