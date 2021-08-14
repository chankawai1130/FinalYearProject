/**
 * ProfessorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
sails.bcrypt = require('bcryptjs');
const saltRounds = 10;

module.exports = {

    all_applications: async function (req, res) {

        var models = await User.find({ where: { role: "student", status: 'approved' } });

        var threeChoice = await User.count({
            where: {
                role: "student", status: 'approved', program2: { '!=': "" }, program3: { '!=': "" }
            },
        });

        var twoChoice = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', program2: { '!=': "" }, program3: "" },
                    { role: "student", status: 'approved', program2: "", program3: { '!=': "" } },
                ]
            },
        });

        var oneChoice = await User.count({
            where: {
                role: "student", status: 'approved', program2: "", program3: ""
            },
        });

        var all = threeChoice * 3 + twoChoice * 2 + oneChoice * 1;

        var allAccepted = await User.count({
            where: {
                role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: "Offered", programmeStatus3: "Offered"
            },
        });

        var twoAccepted = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: "Offered", programmeStatus3: { '!=': "Offered" } },
                    { role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: { '!=': "Offered" }, programmeStatus3: "Offered" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Offered" }, programmeStatus2: "Offered", programmeStatus3: "Offered" },
                ]
            },
        });

        var oneAccepted = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: { '!=': "Offered" }, programmeStatus3: { '!=': "Offered" } },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Offered" }, programmeStatus2: { '!=': "Offered" }, programmeStatus3: "Offered" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Offered" }, programmeStatus2: "Offered", programmeStatus3: { '!=': "Offered" } },
                ]
            },
        });

        var accepted = allAccepted * 3 + twoAccepted * 2 + oneAccepted;

        var allRejected = await User.count({
            where: {
                role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: "Unsuccessful", programmeStatus3: "Unsuccessful"
            },
        });

        var twoRejected = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: "Unsuccessful", programmeStatus3: { '!=': "Unsuccessful" } },
                    { role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: { '!=': "Unsuccessful" }, programmeStatus3: "Unsuccessful" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Unsuccessful" }, programmeStatus2: "Unsuccessful", programmeStatus3: "Unsuccessful" },
                ]
            },
        });

        var oneRejected = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: { '!=': "Unsuccessful" }, programmeStatus3: { '!=': "Unsuccessful" } },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Unsuccessful" }, programmeStatus2: { '!=': "Unsuccessful" }, programmeStatus3: "Unsuccessful" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Unsuccessful" }, programmeStatus2: "Unsuccessful", programmeStatus3: { '!=': "Unsuccessful" } },
                ]
            },
        });

        var rejected = allRejected * 3 + twoRejected * 2 + oneRejected;

        return res.view('user/professor/dashboard', { applications: models, allNum: all, acceptedNum: accepted, rejectedNum: rejected });

    },

    compare: async function (req, res) {

        if (req.method == "GET") return res.forbidden;

        var result1 = await User.findOne({
            where: {
                idCode: req.body.sApplication1,
                status: "approved"
            },
        });

        var result2 = await User.findOne({
            where: {
                idCode: req.body.sApplication2,
                status: "approved"
            },
        });

        return res.view('user/professor/comparison', { model1: result1, model2: result2 });
    },

    search: async function (req, res) {

        const qApplication = req.query.application || "";

        var result = await User.find({
            where: { role: "student", or: [{ program1: { contains: qApplication }, program2: { contains: qApplication }, program3: { contains: qApplication } }], or: [{ status: 'approved' }, { status: 'accepted' }, { status: 'rejected' }] }
        })

        return res.view('user/professor/dashboard', { models: result });
    },

    reject_first_preference: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus1: "Unsuccessful" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "申請已被拒絕 Application has been rejected.", url: '/user/professor/applications/all' });    // for ajax request
        } else {
            return res.redirect('/user/professor/applications/all');           // for normal request
        }

    },

    accept_first_preference: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus1: "Offered" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "申請已被確認 Application has been accepted.", url: '/user/professor/applications/all' });    // for ajax request
        } else {
            return res.redirect('user/professor/applications/all');           // for normal request
        }
    },

    reject_second_preference: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus2: "Unsuccessful" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "申請已被拒絕 Application has been rejected.", url: '/user/professor/applications/all' });    // for ajax request
        } else {
            return res.redirect('user/professor/applications/all');           // for normal request
        }

    },

    accept_second_preference: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus2: "Offered" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "申請已被確認 Application has been accepted.", url: '/user/professor/applications/all' });    // for ajax request
        } else {
            return res.redirect('user/professor/applications/all');           // for normal request
        }
    },

    reject_third_preference: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus3: "Unsuccessful" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "申請已被拒絕 Application has been rejected.", url: '/user/professor/applications/all' });    // for ajax request
        } else {
            return res.redirect('user/professor/applications/all');           // for normal request
        }

    },

    accept_third_preference: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ programmeStatus3: "Offered" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "申請已被確認 Application has been accepted.", url: '/user/professor/applications/all' });    // for ajax request
        } else {
            return res.redirect('user/professor/applications/all');           // for normal request
        }
    },

    first_preference_interview: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ haveInterview1: "yes" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "An interview will be scheduled by Admissions Office shortly.", url: '/user/professor/applications/all' });    // for ajax request
        } else {
            return res.redirect('user/professor/applications/all');           // for normal request
        }
    },

    second_preference_interview: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ haveInterview2: "yes" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "An interview will be scheduled by Admissions Office shortly.", url: '/user/professor/applications/all' });    // for ajax request
        } else {
            return res.redirect('user/professor/applications/all');           // for normal request
        }
    },

    third_preference_interview: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ haveInterview3: "yes" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "An interview will be scheduled by Admissions Office shortly.", url: '/user/professor/applications/all' });    // for ajax request
        } else {
            return res.redirect('user/professor/applications/all');           // for normal request
        }
    },

    show_personalParticulars: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/professor/personalParticulars', { application: model });

    },

    show_academicProfile: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/professor/academicProfile', { application: model });

    },

    show_academicQualification: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/professor/academicQualification', { application: model });

    },

    show_academicReference: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/professor/academicReference', { application: model });

    },

    show_otherInformation: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/professor/otherInformation', { application: model });

    },

    profile: async function (req, res) {

        if (req.method == "GET") return res.view('user/professor/profile');
    },

    update_info: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            if (!model) return res.notFound();

            return res.view('/user/professor/profile', { user: model });

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

            return res.redirect('/user/professor/profile');
        }
    },

    accepted_applications: async function (req, res) {

        var models = await User.find({ where: { role: "student", status: 'approved' }, });

        var threeChoice = await User.count({
            where: {
                role: "student", status: 'approved', program2: { '!=': "" }, program3: { '!=': "" }
            },
        });

        var twoChoice = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', program2: { '!=': "" }, program3: "" },
                    { role: "student", status: 'approved', program2: "", program3: { '!=': "" } },
                ]
            },
        });

        var oneChoice = await User.count({
            where: {
                role: "student", status: 'approved', program2: "", program3: ""
            },
        });

        var all = threeChoice * 3 + twoChoice * 2 + oneChoice * 1;

        var allAccepted = await User.count({
            where: {
                role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: "Offered", programmeStatus3: "Offered"
            },
        });

        var twoAccepted = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: "Offered", programmeStatus3: { '!=': "Offered" } },
                    { role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: { '!=': "Offered" }, programmeStatus3: "Offered" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Offered" }, programmeStatus2: "Offered", programmeStatus3: "Offered" },
                ]
            },
        });

        var oneAccepted = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: { '!=': "Offered" }, programmeStatus3: { '!=': "Offered" } },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Offered" }, programmeStatus2: { '!=': "Offered" }, programmeStatus3: "Offered" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Offered" }, programmeStatus2: "Offered", programmeStatus3: { '!=': "Offered" } },
                ]
            },
        });

        var accepted = allAccepted * 3 + twoAccepted * 2 + oneAccepted;

        var allRejected = await User.count({
            where: {
                role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: "Unsuccessful", programmeStatus3: "Unsuccessful"
            },
        });

        var twoRejected = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: "Unsuccessful", programmeStatus3: { '!=': "Unsuccessful" } },
                    { role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: { '!=': "Unsuccessful" }, programmeStatus3: "Unsuccessful" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Unsuccessful" }, programmeStatus2: "Unsuccessful", programmeStatus3: "Unsuccessful" },
                ]
            },
        });

        var oneRejected = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: { '!=': "Unsuccessful" }, programmeStatus3: { '!=': "Unsuccessful" } },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Unsuccessful" }, programmeStatus2: { '!=': "Unsuccessful" }, programmeStatus3: "Unsuccessful" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Unsuccessful" }, programmeStatus2: "Unsuccessful", programmeStatus3: { '!=': "Unsuccessful" } },
                ]
            },
        });

        var rejected = allRejected * 3 + twoRejected * 2 + oneRejected;

        return res.view('user/professor/accepted', { applications: models, allNum: all, acceptedNum: accepted, rejectedNum: rejected });
    },

    rejected_applications: async function (req, res) {

        var models = await User.find({ where: { role: "student", status: 'approved' }, });

        var threeChoice = await User.count({
            where: {
                role: "student", status: 'approved', program2: { '!=': "" }, program3: { '!=': "" }
            },
        });

        var twoChoice = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', program2: { '!=': "" }, program3: "" },
                    { role: "student", status: 'approved', program2: "", program3: { '!=': "" } },
                ]
            },
        });

        var oneChoice = await User.count({
            where: {
                role: "student", status: 'approved', program2: "", program3: ""
            },
        });

        var all = threeChoice * 3 + twoChoice * 2 + oneChoice * 1;

        var allAccepted = await User.count({
            where: {
                role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: "Offered", programmeStatus3: "Offered"
            },
        });

        var twoAccepted = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: "Offered", programmeStatus3: { '!=': "Offered" } },
                    { role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: { '!=': "Offered" }, programmeStatus3: "Offered" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Offered" }, programmeStatus2: "Offered", programmeStatus3: "Offered" },
                ]
            },
        });

        var oneAccepted = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Offered", programmeStatus2: { '!=': "Offered" }, programmeStatus3: { '!=': "Offered" } },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Offered" }, programmeStatus2: { '!=': "Offered" }, programmeStatus3: "Offered" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Offered" }, programmeStatus2: "Offered", programmeStatus3: { '!=': "Offered" } },
                ]
            },
        });

        var accepted = allAccepted * 3 + twoAccepted * 2 + oneAccepted;

        var allRejected = await User.count({
            where: {
                role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: "Unsuccessful", programmeStatus3: "Unsuccessful"
            },
        });

        var twoRejected = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: "Unsuccessful", programmeStatus3: { '!=': "Unsuccessful" } },
                    { role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: { '!=': "Unsuccessful" }, programmeStatus3: "Unsuccessful" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Unsuccessful" }, programmeStatus2: "Unsuccessful", programmeStatus3: "Unsuccessful" },
                ]
            },
        });

        var oneRejected = await User.count({
            where: {
                or: [
                    { role: "student", status: 'approved', programmeStatus1: "Unsuccessful", programmeStatus2: { '!=': "Unsuccessful" }, programmeStatus3: { '!=': "Unsuccessful" } },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Unsuccessful" }, programmeStatus2: { '!=': "Unsuccessful" }, programmeStatus3: "Unsuccessful" },
                    { role: "student", status: 'approved', programmeStatus1: { '!=': "Unsuccessful" }, programmeStatus2: "Unsuccessful", programmeStatus3: { '!=': "Unsuccessful" } },
                ]
            },
        });

        var rejected = allRejected * 3 + twoRejected * 2 + oneRejected;
        return res.view('user/professor/rejected', { applications: models, allNum: all, acceptedNum: accepted, rejectedNum: rejected });
    },

    change_password: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            if (!model) return res.notFound();

            return res.view('/user/professor/profile', { user: model });

        } else {

            var user = await User.findOne(req.session.userId);

            const match = await sails.bcrypt.compare(req.body.currentPw, user.Password);

            if (!match) return res.status(401).send("Wrong Password");

            const hash = await sails.bcrypt.hash(req.body.Password, saltRounds);

            var model = await User.update(req.session.userId).set({
                Password: hash
            }).fetch();

            if (model.length == 0) return res.notFound();

            return res.redirect('/user/professor/profile');
        }
    },
};

