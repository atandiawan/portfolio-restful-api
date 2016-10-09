let express = require('express')
let router = express.Router()
let bodyParser = require('body-parser')
let Models = require('../models/bahanpokok.js')
let http = require('http')

router.use(bodyParser())

//client
router.get('/register', function(req, res, next) {
  res.render('register.ejs')
})

//client
router.get('/display', function(req, res, next) {
  http.get({
    host: "localhost",
    port: "3000",
    path: "/api/display/item"
  }, function(response) {
    hasil = ""
    response.on('data', function(d) {
      hasil += d
    });
    response.on('end', function() {
      let hasilJSONItems = JSON.parse(hasil)
      res.render('display.ejs', {items:hasilJSONItems})
    })
  })
})

//SERVER


router.post('/items/edit/:id', function(req, res, next) {
  http.get({
    host: "localhost",
    port: "3000",
    path: `/api/items/edit/${req.params.id}`,
  }, function(response) {
    let hasil = ""
    response.on('data', function(d) {
      hasil += d
    });
    response.on('end', function() {
      let hasilJSON = JSON.parse(hasil)
      res.render('edit-item.ejs', { item: hasilJSON })
    });
  })
})

//SERVER
router.post('/api/register/item', function(req, res, next) {
  let newItem = new Models.Items({ "item_code": req.body.item_code, "name": req.body.name, "description": req.body.description, "price": req.body.price, "stock": req.body.stock }).save(function(err, result) {
    if (err) {
      console.log(err)
    }
    res.redirect('/register')
  })
})

router.get('/api/display/item', function(req, res, next) {
  Models.Items.find({}, function(err, result) {
    if (err) {
      console.log(err)
    } else {
      res.json(result)
    }
  })
})

router.post('/api/customers/delete/:id', function(req, res, next) {
  Models.Customers.remove({ _id: req.params.id }, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/display")
    }
  })
})

router.post('/api/items/delete/:id', function(req, res, next) {
  Models.Items.remove({ _id: req.params.id }, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/display")
    }
  })
})

router.get('/api/items/edit/:id', function(req, res, next) {
  Models.Items.findOne({ _id: req.params.id }, function(err, result) {
    res.json(result)
  })
})

router.post('/api/items/edit/success/:id', function(req, res, next) {
  Models.Items.update({ _id: req.params.id }, {item_code: req.body.item_code, name: req.body.name, description: req.body.description, price: req.body.price, stock: req.body.stock}, function(err){
    res.redirect("/display")
  })
})

module.exports = router
