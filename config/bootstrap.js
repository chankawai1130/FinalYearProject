/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {

  sails.bcrypt = require('bcryptjs');
  const saltRounds = 10;
  
  const hash = await sails.bcrypt.hash('123456Ab', saltRounds);

  if (await User.count() == 0) {
    await User.createEach([
      { Email:"student@gmail.com", confirmationCode: "student@gmail.com", Password: hash, Surname: "Chan", GivenName: "Tai Man", role: "student", active: "yes", status: "approved", idCode: "UA2021-1", program1: "Bachelor of Business Administration (Hons)-Accounting Concentration", entryYear1: "Year 1"},
      { Email: "admissionStaff@gmail.com", confirmationCode: "admissionStaff@gmail.com", Password: hash, Surname: 'Leung', GivenName: 'Tin Yat', role: 'admin', active: 'yes' },
      { Email: "professor@gmail.com", confirmationCode: "professor@gmail.com", Password: hash, Surname: 'Lee', GivenName: 'Wing Yan', role: 'professor', active: 'yes' },
    ])
  }
};
