const connectToMongo = require('./db');
const express = require('express');
const app = express();
const Cars = require('./models/Cars');
const csrf = require('csurf')
const toobusy = require('toobusy-js');
const cookieParser = require('cookie-parser')
const hpp = require('hpp');


const csrfProtection = csrf({ cookie: { httpOnly: true, maxAge: 600000 } });

app.use('/static', express.static('static'));

app.use(function (req, res, next) {
if(req.method != 'GET' || req.rawHeaders.includes('content-type') ){
  res.status(400).send("Bad request")
}else{
  next()
}
})

app.use(cookieParser())
app.use(hpp());
app.disable('x-powered-by')
app.use(function(req, res, next){
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('X-Frame-Options', 'deny');
  res.header('X-Content-Type-Options', 'nosniff');
  next();
});
app.use(function (req, res, next) {
  if (toobusy()) {
    res.send(503, "Server Too Busy");
  } else {
    next();
  }
});
connectToMongo();
const port = 80;
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
app.get('/', csrfProtection, async (req, res) => {
  try {
    var slides = ""
    var slide = ""
    const data = await Cars.find().sort({ $natural: 1 }).limit(10);
    for (let index = 0; index <= 9; index++) {

      slide = `<div class="swiper-slide box">
      <img src="${data[index].url1}" alt="${data[index].make + " " + data[index].model + " " + data[index].color + " " + data[index].year + " " + data[index].vin}"/>
      <div class="content"><h3>${data[index].model}</h3><div class="price"> <span>Vin : </span> ${data[index].vin} </div>
      <p><span class="fas fa-circle">
      </span> ${data[index].year} <span class="fas fa-circle">
      </span> ${data[index].color} <span class="fas fa-circle">
      </span> ${data[index].transmission} <span class="fas fa-circle">
      </span> ${data[index].fuel} <span class="fas fa-circle">
      </span> $${data[index].retail}/-</p><a href="/${data[index].make.replace(/ /g, '-').toLowerCase()}/${data[index].model.replace(/ /g, '-').toLowerCase()}/${data[index].year}-${data[index].model.replace(/ /g, '-').toLowerCase()}-${data[index].color.toLowerCase()}-${data[index].vin.toLowerCase()}" class="btn">check Details</a></div></div>`;

      slides += slide;

    }
    res.set('Content-Type', 'text/html');
    res.status(200).send(`<!DOCTYPE html><html lang="en">
    <head><title>Free sales history of cars sold at COPART and IAAI insurance auctions in USA along with prices, damage description and pictures</title>
    <meta charset="UTF-8">
    <meta name="description" content="The site carhistory.com offers free statistics about the prices of beaten cars after insurance claims in the USA.">
    <meta name="keywords" content="">
    <meta content="Free sales history of cars sold at COPART and IAAI insurance auctions in USA along with prices, damage description and pictures." data-page-subject="true" name="twitter:title" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@CarHistory">
    <meta name="twitter:title" content="Free sales history of cars sold at COPART and IAAI insurance auctions in USA along with prices, damage description and pictures">
    <meta name="twitter:description" content="The site carhistory.com offers free statistics about the prices of beaten cars after insurance claims in the USA.">
<meta name="twitter:image" content="https://www.carhistory.com/static/image/home-img.png">
<meta property="og:title" content="Free sales history of cars sold at COPART and IAAI insurance auctions in USA along with prices, damage description and pictures">
<meta property="og:site_name" content="Car HISTORY">
<meta property="og:url" content="https://www.carhistory.com/">
<meta property="og:description" content="The site carhistory.com offers free statistics about the prices of beaten cars after insurance claims in the USA.">
<meta property="og:type" content="">
<meta property="og:image" content="https://www.carhistory.com/static/image/home-img.png">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="shortcut icon"  type="image/png" href="/static/image/favicon.png">
<link rel="stylesheet" href="https://unpkg.com/swiper@7/swiper-bundle.min.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
<link rel="canonical" href="https://www.carhistory.com/"/>
<link rel="stylesheet" href="/static/style.css" type="text/css"></head>
<body>
<header class="header"><div id="menu-btn" class="fas fa-bars"></div><a href="/" class="logo"><span>Car</span>History </a><nav class="navbar"><a href="/">home</a><a href="#footer">contact</a></nav></header>
<section class="newsletter">
<form id="carsearch" action="/search">
<input type="hidden" name="do" value="search">
<input id="formInput" type="text" placeholder="Vin or Lot Number" name="query">
<input type="hidden" name="token" value="${makeid(250)}">
    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    <input type="submit" value="Search"></form></section>
    <section class="home" id="home">
    <h3 data-speed="-2" class="home-parallax">find your car</h3>
    <img data-speed="5" class="home-parallax" src="/static/image/home-img.png" alt=""></img></section>
    <section class="vehicles" id="vehicles">
    <h1 class="heading"> popular <span>vehicles</span> </h1>
    <div class="swiper vehicles-slider"><div class="swiper-wrapper">${slides}</div><div class="swiper-pagination"></div></div></section>
    <section class="footer" id="footer">
    <div class="credit"> carhistory.com | all rights reserved | Telegram:<a href="https://t.me/carhistory_com">@CarHistory</a></div></section>
    <script src="https://unpkg.com/swiper@7/swiper-bundle.min.js"></script><script  src="/static/script.js"></script>
    </body></html>`)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

app.get('/:make/:model/:vin', csrfProtection, async (req, res) => {

  try {
    var { make, model, vin } = req.params;
    make=make.toUpperCase();
    model=model.toUpperCase();
    vin=vin.toUpperCase();
    if(vin.includes('-')){
      vin = vin.split('-').pop();
    }
    if(make.includes('-')){
      make = make.split('-').join(" ");
    }
    if(model.includes('-')){
      model = model.split('-').join(" ");
    }
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (vin.length !== 17 || specialChars.test(vin) || specialChars.test(make) || specialChars.test(model)) {
      return res.status(400).send("Bad request")
    }
    var data = await Cars.findOne({vin:vin,make:make,model:model});
    make = data.make;
    model = data.model;
    make = make.split(' ').join("-").toLowerCase();
    model = model.split(' ').join("-").toLowerCase();
    var title = `<title>${data.make} ${data.model} Long Range/Performance ${data.year}  ${data.color}  vin: ${data.vin} free car history</title>
    <meta name="description" content="Automobile ${data.model} Long Range/Performance ${data.year} ${data.color} vin: ${data.vin} was sold at auction ${data.auction} {data['Sale Date']} lot number id ${data.lot} with damage ${data.primaryDamage} at a price of $${data.retail}."/>
    <meta name="keywords" content="car, ${data.make}, automobile, insurance, auction, ${data.auction}, price, free, info, vin, ${data.vin}, usa, america, damage, photo"/>
    <meta content="${data.make} ${data.model} Long Range/Performance ${data.year} ${data.color} vin: ${data.vin} free car history" data-page-subject="true" name="twitter:title" />
    <meta content="Automobile ${data.make} ${data.model} Long Range/Performance ${data.year} ${data.color}  vin: ${data.vin} was sold at auction ${data.auction} {data['Sale Date']} lot number id ${data.lot} with damage ${data.primaryDamage} at a price of $${data.retail}." data-page-subject="true" name="twitter:description"/>
    <meta content="@CarHistory" data-page-subject="true" name="twitter:site" />
    <meta content="CarHistory" data-page-subject="true" name="twitter:via" />
    <meta content="https://carhistory.com/${make}/${model}/${data.year}-${model}-${data.color.toLowerCase()}-${data.vin.toLowerCase()}" data-page-subject="true" name="twitter:url" />
    <meta content="@CarHistory" data-page-subject="true" name="twitter:creator" />
    <meta content="photo" data-page-subject="true" name="twitter:card" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${data.make} ${data.model} Long Range/Performance ${data.year}  ${data.color}  vin: ${data.vin} free car history">
    <meta property="og:site_name" content="${data.make} ${data.model} History">
    <meta property="og:url" content="https://carhistory.com/${make}/${model}/${data.year}-${model}-${data.color.toLowerCase()}-${data.vin.toLowerCase()}">
    <meta property="og:description" content="Automobile ${data.make} ${data.model} Long Range/Performance ${data.year}  ${data.color}  vin: ${data.vin} was sold at auction ${data.auction} {data['Sale Date']} lot number id ${data.lot} with damage ${data.primaryDamage} at a price of $${data.retail}.">
    <meta property="og:type" content="">
    <meta property="og:image" content="${data.url1}">
    <link rel="canonical" href="https://carhistory.com/${make}/${model}/${data.year}-${model}-${data.color.toLowerCase()}-${data.vin.toLowerCase()}">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Vehicle",
        "url": "https://carhistory.com/${make}/${model}/${data.year}-${model}-${data.color.toLowerCase()}-${data.vin.toLowerCase()}",
        "name": "${data.year} ${data.make} ${data.model} | ${data.vin} | Carhistory",
        "description": "${data.year} ${data.make} ${data.model}, Standard Range Plus ✔️ VIN: ${data.vin} Lot: ${data.lot}, Sale date: 2022-08-31 ➡️ Location: Jacksonville (FL), USA | Odometer: 17 348 mi",
        "manufacturer": "${data.make}",
        "model": "${data.model}",
        "vehicleIdentificationNumber": "${data.vin}",
        "sku": "${data.vin}",
        "mpn": "${data.vin}",
        "vehicleModelDate": "${data.year}",
        "vehicleTransmission": "${data.transmission}",
        "knownVehicleDamages": "${data.primaryDamage}",
        "brand": {
            "@type": "Brand",
            "name": "${data.make}"
        },
        "image": "${data.url1}"
    }
    </script>`;

    var slider = `<div class="swiper-slide box"><img width="100%" src="${data.url1}" alt="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}" title="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}"/></div>
    <div class="swiper-slide box"><img width="100%" src="${data.url2}" alt="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}" title="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}"/></div>
    <div class="swiper-slide box"><img width="100%" src="${data.url3}" alt="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}" title="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}"/></div>
    <div class="swiper-slide box"><img width="100%" src="${data.url4}" alt="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}" title="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}"/></div>
    <div class="swiper-slide box"><img width="100%" src="${data.url5}" alt="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}" title="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}"/></div>
    <div class="swiper-slide box"><img width="100%" src="${data.url6}" alt="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}" title="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}"/></div>
    <div class="swiper-slide box"><img width="100%" src="${data.url7}" alt="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}" title="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}"/></div>
    <div class="swiper-slide box"><img width="100%" src="${data.url8}" alt="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}" title="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}"/></div>
    <div class="swiper-slide box"><img width="100%" src="${data.url9}" alt="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}" title="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}"/></div>
    <div class="swiper-slide box"><img width="100%" src="${data.url10}" alt="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}" title="${data.make + " " + data.model + " " + data.color + " " + data.year + " " + data.vin}"/></div>`;

    res.set('Content-Type', 'text/html');
    res.status(200).send(`<!DOCTYPE html><html lang="en">
    <head>
    <meta charset="utf-8" />${title}<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/>
    <link rel="shortcut icon"  type="image/png" href="/static/image/favicon.png">
    <link rel="stylesheet"href="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="/static/car.css"  type="text/css"/></head>
    <body>
    <header class="header"><div id="menu-btn" class="fas fa-bars"></div><a href="/" class="logo"> <span>Car</span>History </a><nav class="navbar"><a href="/">home</a><a href="#footer">contact</a></nav></header>
    <section class="newsletter">
    <form id="carsearch" action="/search">
    <input type="hidden" name="do" value="search"/>
    <input id="formInput" type="text" placeholder="Vin or Lot Number" name="query"/>
    <input type="hidden" name="token" value="${makeid(250)}"/>
    <input type="hidden" name="_csrf" value="${req.csrfToken()}"/>
    <input type="submit" value="Search"/></form></section>
    <section class="mainContainer">
    <div class="carImagesMainSlider">
    <h3>${data.make} ${data.model}</h3>
    <div style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff;" class="swiper carImagesSlider">
    <div class="swiper-wrapper">${slider}</div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div></div>
    <div class="swiper carImagesSliderThumbs">
    <div class="swiper-wrapper">${slider}</div></div></div>
    <div class="carDetails">
    <h3 class="textColorWhite">${data.year + " " + data.make + " " + data.model + " " + data.color}</h3>
    <p class="textColorGray"> Auction : <span class="textColorWhite">${data.auction}</span></p>
    <p class="textColorGray"> Lot No : <span class="textColorWhite">${data.lot}</span></p>
    <p class="textColorGray"> Vin No : <span class="textColorWhite">${data.vin}</span></p>
    <p class="textColorGray"> Year : <span class="textColorWhite">${data.year}</span></p>
    <p class="textColorGray"> Body Color : <span class="textColorWhite">${data.color}</span></p>
    <p class="textColorGray"> Condition : <span class="textColorWhite">${data.condition}</span></p>
    <p class="textColorGray"> Engine : <span class="textColorWhite">${data.engine}</span></p>
    <p class="textColorGray"> Key : <span class="textColorWhite">${data.key}</span></p>
    <p class="textColorGray"> Mileage : <span class="textColorWhite">${data.mileage}</span></p>
    <p class="textColorGray"> Repair cost : <span class="textColorWhite">$${data.repair}</span></p>
    <p class="textColorGray"> Value : <span class="textColorWhite">$${data.retail}</span></p>
    <p class="textColorGray"> Fuel Type : <span class="textColorWhite">${data.fuel}</span></p>
    <p class="textColorGray"> Location city : <span class="textColorWhite">${data.location}</span></p>
    <p class="textColorGray"> Damage Description : <span class="textColorWhite">${data.primaryDamage}</span></p>
    <p class="textColorGray"> Secondary Damage : <span class="textColorWhite">${data.secondaryDamage}</span></p>
    <p class="textColorGray"> Cylinders : <span class="textColorWhite">${data.cylinder}</span></p>
    <p class="textColorGray"> Drive : <span class="textColorWhite">${data.drive}</span></p>
    <p class="textColorGray"> Sale Status : <span class="textColorWhite">${data.document}</span></p>
    <p class="textColorGray"> Transmission : <span class="textColorWhite">${data.transmission}</span></p></div></section>
    <section class="footer" id="footer"><div class="credit"> carhistory.com | all rights reserved | Telegram:<a href="https://t.me/carhistory_com">@CarHistory</a></div></section>
    <script src="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js"></script><script src="/static/swiper.js"></script><script src="/static/script.js"></script>
  </body></html>`);
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

app.get('/search', csrfProtection, async (req, res) => {
  try {
    if(req.cookies._csrf){
    var notFound = "<h1 style='text-align: center; font-size:5rem;'>Not Found</h1>";
    var query = req.query.query;
    var card = '';
    var cards = '';
    var status = 200;
    var data = [];
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!(req.query.hasOwnProperty('do')) || !(req.query.hasOwnProperty('token')) || !(req.query.hasOwnProperty('query')) || !(req.query.hasOwnProperty('_csrf'))){
      status=404;
      cards = notFound
    }
    else if (Array.isArray(query)) {
      cards = notFound;
      status = 404;
    }
    else if (specialChars.test(query)) {
      cards = notFound;
      status = 401;
    }
    else if (query.length === 17) {
      data = await Cars.find({vin: query.toUpperCase()});
      if (data.length!==0) {
        for (let index = 0; index < data.length; index++) {
          card = `<div class="carCard">
          <a href="/${data[index].make.replace(/ /g, '-').toLowerCase()}/${data[index].model.replace(/ /g, '-').toLowerCase()}/${data[index].year}-${data[index].model.replace(/ /g, '-').toLowerCase()}-${data[index].color.toLowerCase()}-${data[index].vin.toLowerCase()}"><img width="320px" height="240px" src="${data[index].url1}" alt="${data[index].make + " " + data[index].model + " " + data[index].color + " " + data[index].year + " " + data[index].vin}"/></a>
          <div class="carDetails">
          <span>${data[index].make} ${data[index].model}</span>
          <span>VIN: ${data[index].vin}</span>
          <div class="carInfoContainer">
          <div class="carInfomartion">
          <p>Year <span>  ${data[index].year}</span></p>
          <p>Color <span> ${data[index].color}</span></p>
          <p>Auction<span>${data[index].auction}</span></p></div></div></div></div>`;
          cards += card; 
        }
          status = 200;
        } 
        else {
          status = 404;
          cards = notFound;
        }
    }
    else if (query.length === 8) {
      data = await Cars.find({lot: query});
      if (data.length!==0) {
      for (let index = 0; index < data.length; index++) {
          card = `<div class="carCard">
          <a href="/${data[index].make.replace(/ /g, '-').toLowerCase()}/${data[index].model.replace(/ /g, '-').toLowerCase()}/${data[index].year}-${data[index].model.replace(/ /g, '-').toLowerCase()}-${data[index].color.toLowerCase()}-${data[index].vin.toLowerCase()}"><img width="320px" height="240px" src="${data[index].url1}" alt="${data[index].make + " " + data[index].model + " " + data[index].color + " " + data[index].year + " " + data[index].vin}"/></a>
          <div class="carDetails">
          <span>${data[index].make} ${data[index].model}</span>
          <span>VIN: ${data[index].vin}</span>
          <div class="carInfoContainer">
          <div class="carInfomartion">
          <p>Year <span>  ${data[index].year}</span></p>
          <p>Color <span> ${data[index].color}</span></p>
          <p>Auction<span>${data[index].auction}</span></p></div></div></div></div>`;
          cards += card;
      }
      status = 200;}
      else {
        status = 404;
        cards = notFound;
      }
    }
    else {
      cards = notFound;
      status = 404;
    }
    res.status(status).send(`<!DOCTYPE html><html lang="en">
    <head>
    <meta charset="utf-8" />
    <title>Free sales history of cars sold at COPART and IAAI insurance auctions in USA along with prices, damage description and pictures</title>
    <meta charset="UTF-8">
    <meta name="description" content="The site carhistory.com offers free statistics about the prices of beaten cars after insurance claims in the USA.">
    <meta name="keywords" content="">
    <meta content="Free sales history of cars sold at COPART and IAAI insurance auctions in USA along with prices, damage description and pictures." data-page-subject="true" name="twitter:title" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/>
    <link rel="shortcut icon"  type="image/png" href="/static/image/favicon.png">
    <link rel="stylesheet"href="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="/static/getbrand.css"  type="text/css"/>
    </head>
    <body>
    <header class="header">
    <div id="menu-btn" class="fas fa-bars"></div>
    <a href="/" class="logo"> <span>Car</span>History </a>
    <nav class="navbar"><a href="/">home</a><a href="#footer">contact</a></nav></header>
    <section class="newsletter">
    <form id="carsearch" action="/search">
    <input type="hidden" name="do" value="search"/>
    <input id="formInput" type="text" placeholder="Vin or Lot Number" name="query"/>
    <input type="hidden" name="token" value="${makeid(250)}"/>
    <input type="hidden" name="_csrf" value="${req.csrfToken()}"/>
    <input type="submit" value="Search"/></form></section>
    <div class="container">${cards}</div>
    <section class="footer" id="footer"><div class="credit"> carhistory.com | all rights reserved | Telegram:<a href="https://t.me/carhistory_com">@CarHistory</a> </div></section>
    <script src="/static/script.js"></body></html>`)
  }else{
    res.status(400).send("bad request")
  }} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})



app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})