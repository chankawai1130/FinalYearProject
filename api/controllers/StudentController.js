/**
 * StudentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 sails.bcrypt = require('bcryptjs');
 const saltRounds = 10;

module.exports = {

    my_inbox: async function (req, res) {

        if (req.method == "GET") return res.view('user/student/myInbox');
    },

    my_application: async function (req, res) {

        if (req.method == "GET") return res.view('user/student/myApplication');
    },

    // upload1: async function (req, res) {

    //     if (req.method == 'GET')
    //         return res.view('user/student/uploadDocument');

    //     req.file('avatarfile').upload({ maxBytes: 10000000 }, async function whenDone(err, uploadedFiles) {
    //         if (err) { return res.serverError(err); }
    //         if (uploadedFiles.length === 0) { return res.badRequest('No file was uploaded'); }

    //         await User.update({ id: req.session.userId }, {
    //             avatarPath: uploadedFiles[0].fd
    //         });

    //         return res.ok('File uploaded.');
    //     })

    // },

    // avatar: async function (req, res) {
    //     var user = await User.findOne({ id: req.session.userId });
    //     if (!user || !user.avatarPath)
    //         return res.notFound();

    //     var SkipperDisk = require('skipper-disk');
    //     var fileAdapter = SkipperDisk();
    //     // set the filename
    //     // res.set("Content-disposition", "attachment; filename='avatar.jpg'");
    //     res.set('Content-type', 'image/jpeg');
    //     // Stream the file
    //     fileAdapter.read(user.avatarPath).on('error', function (err) {
    //         return res.serverError(err);
    //     }).pipe(res);
    // },

    upload: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            return res.view('user/student/uploadDocument', { user: model });
        }

        await User.update(req.session.userId).set({
            acadTranscript: req.body.User.acadTranscript,
            gradCert: req.body.User.gradCert,
            examResultSlip: req.body.User.examResultSlip,
            otherDoc: req.body.User.otherDoc,
        }).fetch();

        return res.ok('Uploaded Successfully!');
    },

    application_status: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            return res.view('user/student/applicationStatus', { user: model });
        }
    },

    my_profile: async function (req, res) {

        if (req.method == "GET") return res.view('user/student/myProfile');
    },

    update_info: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            if (!model) return res.notFound();

            return res.view('/user/student/myProfile', { user: model });

        } else {

            var model = await User.update(req.session.userId).set({
                Email: req.body.Email,
                Surname: req.body.Surname,
                GivenName: req.body.GivenName
            }).fetch();

            req.session.user.Email = req.body.Email,
            req.session.user.Surname = req.body.Surname,
            req.session.user.GivenName = req.body.GivenName

            if (model.length == 0) return res.notFound();

            return res.redirect('/user/student/myProfile');
        }
    },

    change_password: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            if (!model) return res.notFound();

            return res.view('/user/student/myProfile', { user: model });

        } else {

            var user = await User.findOne(req.session.userId);

            const match = await sails.bcrypt.compare(req.body.currentPw, user.Password);

            if (!match) return res.status(401).send("Wrong Password"); 

            const hash = await sails.bcrypt.hash(req.body.Password, saltRounds);

            var model = await User.update(req.session.userId).set({
                Password: hash
            }).fetch();

            if (model.length == 0) return res.notFound();

            if (req.wantsJSON) {

                return res.json({ message: "Change password successfully.", url: '/user/student/myProfile' });

            } else {

                return res.redirect('/user/student/myProfile');
            }
        }
    },

    accept_second_offer: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus2: "Offer Accepted" }).fetch();

        await User.update(req.params.id).set({ program2IsEnrolled: "Yes" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "Offer has been accepted.", url: '/user/student/applicationStatus' });    // for ajax request
        } else {
            return res.redirect('/user/student/applicationStatus');           // for normal request
        }
    },

    accept_first_offer: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus1: "Offer Accepted" }).fetch();

        await User.update(req.params.id).set({ program1IsEnrolled: "Yes" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "Offer has been accepted.", url: '/user/student/applicationStatus' });    // for ajax request
        } else {
            return res.redirect('/user/student/applicationStatus');           // for normal request
        }
    },

    accept_third_offer: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus3: "Offer Accepted" }).fetch();

        await User.update(req.params.id).set({ program3IsEnrolled: "Yes" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "Offer has been accepted.", url: '/user/student/applicationStatus' });    // for ajax request
        } else {
            return res.redirect('/user/student/applicationStatus');           // for normal request
        }
    },

    is_clicked: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        if (req.session.status == 'new') {
            await User.update(req.session.userId).set({
                status: 'In progress',
            }).fetch();
        }

        req.session.status = 'In progress';

        return res.redirect('/forms/personalParticulars');
    },

    decline_third_offer: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus3: "Offer Declined" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "Offer has been rejected.", url: '/user/student/applicationStatus' });    // for ajax request
        } else {
            return res.redirect('/user/student/applicationStatus');           // for normal request
        }
    },

    decline_second_offer: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus2: "Offer Declined" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "Offer has been rejected.", url: '/user/student/applicationStatus' });    // for ajax request
        } else {
            return res.redirect('/user/student/applicationStatus');           // for normal request
        }
    },

    decline_first_offer: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus3: "Offer Declined" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "Offer has been rejected.", url: '/user/student/applicationStatus' });    // for ajax request
        } else {
            return res.redirect('/user/student/applicationStatus');           // for normal request
        }
    },
};

