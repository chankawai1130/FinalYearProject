/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    Email: {
      type: 'string',
      unique: true,
      required: true
    },

    Surname: {
      type: 'string'
    },

    GivenName: {
      type: 'string'
    },

    confirmationCode: { 
      type: 'string',
      unique: true,
      required: true,
    },

    active: {
      type: 'string',
      isIn: ['yes', 'no'],
      defaultsTo: 'no'
    },

    role: {
      type: 'string',
      isIn: ['admin', 'professor', 'student'],
      defaultsTo: 'student'
    },

    status: {
      type: 'string',
      isIn: ['new', 'In progress', 'submitted', 'approved', 'disapproved'],
      defaultsTo: 'new'
    },

    avatarPath: {
      type: 'string'
    },
    
    acadTranscript: {
      type: 'string',
    },

    gradCert: {
      type: 'string',
    },

    examResultSlip: {
      type: 'string',
    },

    otherDoc: {
      type: 'string',
    },

    idCode: {
      type: 'string'
    },

    program1: {
      type: "string"
    }, 

    entryYear1: {
      type: "string"
    }, 

    program2: {
      type: "string"
    }, 

    entryYear2: {
      type: "string"
    }, 

    program3: {
      type: "string"
    }, 

    entryYear3: {
      type: "string"
    }, 

    haveInterview1: {
      type: 'string',
      isIn: ['yes', 'no'],
      defaultsTo: 'no'
    },

    haveInterview2: {
      type: 'string',
      isIn: ['yes', 'no'],
      defaultsTo: 'no'
    },

    haveInterview3: {
      type: 'string',
      isIn: ['yes', 'no'],
      defaultsTo: 'no'
    },

    firstInterviewDate: {
      type: "ref",
      columnType: "date"
    },

    firstInterviewTime: {
      type: "ref",
      columnType: "time"
    },

    firstInterviewLocation: {
      type: 'string'
    },

    secondInterviewDate: {
      type: "ref",
      columnType: "date"
    },

    secondInterviewTime: {
      type: "ref",
      columnType: "time"
    },

    secondInterviewLocation: {
      type: 'string'
    },

    thirdInterviewDate: {
      type: "ref",
      columnType: "date"
    },

    thirdInterviewTime: {
      type: "ref",
      columnType: "time"
    },

    thirdInterviewLocation: {
      type: 'string'
    },

    personalParticularsData: {
      type: 'json',
    },

    programmePreferenceData: {
      type: 'json',
    },

    academicProfileData: {
      type: 'json',
    },

    academicQualificationData: {
      type: 'json',
    },

    otherInformationData: {
      type: 'json',
    },

    programmeStatus1: {
      type: 'string',
      isIn: ['Under Consideration', 'Offered', 'Offer Accepted', 'Offer Declined', 'Unsuccessful'],
      defaultsTo: 'Under Consideration'
    },

    programmeStatus2: {
      type: 'string',
      isIn: ['Under Consideration', 'Offered', 'Offer Accepted', 'Offer Declined', 'Unsuccessful'],
      defaultsTo: 'Under Consideration'
    },

    program1IsEnrolled: {
      type: 'string',
      isIn: ['Yes', 'No', 'Not decided yet'],
      defaultsTo: 'Not decided yet'
    },

    program2IsEnrolled: {
      type: 'string',
      isIn: ['Yes', 'No', 'Not decided yet'],
      defaultsTo: 'Not decided yet'
    },

    program3IsEnrolled: {
      type: 'string',
      isIn: ['Yes', 'No', 'Not decided yet'],
      defaultsTo: 'Not decided yet'
    },

    programmeStatus3: {
      type: 'string',
      isIn: ['Under Consideration', 'Offered', 'Offer Accepted', 'Offer Declined', 'Unsuccessful'],
      defaultsTo: 'Under Consideration'
    },

    department: {
      type: 'string',
    },

    comparison1: {
      type: 'string',
    }
    
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

  // beforeCreate: function (values, cb) {
  //   User.findOne({ Email: values.Email }, function (err, user) {
  //     if (user) {
  //       return cb('This email address is already registered.');
  //     } else {
  //       cb();
  //     }
  //   });
  // }

  // CallUserFunction: function (inputs, cb) {
  //   User.create({      
  //     Email: inputs.Email,
  //     // TODO: But encrypt the password first
  //   })
  //   .exec(cb);
  // }

  // beforeValidation: function(values, next){
  //   User.findOne({ where: { Email: values.Email}}).exec(function(err, user) {
  //      if(user == undefined){
  //          console.log("NOT FOUND"); //create the record
  //          next();
  //      }
  //      else{ 
  //         console.log("FOUND"); //don't create the record
  //         next("Error, already exist");  
  //      }

  //      });
  //  } 
};

