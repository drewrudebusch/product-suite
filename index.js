var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var flash = require('connect-flash');
var db = require('./models');
var fs = require('fs');
var util = require('util');
var alasql = require('alasql');
var xlsx = require('xlsx');
var async = require('async');
var app = express();

// var multer = require('multer');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(ejsLayouts);
app.use(express.static('static'));
app.use(session ({
	secret: 'EverybodyPoops',
	resave: false,
	saveUninitialized: true
}));
app.use(flash());

app.use(function(req, res, next){
	console.log('session log: ',req.session.userId);
	if(req.session.userId) {
		db.user.findById(req.session.userId).then(function(user){
			req.currentUser = user;
			res.locals.currentUser = user;
			next();
		})
	} else {
		req.currentUser = false;
		res.locals.currentUser = false;
		next();
	}
});

app.get('/', function(req, res) {
	if(req.currentUser) {
		res.redirect('products/myProducts');
	} else {
		res.render('index', {alerts: req.flash()});
	}
});

// *************  BEGIN ACCOUNT ROUTES  *************

// ***** SIGN UP *****
app.post('/signup', function(req, res) {
	db.user.findOrCreate({
		where: {email: req.body.email},
		defaults: {password: req.body.password}
	}).spread(function(user, created){
		if (created) {
			db.user.authenticate(req.body.email, req.body.password, function(err, user) {
					req.session.userId = user.id;
					res.redirect('products/myProducts')
				});
		} else {
  		req.flash('danger', 'Email address is already taken. Please choose another.')
    	res.redirect('/');
  	}
  }).catch(function(err) {
    res.send('err');
  });
});

// ***** LOG IN *****
app.post('/login', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	db.user.find({where: {email: email}}).then(function(user){
		if (user) {
			db.user.authenticate(email, password, function(err, user) {
				if(err) {
					res.send(err);
				} else if (user) {
					req.session.userId = user.id;
					res.redirect('products/myProducts')
				} else {
					req.flash('danger', 'Email and/or password is incorrect.')
					res.redirect('/');
				}
			})
		} else {
			req.flash('danger', 'The email entered is not registered. Please sign up or enter valid email.')
			res.redirect('/');
		}
	})
});

// ***** LOG OUT *****
app.get('/logout', function(req, res) {
	req.session.userId = false;
	res.redirect('/');
})

// *************  END ACCOUNT ROUTES  *************

// *************  BEGIN PRODUCT ROUTES  *************

app.get('/products/myProducts', function(req, res) {
	if (req.currentUser) {
		db.product.findAll({
			include: [{
						model: db.styleColor,
						all: true,
						include: [{
							model: db.styleFamily,
							all: true,
						}]
					}]
		})
			.then(function(products) {
				console.log('!!! PRODUCT RETURNED FROM GET QUERY !!!');
				console.log(products);
					res.render('products/myProducts', {products: products})
			});
		} else {
			req.flash('danger', "You must be logged in dum dum!");
			res.redirect('/');
		}
})

app.get('/error', function(req, res) {
  res.render('error');
})

app.post('/upload', function(req, res) {
	var products = req.body.data
	var ln = Object.keys(products).length;

  var findOrCreateRecord = function(index, length, products) {
    var position = Number(index);
    var item = products[position];
    if (position === length) {
      res.sendStatus(200);
    } else {
      console.log('Checking item #: ', position)
      db.product
      .findOrCreate({where: 
        {
          productName: item.styleColorName + ' - ' + item.size,
          size: item.size,
          retail: item.retail,
          vendorSKU: item.vendorSKU,
          UPC: item.UPC,
          MSRP: item.MSRP,
          cost: item.cost
        }
      }).spread(function(product, productIsNew) {
        if (productIsNew) {
          console.log('!!! PRODUCT CREATED !!!');
          db.styleColor
            .findOrCreate({where:
              {
                color: item.color,
                vendor: item.vendor,
                vendorStyleColorId: item.vendorStyleColorId,
                gender: item.gender,
                description: item.description,
                styleColorName: item.styleColorName,
                countryOfOrigin: item.countryOfOrigin
              }
            }).spread(function(color, colorIsNew) {
              color.addProduct(product);
                if (colorIsNew) {
                  console.log('!!! COLOR CREATED !!!');
                  db.styleFamily
                    .findOrCreate({where:
                      {
                        brand: item.brand,
                        styleName: item.styleName,
                        vendorStyleId: item.vendorStyleId
                      }
                    }).spread(function(family, familyIsNew) {
                      if (familyIsNew) {
                        console.log('!!! FAMILY CREATED !!!');
                      }
                      family.addStyleColor(color);
                      position = position + 1;
                      findOrCreateRecord(position, length, products)
                });
              } else {
                position = position + 1;
                findOrCreateRecord(position, length, products)
              }
            })
          } else {
            position = position + 1;
            findOrCreateRecord(position, length, products)
          }
      })
    }
  }
  findOrCreateRecord(0, ln, products);
})

app.post('/delete', function(req, res) {
	var products = req.body.itemsToDelete;
	// var length = products.length;
	db.product.destroy({where: {id: products}}).then(function(deleted) {
		console.log(deleted);
		if(deleted !== 0) {
			res.sendStatus(200);
		};
	});
});

app.get('/', function(req, res) {
	if(req.currentUser) {
		res.redirect('products/myProducts');
	} else {
		res.render('index', {alerts: req.flash()});
	}
});

// *************  END PRODUCT ROUTES  *************

app.listen(process.env.PORT || 3000)

var respond = function(res) {
	res.sendStatus(200);
}


// var findOrCreateRecord2 = function(item) {
//     db.product
//     .findOrCreate({where: 
//       {
//         productName: item.styleColorName + ' - ' + item.size,
//         size: item.size,
//         retail: item.retail,
//         vendorSKU: item.vendorSKU,
//         UPC: item.UPC,
//         MSRP: item.MSRP,
//         cost: item.cost
//       }
//     }).spread(function(product, productIsNew) {
//       if (productIsNew) {
//         console.log('!!! PRODUCT CREATED !!!');
//         db.styleColor
//           .findOrCreate({where:
//             {
//               color: item.color,
//               vendor: item.vendor,
//               vendorStyleColorId: item.vendorStyleColorId,
//               gender: item.gender,
//               description: item.description,
//               styleColorName: item.styleColorName,
//               countryOfOrigin: item.countryOfOrigin
//             }
//           }).spread(function(color, colorIsNew) {
//             color.addProduct(product);
//               if (colorIsNew) {
//                 console.log('!!! COLOR CREATED !!!');
//                 db.styleFamily
//                   .findOrCreate({where:
//                     {
//                       brand: item.brand,
//                       styleName: item.styleName,
//                       vendorStyleId: item.vendorStyleId
//                     }
//                   }).spread(function(family, familyIsNew) {
//                     if (familyIsNew) {
//                       console.log('!!! FAMILY CREATED !!!');
//                     }
//                     family.addStyleColor(color);
//               });
//                 }
//       });
//     };
//   });
// };


