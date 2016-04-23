// ========== core dependency ========================
	var express = require('express');
	var app = express();
	
// ========set port for heroku and listen to this port ====================
   app.set('port', (process.env.PORT || 5000));

   app.get('/', function(request, response) {
	  console.log('Hello');
	});

	
// ============= for Ajax decoding ==================================

var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// =============  for making it allow the request from different domain/server
app.use(function(req,res,next){		
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
})

// ============= for Email =========================================
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

// ============= for SMS ===========================================
	// Twilio Credentials 
	var accountSid = 'AC9aad253856a01c64f42cf4827efa5a2e'; 
	var authToken = 'ac4ebfd7cebe6efac3bc38bd305149f2'; 
	 
	//require the Twilio module and create a REST client 
	var twilioClient = require('twilio')(accountSid, authToken); 
	
// ================================================================

app.post('/sendemail', function(req, res) {
	console.log("in sendemail function");	
	console.log(req.body);	
	var emailTo = req.body.to;	
	var emailSubject = req.body.subject;	
	var emailContent = req.body.content;
	sendEmail(emailTo, emailSubject, emailContent) ;
	// console.log(req.params[0]);
	// console.log(req.query.to);
	// res.json(req.body);
});

app.post('/sendsms', function(req, res) {
	console.log("in sendsms function");	
	console.log(req.body);	
	var phoneNumber = req.body.to;	
	var smsContent = req.body.content;
	sendSms(phoneNumber, smsContent) ;
});

function sendSms (phoneNumber, smsContent){
 
	twilioClient.messages.create({ 
		to: phoneNumber, 
		from: "+12028512907", 
		body: smsContent,   
	}, function(err, message) { 
		console.log(message.sid); 
	});
}

function sendEmail(emailTo, subject, emailContent) { 
	var transporter = nodemailer.createTransport({
	  service: "gmail",
	  auth: {
		xoauth2: xoauth2.createXOAuth2Generator({
		  user: "bogo.bangkok@gmail.com", 
		  clientId: "73857235573-k6b83gu6c9iqcg65uu8itjpgqpr0nqub.apps.googleusercontent.com",
		  clientSecret: "LPHMfnuZKGB5HpFNk8AcTjP4",
		  refreshToken: "1/WR_GY55OesMbEylkbiqwUym2i2npTrzNh-6hoSZN4gwMEudVrK5jSpoR30zcRFq6",
		  accessToken: "ya29..vgKD4Yr-Xf_hclUHDPlMpa0XVve7csQc3SLzflastRJLOACUgxosdG8x7lhoMM5BPg"
		})
	  }
	});

	//var transporter = nodemailer.createTransport('smtps://bogo.bangkok%40gmail.com:Buy1get1@smtp.gmail.com');

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: '"Bogo Bangkok" <bogo.bangkok@gmail.com>', // sender address
		to: emailTo, //'b40nua@yahoo.com, nuchareeoil@gmail.com', // list of receivers
		subject: subject, //'Hello 5', // Subject line
		text: emailContent, // plaintext body
		html: emailContent // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});		
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

