const yelp = require('yelp-fusion');
const keys = require('../config/keys');

const client = yelp.client(keys.yelp.cleintKey);


function search(term) {
    var businessesArr = [];
    // return list of client review for a business and insert obj in the bussinessArr spacefing business's name, image_url, id
    function reviewList(businesses) {
        let list = [];
        for (let i = 0; i < businesses.length; i++) {
            let obj = {};
            obj["name"] = businesses[i].name;
            obj["image_url"] = businesses[i].image_url;
            obj["id"] = businesses[i].id;
            list.push(client.reviews(businesses[i].id));
            businessesArr[i] = obj;
        }
        return list;
    }

    // attach a review to each business's object
    function parseReview(reviewList) {
        for (let i = 0; i < reviewList.length; i++) {
            businessesArr[i]["review"] = reviewList[i].jsonBody.reviews[0].text;
        }
    }
    
    return new Promise(function (resolve, reject) {
        client.search({
                term: 'Bar',
                location: term,
            })
            .then(response => {

                var businessesList = response.jsonBody.businesses.slice(0, 20);
                return businessesList;
            })
            .then(reviewList)
            .then(arr => Promise.all(arr))
            .then((results) => {
                parseReview(results);
                resolve(businessesArr);
            })
            .catch(e => {
                reject(e);
            });
    });
}

module.exports = search;