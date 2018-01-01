var Business = require('../models/business');

function goingBar(businessId) {
    Business.findOne({business_id: businessId}, function(err, results) {
        
    })
}