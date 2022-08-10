const connectToMongo = require('./db');
const express = require('express');
const app = express();
const Cars = require('./models/Cars');
var csurf = require('csurf')

connectToMongo();
const port = 80;
app.use('/static', express.static('static'));

app.get('/:make/:model/:vin', async (req, res) => {

  try{
  var {make,model,vin} = req.params;
  vin = vin.split('-').pop().toUpperCase();
  make = make.toUpperCase().split('-').join(" ");
  model = model.toUpperCase().split('-').join(" ");
  console.log(vin)
  var data = await Cars.findOne({
    vin,
  })

  var title =`<title>${data.make} ${data.model} Long Range/Performance ${data.year}  ${data.color} DUAL vin: ${data.vin} free car history</title>
  <meta name="description" content="Automobile ${data.model} Long Range/Performance ${data.year} ${data.color} DUAL vin: ${data.vin} was sold at auction ${data.auction} {data['Sale Date']} lot number id ${data.lot} with damage ${data.primaryDamage} at a price of $${data.retail}."/>
  <meta name="keywords" content="car, ${data.make}, automobile, insurance, auction, ${data.auction}, price, free, info, vin, ${data.vin}, usa, america, damage, photo"/>
  <meta content="${data.make} ${data.model} Long Range/Performance ${data.year} ${data.color} DUAL vin: ${data.vin} free car history" data-page-subject="true" name="twitter:title" />
  <meta content="Automobile ${data.make} ${data.model} Long Range/Performance ${data.year} ${data.color} DUAL vin: ${data.vin} was sold at auction ${data.auction} {data['Sale Date']} lot number id ${data.lot} with damage ${data.primaryDamage} at a price of $${data.retail}." data-page-subject="true" name="twitter:description"/>
  <meta content="@bidfax" data-page-subject="true" name="twitter:site" />
  <meta content="bidfax" data-page-subject="true" name="twitter:via" />
  <meta content="http://localhost:3000/{data.make.replace(/ /g, '-').toLowerCase()}/{data.model.replace(/ /g, '-').toLowerCase()}/{data.year}-{data.model.replace(/ /g, '-').toLowerCase()}-{data.color.toLowerCase()}-{data.vin.toLowerCase()}" data-page-subject="true" name="twitter:url" />
  <meta content="@bidfax" data-page-subject="true" name="twitter:creator" />
  <meta content="photo" data-page-subject="true" name="twitter:card" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${data.make} ${data.model} Long Range/Performance ${data.year}  ${data.color} DUAL vin: ${data.vin} free car history"/>
  <meta property="og:description" content="Automobile ${data.make} ${data.model} Long Range/Performance ${data.year}  ${data.color} DUAL vin: ${data.vin} was sold at auction ${data.auction} {data['Sale Date']} lot number id ${data.lot} with damage ${data.primaryDamage} at a price of $${data.retail}."/>`
  
  
  
  var slider =`<div class="swiper-slide box"><img width="100%" src=${data.url1} alt=${data.make+" "+data.model+" "+data.color+" "+data.year+" "+data.vin}/></div>
  <div class="swiper-slide box"><img width="100%" src=${data.url2} alt=${data.make+" "+data.model+" "+data.color+" "+data.year+" "+data.vin}/></div>
  <div class="swiper-slide box"><img width="100%" src=${data.url3} alt=${data.make+" "+data.model+" "+data.color+" "+data.year+" "+data.vin}/></div>
  <div class="swiper-slide box"><img width="100%" src=${data.url4} alt=${data.make+" "+data.model+" "+data.color+" "+data.year+" "+data.vin}/></div>
  <div class="swiper-slide box"><img width="100%" src=${data.url5} alt=${data.make+" "+data.model+" "+data.color+" "+data.year+" "+data.vin}/></div>
  <div class="swiper-slide box"><img width="100%" src=${data.url6} alt=${data.make+" "+data.model+" "+data.color+" "+data.year+" "+data.vin}/></div>
  <div class="swiper-slide box"><img width="100%" src=${data.url7} alt=${data.make+" "+data.model+" "+data.color+" "+data.year+" "+data.vin}/></div>
  <div class="swiper-slide box"><img width="100%" src=${data.url8} alt=${data.make+" "+data.model+" "+data.color+" "+data.year+" "+data.vin}/></div>
  <div class="swiper-slide box"><img width="100%" src=${data.url9} alt=${data.make+" "+data.model+" "+data.color+" "+data.year+" "+data.vin}/></div>
  <div class="swiper-slide box"><img width="100%" src=${data.url10} alt=${data.make+" "+data.model+" "+data.color+" "+data.year+" "+data.vin}/></div>`;
  
  res.set('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="utf-8" />${title}<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/>
  <link rel="stylesheet"href="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="/static/car.css"  type="text/css"/>
  </head>
  <body>
  <header class="header">
  <div id="menu-btn" class="fas fa-bars"></div>
  <a href="/" class="logo"> <span>max</span>wheels </a>
  <nav class="navbar">
  <a href="/">home</a>
  <a href="/#vehicles">vehicles</a>
  <a href="/#contact">contact</a>
  </nav>
  </header>
  <section class="newsletter">
  <form action="">
  <input type="text" placeholder="Vin or Lot Number">
  <input type="submit" value="Search">
  </form>
  </section>
  <section class="mainContainer">
  <div class="carImagesMainSlider">
  <h3>${data.make} ${data.model}</h3>
  <div style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff;" class="swiper carImagesSlider">
  <div class="swiper-wrapper">
  ${slider}
  </div>
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
  </div>
  <div thumbsSlider="" class="swiper carImagesSliderThumbs">
  <div class="swiper-wrapper">
  ${slider}
  </div>
  </div>
  </div>
  <div class="carDetails">
  <h3 class="textColorWhite">${data.year+" "+data.make+" "+data.model+" "+data.color}</h3>
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
  <p class="textColorGray"> Cylinders : <span class="textColorWhite">${data.Cylinders}</span></p>
  <p class="textColorGray"> Drive : <span class="textColorWhite">${data.drive}</span></p>
  <p class="textColorGray"> Sale Status : <span class="textColorWhite">${data.document}</span></p>
  <p class="textColorGray"> Transmission : <span class="textColorWhite">${data.transmission}</span></p>
  </div></section>
  <section class="footer" id="footer">
  <div class="credit"> created by mr. web designer | all rights reserved </div></section>
  <script src="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js"></script>
  <script src="/static/swiper.js"></script>
  <script src="/static/script.js">
  </script>
  </body>
  </html>`);

}catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}
})
app.get('/', async (req, res) => {
  try {
    var slides=""
    var slide=""
    const data = await Cars.find().sort({$natural:1}).limit(10);
    for (let index = 0; index <= 9; index++) {
      
      slide=`<div class="swiper-slide box">
      <img src=${data[index].url1} alt=${data[index].make+" "+data[index].model+" "+data[index].color+" "+data[index].year+" "+data[index].vin}>
      <div class="content"><h3>${data[index].model}</h3><div class="price"> <span>Vin : </span> ${data[index].vin} </div>
      <p><span class="fas fa-circle">
      </span> ${data[index].year} <span class="fas fa-circle">
      </span> ${data[index].color} <span class="fas fa-circle">
      </span> ${data[index].transmission} <span class="fas fa-circle">
      </span> ${data[index].fuel} <span class="fas fa-circle">
      </span> $${data[index].retail}/-</p><a href="/${data[index].make.replace(/ /g, '-').toLowerCase()}/${data[index].model.replace(/ /g, '-').toLowerCase()}/${data[index].year}-${data[index].model.replace(/ /g, '-').toLowerCase()}-${data[index].color.toLowerCase()}-${data[index].vin.toLowerCase()}" class="btn">check Details</a>
      </div></div>`
      
      slides += slide;
      
    }
    res.set('Content-Type', 'text/html');
    res.status(200).send(`<!DOCTYPE html><html lang="en">
    <head><title>hil</title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/swiper@7/swiper-bundle.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="/static/style.css" type="text/css">
    </head>
    <body>
    <header class="header">
    <div id="menu-btn" class="fas fa-bars">
    </div><a href="/" class="logo"><span>max</span>wheels </a>
    <nav class="navbar"><a href="/">home</a>
    <a href="#vehicles">vehicles</a>
    <a href="#contact">contact</a></nav>
    </header><section class="newsletter">
    <form action="">
    <input type="text" placeholder="Vin or Lot Number">
    <input type="submit" value="Search"></form>
    </section><section class="home" id="home">
    <h3 data-speed="-2" class="home-parallax">find your car</h3>
    <img data-speed="5" class="home-parallax" src="image/home-img.png" alt=""></img></section>
    <section class="vehicles" id="vehicles">
    <h1 class="heading"> popular <span>vehicles</span> </h1>
    <div class="swiper vehicles-slider"><div class="swiper-wrapper">${slides}</div><div class="swiper-pagination"></div></div></section>
    <section class="contact" id="contact">
    <h1 class="heading"><span>contact</span> us</h1>
    <div class="row">
    <form action=""><h3>get in touch</h3>
    <input type="text" placeholder="your name" class="box">
    <input type="email" placeholder="your email" class="box">
    <textarea placeholder="your message" class="box" cols="30" rows="10"></textarea>
    <input type="submit" value="send message" class="btn"></form></div></section>
    <section class="footer" id="footer">
    <div class="credit"> created by mr. web designer | all rights reserved </div></section>
    <script src="https://unpkg.com/swiper@7/swiper-bundle.min.js"></script><script  src="/static/script.js"></script>
    </body></html>`)
 
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})