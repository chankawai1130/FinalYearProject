var mailgun = require('mailgun-js')({apiKey: sails.config.custom.mailgunSecret, domain: sails.config.custom.mailgunDomain});

module.exports = {
	friendlyName: 'Send single email',
	description: '',
	inputs: {
		options:{
			type:'json'
		}
	},
	exits: {
	},
	fn: async function (inputs, exits) {
		mailgun.messages().send(inputs.options, function (error, body) {
		
			if(error) return exits.error(error)
			return exits.success(body);
		});
	}
};