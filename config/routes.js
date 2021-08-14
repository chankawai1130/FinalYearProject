/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
 '/': 'UserController.login',

  '/pages/accountCreationRequest': { view: 'pages/accountCreationRequest' },
  '/pages/resetPasswordRequest': { view: 'pages/resetPasswordRequest' },

  //UserController
  'POST /register': 'UserController.register', //http://localhost:1337/user/register
  'GET /user/login': 'UserController.login',  //http://localhost:1337/user/login
  'POST /user/login': 'UserController.login',
  'GET /user/forgot': 'UserController.forgot',  //http://localhost:1337/user/forgot
  'POST /user/forgot': 'UserController.forgot',
  'GET /user/email_resetPassword': 'UserController.forgot', //http://localhost:1337/user/email_resetPassword
  'GET /user/resetPassword/:id': 'UserController.reset_password', //http://localhost:1337/user/resetPassword/1
  'POST /user/update/:id': 'UserController.update',
  'POST /user/logout': 'UserController.logout',
 
  'GET /forms/programmePreference': 'UserController.programme_preference', 
  'POST /save/programmePreference': 'UserController.save',
  'POST /saveContinue/programmePreference': 'UserController.save_and_continue',

  //StudentController
  'GET /user/student/myInbox': 'StudentController.my_inbox', //http://localhost:1337/user/student/myInbox
  'GET /user/student/myApplication': 'StudentController.my_application', //http://localhost:1337/user/student/myApplication
  'GET /user/student/upload/document': 'StudentController.upload', //http://localhost:1337/user/student/upload/document
  'POST /user/student/upload/document': 'StudentController.upload',
  
  'GET /user/student/applicationStatus': 'StudentController.application_status', //http://localhost:1337/user/student/myApplication
  'GET /user/student/myProfile': 'StudentController.my_profile', //http://localhost:1337/user/student/myProfile
  'POST /user/updateInfo': 'StudentController.update_info',
  'POST /user/changePassword': 'StudentController.change_password', 
  'POST /offer/secondChoice/accept/:id': 'StudentController.accept_second_offer',
  'POST /offer/firstChoice/accept/:id': 'StudentController.accept_first_offer',
  'POST /offer/thirdChoice/accept/:id': 'StudentController.accept_third_offer',
  'POST /re-direct/link/clicked': 'StudentController.is_clicked',
  'POST/offer/firstChoice/decline/:id': 'StudentController.decline_first_offer',
  'POST/offer/secondChoice/decline/:id': 'StudentController.decline_second_offer',
  'POST/offer/thirdChoice/decline/:id': 'StudentController.decline_third_offer',

  //AdminController
  'GET /user/admin/applications/all/search': 'AdminController.searchAll', //http://localhost:1337/user/admin/applications/all/search
  'GET /user/admin/profile': 'AdminController.profile', //http://localhost:1337/user/admin/profile
  'POST /user/admin/updateInfo': 'AdminController.update_info',
  'POST /user/admin/changePassword': 'AdminController.change_password',
  'POST /user/admin/sendEmail': 'AdminController.send_email',
  'GET /user/admin/statistics': 'AdminController.statistics',
  'POST /applications/approve/:id': 'AdminController.approve',
  'POST /applications/disapprove/:id': 'AdminController.disapprove',
  'GET /user/admin/applications/approved/search': 'AdminController.approved_application', //http://localhost:1337/user/admin/applications/approved/search
  'GET /user/admin/applications/disapproved/search': 'AdminController.disapproved_application', //http://localhost:1337/user/admin/applications/disapproved/search
  'POST /applications/firstPreference/scheduleInterview/:id': 'AdminController.schedule_first_interview',
  'POST /applications/secondPreference/scheduleInterview/:id': 'AdminController.schedule_second_interview',
  'POST /applications/thirdPreference/scheduleInterview/:id': 'AdminController.schedule_third_interview',
  'POST /applications/firstPreference/interviewInvitation/sendEmail/:id': 'AdminController.sendEmail_first_interview',
  'POST /applications/secondPreference/interviewInvitation/sendEmail/:id': 'AdminController.sendEmail_second_interview',
  'POST /applications/thirdPreference/interviewInvitation/sendEmail/:id': 'AdminController.sendEmail_third_interview',
  'GET /user/admin/applications/details/:id': 'AdminController.show_personalParticulars', //http://localhost:1337/user/admin/applications/details/1
  'GET /user/admin/applications/details/academicProfile/:id': 'AdminController.show_academicProfile', //http://localhost:1337/user/admin/applications/details/academicProfile/1
  'GET /user/admin/applications/details/programmePreference/:id': 'AdminController.show_programmePreference',
  'GET /user/admin/applications/details/academicQualification/:id': 'AdminController.show_academicQualification',
  'GET /user/admin/applications/details/academicReference/:id': 'AdminController.show_academicReference',
  'GET /user/admin/applications/details/otherInformation/:id': 'AdminController.show_otherInformation',

  //ProfessorController
  'GET /user/professor/applications/all': 'ProfessorController.all_applications', //http://localhost:1337/user/professor/applications/all
  'POST /user/professor/applications/all': 'ProfessorController.all_applications', //http://localhost:1337/user/professor/applications/all
  'GET /user/professor/profile': 'ProfessorController.profile', //http://localhost:1337/user/admin/profile
  'POST /user/professor/updateInfo': 'ProfessorController.update_info',
  'POST /user/professor/changePassword': 'ProfessorController.change_password',
  'POST /applications/first_preference/accept/:id': 'ProfessorController.accept_first_preference',
  'POST /applications/first_preference/reject/:id': 'ProfessorController.reject_first_preference',
  'POST /applications/second_preference/accept/:id': 'ProfessorController.accept_second_preference',
  'POST /applications/second_preference/reject/:id': 'ProfessorController.reject_second_preference',
  'POST /applications/third_preference/accept/:id': 'ProfessorController.accept_third_preference',
  'POST /applications/third_preference/reject/:id': 'ProfessorController.reject_third_preference',
  'GET /user/professor/accepted': 'ProfessorController.accepted_applications', //http://localhost:1337/user/admin/approved
  'GET /user/professor/rejected': 'ProfessorController.rejected_applications', //http://localhost:1337/user/admin/disapproved
  'POST /applications/first_preference/interview/:id': 'ProfessorController.first_preference_interview',
  'POST /applications/second_preference/interview/:id': 'ProfessorController.second_preference_interview',
  'POST /applications/third_preference/interview/:id': 'ProfessorController.third_preference_interview',
  'GET /user/professor/applications/details/:id': 'ProfessorController.show_personalParticulars', //http://localhost:1337/user/professor/applications/details/1
  'GET /user/professor/applications/details/academicProfile/:id': 'ProfessorController.show_academicProfile', //http://localhost:1337/user/professor/applications/details/academicProfile/1
  'GET /user/professor/applications/details/academicQualification/:id': 'ProfessorController.show_academicQualification',
  'GET /user/professor/applications/details/academicReference/:id': 'ProfessorController.show_academicReference',
  'GET /user/professor/applications/details/otherInformation/:id': 'ProfessorController.show_otherInformation',
  'GET /user/professor/applications/compare': 'ProfessorController.compare',
  'POST /user/professor/applications/compare': 'ProfessorController.compare',

  //EmailController
  'GET /user/admin/emailContent': 'AdminController.email_list', //http://localhost:1337/user/admin/emailContent
  'GET /user/admin/emailContent/update/:id': 'AdminController.email_content',
  'POST /user/admin/emailContent/update/:id': 'AdminController.email_content',

  //PersonalParticularsController
  'POST /forms/personalParticulars/save': 'PersonalParticularsController.save',
  'GET /forms/personalParticulars': 'PersonalParticularsController.personal_particulars', 
  'POST /forms/personalParticulars': 'PersonalParticularsController.personal_particulars', //http://localhost:1337/forms/personalParticulars
  'POST /forms/personalParticulars/save': 'PersonalParticularsController.save',

  //ProgramPreferenceController
  // 'GET /forms/programmePreference': 'ProgramPreferenceController.programme_preference', 
  // 'POST /forms/programmePreference': 'ProgramPreferenceController.programme_preference', //http://localhost:1337/forms/programmePreference
  // 'POST /forms/programmePreference/save': 'ProgramPreferenceController.save',
  
  //AcademicProfileController
  'GET /forms/academicProfile': 'AcademicProfileController.academic_profile', 
  'POST /forms/academicProfile': 'AcademicProfileController.academic_profile', //http://localhost:1337/forms/programmePreference
  'POST /forms/academicProfile/save': 'AcademicProfileController.save',
  'POST /forms/academicProfile/clear': 'AcademicProfileController.clear',

  //AcademicQualificationController
  'GET /forms/academicQualification': 'AcademicQualificationController.academic_qualification', 
  'POST /forms/academicQualification': 'AcademicQualificationController.academic_qualification', //http://localhost:1337/forms/academicQualification
  'POST /forms/academicQualification/save': 'AcademicQualificationController.save',
  
  //AcademicReferenceController
  'GET /forms/academicReference': 'AcademicReferenceController.academic_reference', 
  'POST /forms/academicReference': 'AcademicReferenceController.academic_reference', //http://localhost:1337/forms/academicReference
  'POST /forms/academicReference/save': 'AcademicReferenceController.save',

  //OtherInformationController
  'GET /forms/otherInformation': 'OtherInformationController.other_information', 
  'POST /forms/otherInformation': 'OtherInformationController.other_information', //http://localhost:1337/forms/otherInformation
  'POST /forms/submit': 'OtherInformationController.submit',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
