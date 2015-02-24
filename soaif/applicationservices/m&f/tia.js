require('longjohn');

var ns = require('../../lib');
var debug = ns.debug;
var tools = ns.tools;

//var apiUrl = 'https://services.mf.co.za:8100/rester/lob.mf/';
var apiUrl = 'https://196.38.69.25:8100/rester/lob.mf/';

exports.loadClaim = function(filter, next) {

	var url = apiUrl + 'claim?claimno=' + (filter.ref || '');
	url += '&policyno=' + (filter.policyno || '');
	
	var result = tools.collection('claims');

	result.add({
		brokername: "Swarts T/a Charel Swarts Makelaa",
		brokerno: "644498",
		brokerref: "",
		caseno: "979373",
		claimbranchcode: "CM",
		claimbranchname: "Cape Town Claims Hub",
		claimno: "120578870",
		clientname: "GG V/D BERG",
		clientno: "10007144",
		costofclaim: "85,266.53",
		datasource: "TIA",
		dateofloss: "12/06/2011 22:15:00",
		handler: "JSCHEUN",
		latestestimate: "0.00",
		latestestimateod: "0.00",
		lossdescription: "VOERTUIG GLY OP NAT PAD EN BOTS TEEN PAAL",
		policyno: "108",
		registereddate: "22/06/2011 11:49:25",
		riskaddress: "",
		sourcesystem: "TIA",
		totalpayments: "85,266.53",
		type: "Motor"
	});

	return next(null, result);
};


exports.loadPolicy = function(filter, next) {

	var url = apiUrl + 'policy?policyno=' + (filter.ref || '');
	
	var result = tools.collection('policies');

	result.add({
		branch: "KB - Upington Branch",
		brokername: "Swarts T/a Charel Swarts Makelaa",
		brokerno: "644498",
		brokerref: "",
		brokertel: "054 332-1724",
		clientname: "GG V/D BERG",
		clientno: "10007144",
		clienttel: "0000000000000000",
		coverenddate: "23/12/2014 00:00:00",
		coverstartdate: "23/12/2014 00:00:00",
		datasource: "TIA",
		division: "Unknown",
		inceptiondate: "28/05/1986 00:00:00",
		policyno: "108",
		productcode: "01",
		productdesc: "Allsure South Africa",
		totalpremium: "1,085.09"
	});

	return next(null, result);
};

