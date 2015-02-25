require('longjohn');

var ns = require('../lib');
var debug = ns.debug;
var tools = ns.tools;
var YaBoss = require('yaboss');
var YaBossClient = new YaBoss('someCustomerKey', 'someCustomerSecret');

exports.searchArtists = function(filter, next) {

 
    YaBossClient.search('web','yahoo', {count: 10}, function(err,dataFound,response){...});
    YaBossClient.searchWeb('yahoo', {count: 10}, function(err,dataFound,response){...});
    YaBossClient.searchLimitedWeb('yahoo', {count: 10}, function(err,dataFound,response){...});
    YaBossClient.searchImages('yahoo', {count: 10, dimensions: 'medium'}, function(err,dataFound,response){...});
    YaBossClient.searchNews('yahoo', {count: 10}, function(err,dataFound,response){...});
    YaBossClient.searchBlogs('yahoo', {count: 10}, function(err,dataFound,response){...});
    YaBossClient.searchAds('yahoo', {count: 10}, function(err,dataFound,response){...});
    YaBossClient.getGeoSearch('yahoo', {count: 10}, function(err,dataFound,response){...});


};