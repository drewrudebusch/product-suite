var db = require('./models');

var data = [
  { 
    MSRP: 129,
    UPC: "123456654321",
    brand:"Adidas",
    color:"White",
    cost: 48,
    countryOfOrigin: "China",
    description:"A classic shoe with a twist, this high top is perfect for style or competition.",
    gender:"Male",
    styleColorName:"White 3-stripe high tops",
    retail: 109,
    size: "8",
    styleName:"3-stripe high tops",
    vendor:"Adidas",
    vendorSKU:"ht3-w-8",
    vendorStyleColorId:"ht3-w",
    vendorStyleId:"ht3"
  },
  {
    MSRP: 129,
    UPC: "123456654321",
    brand:"Adidas",
    color:"White",
    cost: 48,
    countryOfOrigin: "China",
    description:"A classic shoe with a twist, this high top is perfect for style or competition.",
    gender:"Male",
    styleColorName:"White 3-stripe high tops",
    retail: 109,
    size: "9",
    styleName:"3-stripe high tops",
    vendor:"Adidas",
    vendorSKU:"ht3-w-9",
    vendorStyleColorId:"ht3-w",
    vendorStyleId:"ht3"
  },
  {
    MSRP: 129,
    UPC: "123456654321",
    brand:"Adidas",
    color:"Black",
    cost: 48,
    countryOfOrigin: "China",
    description:"A classic shoe with a twist, this high top is perfect for style or competition.",
    gender:"Male",
    styleColorName:"Black 3-stripe high tops",
    retail: 109,
    size: "9",
    styleName:"3-stripe high tops",
    vendor:"Adidas",
    vendorSKU:"ht3-bk-9",
    vendorStyleColorId:"ht3-bk",
    vendorStyleId:"ht3"
  }
]

findOrCreateRecord(0, data.length, data)

function findOrCreateRecord(index, length, products) {
  console.log(data.length);
  var position = Number(index);
  var item = products[position];
  if (position == length) {
    return;
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




async.whilst(
      function () { return count < length; },
      function (callback) {
          count++;
          function () {
            var item = products[position];
            findOrCreateRecord2(item);
              callback(null, count);
          };
      },
      function (err, n) {
          // 5 seconds have passed, n = 5 
      }
  );




  async.series([
    function(callback){
        findOrCreateRecord2(0, length, products)
        callback(null);
    },
    function(callback){
        res.sendStatus(200); 
        callback(null);
    }
],
function(err){

});



var findOrCreateRecord2 = function(item) {
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
              });
    })
  }
}
