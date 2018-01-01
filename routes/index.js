var express = require('express');
var router = express.Router();
var Business = require('../models/business');


var yelpSearch = require('../yelp-fusion/yelp-fusion');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}



/* login user and increment or decrement the going value */
router.post('/bar', function (req, res, next) {

  if (req.isAuthenticated()) {
    Business.findOne({
        business_id: req.body.id
      })
      .exec(function (err, result) {
        if (err) {
          console.log("ERROR", err);
        }
        if (result) {
          if (result.users.indexOf(req.user.id) !== -1) {
            Business.findOneAndUpdate({
              business_id: req.body.id
            }, {
              "$pull": {
                "users": req.user.id
              }
            }, {
              new: true
            }, function (err, doc) {
              if (err) {
                console.log(err);
              }
              res.json({
                LOGED: true,
                going: doc.users.length
              });
            });
          } else {
            Business.findOneAndUpdate({
              business_id: req.body.id
            }, {
              "$push": {
                "users": req.user.id
              }
            }, {
              new: true
            }, function (err, doc) {
              if (err) {
                console.log(err);
              }
              res.json({
                LOGED: true,
                going: doc.users.length
              });
            });
          }

        } else {
          var newBusiness = new Business();
          newBusiness.business_id = req.body.id;
          newBusiness.users = req.user.id;
          newBusiness.save(function (err) {
            if (err) {
              console.log(err);
            }
            res.json({
              LOGED: true,
              going: newBusiness.users.length
            });

          });
        }

      });
  } else {
    res.json({
      LOGED: false,
      redirect: '/auth/twitter'
    });

  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  var place = "";
  if (req.isAuthenticated()) {
    if (req.session.place) {
      place = req.session.place;
    }
  }
  res.render('index', {
    title: 'Express',
    user: req.user,
    place: place
  });
});

// promise for yelp return list
function yelpResultPromise(businessList) {
  var businessList = businessList;

  // quries the database for business documents and return promise for each business's
  function quriesBusiness() {
    var queryArr = [];
    for (let i = 0; i < businessList.length; i++) {
      queryArr.push(Business.findOne({
        "business_id": businessList[i].id
      }).exec());
    }
    return queryArr;
  }

  // add no. of people going for a business's in the business's object
  function goingAdder(queryArr) {
    for (let i = 0; i < queryArr.length; i++) {
      if (queryArr[i]) {
        businessList[i]["going"] = queryArr[i].users.length;
      } else {
        businessList[i]["going"] = 0;
      }
    }
    return businessList;
  }



  return new Promise(function (resolve, reject) {
    Promise.all(quriesBusiness())
      .then(goingAdder)
      .then((results) => {
        resolve(results);
      })
      .catch((e) => {
        reject(e);
      });
  });

}

/* get the list of place Post  */
router.post('/', function (req, res, next) {
  console.log(req.body.place);
  req.session.place = req.body.place;
  yelpSearch(req.body.place)
    .then(yelpResultPromise)
    .then((results) => {
      res.json({
        "SUCCESS": true,
        "results": results
      })
    })
    .catch((e) => {
      res.json({
        "SUCCESS": false,
        "results": e
      });
    });


});


module.exports = router;