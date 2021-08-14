/**
 * PersonalParticulars.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    engName: {
      type: "string"
    },

    chiName: {
      type: "string"
    },

    nationality: {
      type: "string"
    }, 

    dateOfBirth: {
      type: "ref",
      columnType: "date"
    }, 

    placeOfBirth: {
      type: "string"
    }, 

    sex: {
      type: "string"
    }, 

    email: {
      type: "string"
    }, 

    hkID: {
      type: "string"
    }, 

    nationalID: {
      type: "string"
    }, 

    issueCountry1: {
      type: "string"
    }, 

    travelDocNum: {
      type: "string"
    }, 

    issueCountry2: {
      type: "string"
    }, 

    telNum: {
      type: "string"
    }, 

    mobileNum: {
      type: "string"
    }, 

    address: {
      type: "string"
    }, 

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

