/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
sails.bcrypt = require('bcryptjs');
jwt = require("jsonwebtoken");
const saltRounds = 10;
const secret = 'secret';

module.exports = {

    register: async function (req, res) {

        if (req.method == 'GET') {
            return res.view('user/register');
        }

        var users = await User.find({ Email: req.body.Email });
        if (users.length > 0) {
            return res.status(409).send("This email address has already been registered.");
        }

        const hash = await sails.bcrypt.hash(req.body.Password, saltRounds);

        const token = jwt.sign({ Email: req.body.Email }, secret, { expiresIn: 15 })

        await User.create({
            Email: req.body.Email,
            Password: hash,
            Surname: req.body.Surname,
            GivenName: req.body.GivenName,
            confirmationCode: token
        });

        // var link = 'http://localhost:1337/user/auth_user?confirmationCode=' + token;

        await sails.helpers.sendSingleEmail({
            to: req.body.Email,
            from: sails.config.custom.mailgunFrom,
            subject: 'Account Activation',
            //text: link
            html: '<p style="color: #5E5E5E;">** This is a system-generated message. Please do not reply to this email.**</p><p>Dear ' + req.body.GivenName + ',</p><p>Your registration with the HKBU Application System for Undergraduate Programmes is received. Please click on the link below to activate account.</p><p><a href="http://localhost:1337/user/auth_user?confirmationCode=' + token + '">http://localhost:1337/user/auth_user?confirmationCode=' + token + '</a><p>Should you have any questions, you may contact our office through the "Contact Us" function on our admissions website.</p><p>Yours sincerely,<br>Admissions Section<br>Academic Registry<br>Hong Kong Baptist University</p>'


        });
        
        // return res.redirect('/pages/accountCreationRequest');

        if (req.wantsJSON) {

            return res.json({ message: "Register successfully.", url: '/pages/accountCreationRequest' });

        } else {

            return res.redirect('/pages/accountCreationRequest');
        }
    },

    auth_user: async function (req, res) {

        var model = await User.findOne(
            { confirmationCode: req.query.confirmationCode }
        );

        // var model = await User.findOne({ confirmationCode: req.params.confirmationCode });
        // var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        await User.update(model.id).set({
            active: 'yes',
        }).fetch();

        return res.view('user/login');
    },

    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');

        if (!req.body.email || !req.body.password) return res.badRequest();

        var user = await User.findOne({ Email: req.body.email });

        if (!user) {
            return res.status(401).send("This email address has not yet been registered.")
        }

        if (user.active == "no") {
            return res.status(401).send("Pending account. Please verify your email")
        }

        // if (user.Password != req.body.password) {
        //     return res.status(401).send("Wrong Password");
        // }

        const match = await sails.bcrypt.compare(req.body.password, user.Password);

        if (!match) return res.status(401).send("Wrong Password");

        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);

            req.session.userId = user.id;
            req.session.role = user.role;
            req.session.user = user;
            req.session.status = user.status;

            req.session.personalParticularsData = user.personalParticularsData;
            req.session.programmePreferenceData = user.programmePreferenceData;
            req.session.academicProfileData = user.academicProfileData;
            req.session.otherInformationData = user.otherInformationData;
            req.session.academicQualificationData = user.academicQualificationData;

            if (req.session.role == 'student') {

                if (req.wantsJSON) {

                    return res.json({ message: "Login successfully.", url: '/user/student/myInbox' });

                } else {

                    return res.redirect('/user/student/myInbox');
                }

            } else if (req.session.role == 'admin') {

                if (req.wantsJSON) {

                    return res.json({ message: "Login successfully.", url: '/user/admin/applications/all/search' });

                } else {

                    return res.redirect('/user/admin/applications/all/search');
                }
            } else if (req.session.role == 'professor') {

                if (req.wantsJSON) {

                    return res.json({ message: "Login successfully.", url: '/user/professor/applications/all' });

                } else {

                    return res.redirect('/user/professor/applications/all');
                }
            }
        });
    },

    logout: async function (req, res) {

        req.session.destroy(function (err) {

            if (err) return res.serverError(err);

            return res.redirect('/user/login');

        });
    },

    forgot: async function (req, res) {

        if (req.method === 'GET') {
            return res.view('user/forgot');
        }

        var user = await User.findOne({ Email: req.body.email });

        if (!user) {

            return res.status(400).send("This email address has not yet been registered.")  // bad request
        }

        var html = await sails.renderView('user/email_resetPassword', {
            model: user,
            layout: false
        });

        await sails.helpers.sendSingleEmail({
            to: user.Email,
            from: sails.config.custom.mailgunFrom,
            subject: 'Reset Password',
            html: html
        });

        if (req.wantsJSON) {

            return res.json({ message: "Reset password request sent", url: '/pages/resetPasswordRequest' });    // for ajax request

        } else {

            return res.redirect('/pages/resetPasswordRequest');           // for normal request
        }
    },

    // action - view
    reset_password: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/resetPassword', { user: model });

    },

    update: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.params.id);

            if (!model) return res.notFound();

            return res.view('user/resetPassword', { user: model });

        } else {

            if (!req.body.User)
                return res.status(400).send("Form-data not received."); //bad Request

            const hash = await sails.bcrypt.hash(req.body.User.Password, saltRounds);

            await User.update(req.params.id).set({
                Password: hash
            }).fetch();

            return res.redirect('/user/login');
        }
    },

    programme_preference: async function (req, res) {

        if (req.method == "GET") return res.view('forms/programmePreference');
    },

    save: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            if (!model) return res.notFound();

            return res.view('forms/programmePreference', { user: model });

        } else {

            var model = await User.update(req.session.userId).set({
                entryYear1: req.body.User.entryYear1,
                program1: req.body.User.program1,
                entryYear2: req.body.User.entryYear2,
                program2: req.body.User.program2,
                entryYear3: req.body.User.entryYear3,
                program3: req.body.User.program3,
            }).fetch();

            req.session.user.program1 = req.body.User.program1,
                req.session.user.entryYear1 = req.body.User.entryYear1,
                req.session.user.program2 = req.body.User.program2,
                req.session.user.entryYear2 = req.body.User.entryYear2,
                req.session.user.program3 = req.body.User.program3,
                req.session.user.entryYear3 = req.body.User.entryYear3

            if (model.length == 0) return res.notFound();

            return res.redirect('/forms/programmePreference');
        }
    },

    save_and_continue: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            if (!model) return res.notFound();

            return res.view('forms/programmePreference', { user: model });

        } else {

            var model = await User.update(req.session.userId).set({
                entryYear1: req.body.User.entryYear1,
                program1: req.body.User.program1,
                entryYear2: req.body.User.entryYear2,
                program2: req.body.User.program2,
                entryYear3: req.body.User.entryYear3,
                program3: req.body.User.program3
            }).fetch();

            req.session.user.program1 = req.body.User.program1,
                req.session.user.entryYear1 = req.body.User.entryYear1,
                req.session.user.program2 = req.body.User.program2,
                req.session.user.entryYear2 = req.body.User.entryYear2,
                req.session.user.program3 = req.body.User.program3,
                req.session.user.entryYear3 = req.body.User.entryYear3

            if (model.length == 0) return res.notFound();

            return res.redirect('/forms/academicReference');
        }
    },
};

