/**
 * AcademicProfile.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    primaryYrs: {
      type: "number"
    },

    secondaryYrs: {
      type: "number"
    },
    postYrs: {
      type: "number"
    },
    postCountry1: {
      type: "string"
    },
    postInstitution1: {
      type: "string"
    },
    postProgramTitle1: {
      type: "string"
    },
    postStudyStatus1: {
      type: "string"
    },
    postStudyMode1: {
      type: "string"
    },

    postGPA1: {
      type: "string"
    },

    postMaxGPA1: {
      type: "string"
    },

    postPeriodFrom1: {
      type: "ref",
      columnType: "date"
    },

    postPeriodTo1: {
      type: "ref",
      columnType: "date"
    },

    postQualification1: {
      type: "string"
    },

    secCountry1: {
      type: "string"
    },

    secSchoolName1: {
      type: "string"
    },

    secCurriculum1: {
      type: "string"
    },

    secPeriodFrom1: {
      type: "ref",
      columnType: "date"
    },

    secPeriodTo1: {
      type: "ref",
      columnType: "date"
    },

    secLevelAttained1: {
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

