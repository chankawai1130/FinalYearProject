/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  AdminController: {
    '*': 'isAdmin'
  },

  ProfessorController: {
    '*': 'isProfessor'
  },

  StudentController: {
    '*': 'isStudent'
  },

  UserController: {
    save_and_continue: 'isStudent',
    save: 'isStudent',
    programme_preference: 'isStudent'
  },

 PersonalParticularsController: {
    '*': 'isStudent'
  },

  OtherInformationController: {
    '*': 'isStudent'
  },

  AcademicProfileController: {
    '*': 'isStudent'
  }
};
