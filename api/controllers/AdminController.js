/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

sails.bcrypt = require('bcryptjs');
const saltRounds = 10;

const ProgramPreferenceController = require("./ProgramPreferenceController");
const PersonalParticularsController = require("./PersonalParticularsController");

module.exports = {

    searchAll: async function (req, res) {

        const qPage = Math.max(req.query.page - 1, 0) || 0;
        const numOfItemsPerPage = 10;

        const qApplication = req.query.sApplication || "";

        //result = events
        if (qApplication == "") {
            var result = await User.find({
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage,
                where: {
                    or: [
                        { role: "student", status: 'submitted' },
                        { role: "student", status: 'approved' },
                        { role: "student", status: 'disapproved' },
                    ]
                },
            });
        } else if (qApplication != "") {
            var result = await User.find({
                where: {
                    or: [
                        { role: "student", program1: { contains: qApplication }, status: 'submitted' },
                        { role: "student", program2: { contains: qApplication }, status: 'submitted' },
                        { role: "student", program3: { contains: qApplication }, status: 'submitted' },
                        { role: "student", program1: { contains: qApplication }, status: 'approved' },
                        { role: "student", program2: { contains: qApplication }, status: 'approved' },
                        { role: "student", program3: { contains: qApplication }, status: 'approved' },
                        { role: "student", program1: { contains: qApplication }, status: 'disapproved' },
                        { role: "student", program2: { contains: qApplication }, status: 'disapproved' },
                        { role: "student", program3: { contains: qApplication }, status: 'disapproved' },
                    ]
                },
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage,
            });
        }

        var numOfPage = Math.ceil(await User.count({
            where: { role: "student", or: [{ status: 'submitted' }, { status: 'approved' }, { status: 'disapproved' }] },
        }) / numOfItemsPerPage);

        //get the count of all applications
        var all = await User.count({
            where: {
                or: [
                    { role: "student", status: 'submitted' },
                    { role: "student", status: 'approved' },
                    { role: "student", status: 'disapproved' },
                ]
            },
        });

        var qall = await User.count({
            where: {
                or: [
                    { role: "student", program1: { contains: qApplication }, status: 'submitted' },
                    { role: "student", program2: { contains: qApplication }, status: 'submitted' },
                    { role: "student", program3: { contains: qApplication }, status: 'submitted' },
                    { role: "student", program1: { contains: qApplication }, status: 'approved' },
                    { role: "student", program2: { contains: qApplication }, status: 'approved' },
                    { role: "student", program3: { contains: qApplication }, status: 'approved' },
                    { role: "student", program1: { contains: qApplication }, status: 'disapproved' },
                    { role: "student", program2: { contains: qApplication }, status: 'disapproved' },
                    { role: "student", program3: { contains: qApplication }, status: 'disapproved' },
                ]
            },
        });

        //get the count of approved applications
        var approved = await User.count({ where: { role: "student", status: "approved" }, });

        //get the count of disapproved applications
        var disapproved = await User.count({ where: { role: "student", status: "disapproved" }, });

        return res.view('user/admin/applications', { applications: result, count: numOfPage, allNum: all, qallNum: qall, approvedNum: approved, disapprovedNum: disapproved });
    },

    send_email: async function (req, res) {

        if (req.method == "GET") {

            return res.view('user/admin/applications');

        } else {

            var student = await User.find({ idCode: req.body.sApplication });

            // for each student, send email

            await sails.helpers.sendSingleEmail({
                to: student.Email,
                from: sails.config.custom.mailgunFrom,
                subject: req.body.User.subject,
                html: req.body.User.content
            });

            if (req.wantsJSON) {
                return res.json({ message: "Message sent.", url: '/user/admin/applications/all/search' });    // for ajax request
            } else {
                return res.redirect('/user/admin/applications/all/search');           // for normal request
            }
        }
    },

    //search approved application
    approved_application: async function (req, res) {

        const qPage = Math.max(req.query.page - 1, 0) || 0;

        const numOfItemsPerPage = 10;

        const qApplication = req.query.sApplication || "";

        if (qApplication == "") {
            var result = await User.find({
                where: { role: "student", status: 'approved' },
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage,
            });

        } else if (qApplication != "") {
            var result = await User.find({
                where: {
                    or: [
                        { role: "student", program1: { contains: qApplication }, status: 'approved' },
                        { role: "student", program2: { contains: qApplication }, status: 'approved' },
                        { role: "student", program3: { contains: qApplication }, status: 'approved' },
                    ]
                },
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage,
            });
        }

        var numOfPage = Math.ceil(await User.count({
            where: { role: "student", status: 'approved' },
        }) / numOfItemsPerPage);

        //get the count of all applications
        var all = await User.count({
            where: {
                or: [
                    { role: "student", status: 'submitted' },
                    { role: "student", status: 'approved' },
                    { role: "student", status: 'disapproved' },
                ]
            },
        });

        //get the count of approved applications
        var approved = await User.count({ where: { role: "student", status: "approved" }, });

        var qapproved = await User.count({
            where: {
                or: [
                    { role: "student", program1: { contains: qApplication }, status: 'approved' },
                    { role: "student", program2: { contains: qApplication }, status: 'approved' },
                    { role: "student", program3: { contains: qApplication }, status: 'approved' },
                ]
            },
        });

        //get the count of disapproved applications
        var disapproved = await User.count({ where: { role: "student", status: "disapproved" }, });

        return res.view('user/admin/approved', { applications: result, count: numOfPage, allNum: all, approvedNum: approved, qapprovedNum: qapproved, disapprovedNum: disapproved });
    },

    //search disapproved application
    disapproved_application: async function (req, res) {

        const qPage = Math.max(req.query.page - 1, 0) || 0;

        const numOfItemsPerPage = 10;

        const qApplication = req.query.sApplication || "";

        if (qApplication == "") {
            var result = await User.find({
                where: { role: "student", status: 'disapproved' },
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage,
            });

        } else if (qApplication != "") {
            var result = await User.find({
                where: {
                    or: [
                        { role: "student", program1: { contains: qApplication }, status: 'disapproved' },
                        { role: "student", program2: { contains: qApplication }, status: 'disapproved' },
                        { role: "student", program3: { contains: qApplication }, status: 'disapproved' },
                    ]
                },
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage,
            });
        }

        var numOfPage = Math.ceil(await User.count({
            where: { role: "student", status: 'disapproved' },
        }) / numOfItemsPerPage);

        //get the count of all applications
        var all = await User.count({
            where: {
                or: [
                    { role: "student", status: 'submitted' },
                    { role: "student", status: 'approved' },
                    { role: "student", status: 'disapproved' },
                ]
            },
        });

        //get the count of approved applications
        var approved = await User.count({ where: { role: "student", status: "approved" }, });

        //get the count of disapproved applications
        var disapproved = await User.count({ where: { role: "student", status: "disapproved" }, });

        var qdisapproved = await User.count({
            where: {
                or: [
                    { role: "student", program1: { contains: qApplication }, status: 'disapproved' },
                    { role: "student", program2: { contains: qApplication }, status: 'disapproved' },
                    { role: "student", program3: { contains: qApplication }, status: 'disapproved' },
                ]
            },
        });

        return res.view('user/admin/disapproved', { applications: result, count: numOfPage, allNum: all, approvedNum: approved, disapprovedNum: disapproved, qdisapprovedNum: qdisapproved });
    },

    schedule_first_interview: async function (req, res) {

        if (req.method == "GET") {

            return res.view('user/admin/applications');

        } else {

            await User.update(req.params.id).set({
                firstInterviewDate: req.body.User.firstInterviewDate,
                firstInterviewTime: req.body.User.firstInterviewTime,
                firstInterviewLocation: req.body.User.firstInterviewLocation
            }).fetch();

            if (req.wantsJSON) {
                return res.json({ message: "Successfully schedule an interview.", url: '/user/admin/applications/all/search' });    // for ajax request
            } else {
                return res.redirect('/user/admin/applications/all/search');           // for normal request
            }
        }
    },

    schedule_second_interview: async function (req, res) {

        if (req.method == "GET") {

            return res.view('user/admin/applications');

        } else {

            await User.update(req.params.id).set({
                secondInterviewDate: req.body.User.secondInterviewDate,
                secondInterviewTime: req.body.User.secondInterviewTime,
                secondInterviewLocation: req.body.User.secondInterviewLocation
            }).fetch();

            if (req.wantsJSON) {
                return res.json({ message: "Successfully schedule an interview.", url: '/user/admin/applications/all/search' });    // for ajax request
            } else {
                return res.redirect('/user/admin/applications/all/search');           // for normal request
            }
        }
    },

    schedule_third_interview: async function (req, res) {

        if (req.method == "GET") {

            return res.view('user/admin/applications');

        } else {

            await User.update(req.params.id).set({
                thirdInterviewDate: req.body.User.thirdInterviewDate,
                thirdInterviewTime: req.body.User.thirdInterviewTime,
                thirdInterviewLocation: req.body.User.thirdInterviewLocation
            }).fetch();

            if (req.wantsJSON) {
                return res.json({ message: "Successfully schedule an interview.", url: '/user/admin/applications/all/search' });    // for ajax request
            } else {
                return res.redirect('/user/admin/applications/all/search');           // for normal request
            }
        }
    },

    sendEmail_first_interview: async function (req, res) {

        if (req.method == "GET") {

            return res.view('user/admin/applications');

        } else {

            await User.update(req.params.id).set({
                recipient1: req.body.User.recipient1,
                subject1: req.body.User.subject1,
                content1: req.body.User.content1,
            }).fetch();

            await sails.helpers.sendSingleEmail({
                to: req.body.User.recipient1,
                from: sails.config.custom.mailgunFrom,
                subject: req.body.User.subject1,
                html: req.body.User.content1
            });

            if (req.wantsJSON) {
                return res.json({ message: "Message sent.", url: '/user/admin/applications/all/search' });    // for ajax request
            } else {
                return res.redirect('/user/admin/applications/all/search');           // for normal request
            }
        }
    },


    sendEmail_second_interview: async function (req, res) {

        if (req.method == "GET") {

            return res.view('user/admin/applications');

        } else {

            await User.update(req.params.id).set({
                recipient2: req.body.User.recipient2,
                subject2: req.body.User.subject2,
                content2: req.body.User.content2,
            }).fetch();

            await sails.helpers.sendSingleEmail({
                to: req.body.User.recipient2,
                from: sails.config.custom.mailgunFrom,
                subject: req.body.User.subject2,
                html: req.body.User.content2
            });

            if (req.wantsJSON) {
                return res.json({ message: "Message sent.", url: '/user/admin/applications/all/search' });    // for ajax request
            } else {
                return res.redirect('/user/admin/applications/all/search');           // for normal request
            }
        }
    },

    sendEmail_third_interview: async function (req, res) {

        if (req.method == "GET") {

            return res.view('user/admin/applications');

        } else {

            await User.update(req.params.id).set({
                recipient3: req.body.User.recipient3,
                subject3: req.body.User.subject3,
                content3: req.body.User.content3,
            }).fetch();

            await sails.helpers.sendSingleEmail({
                to: req.body.User.recipient3,
                from: sails.config.custom.mailgunFrom,
                subject: req.body.User.subject3,
                html: req.body.User.content3
            });

            if (req.wantsJSON) {
                return res.json({ message: "Message sent.", url: '/user/admin/applications/all/search' });    // for ajax request
            } else {
                return res.redirect('/user/admin/applications/all/search');           // for normal request
            }
        }
    },

    disapprove: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ status: "disapproved" }).fetch();

        await User.update(req.params.id).set({ programmeStatus1: "Unsuccessful" }).fetch();

        await User.update(req.params.id).set({ programmeStatus2: "Unsuccessful" }).fetch();

        await User.update(req.params.id).set({ programmeStatus3: "Unsuccessful" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "申請已被拒絕 Application has been disapproved.", url: '/user/admin/applications/all/search' });    // for ajax request
        } else {
            return res.redirect('/user/admin/applications/all/search');           // for normal request
        }

    },

    approve: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        await User.update(req.params.id).set({ status: "approved" }).fetch();

        if (req.wantsJSON) {
            return res.json({ message: "申請已被確認 Application has been approved.", url: '/user/admin/applications/all/search' });    // for ajax request
        } else {
            return res.redirect('/user/admin/applications/all/search');           // for normal request
        }
    },

    show_personalParticulars: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/admin/personalParticulars', { application: model });

    },

    show_academicProfile: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/admin/academicProfile', { application: model });

    },

    show_academicQualification: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/admin/academicQualification', { application: model });

    },

    show_programmePreference: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/admin/programmePreference', { application: model });

    },

    show_academicReference: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/admin/academicReference', { application: model });

    },

    show_otherInformation: async function (req, res) {

        var model = await User.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('user/admin/otherInformation', { application: model });

    },

    email_list: async function (req, res) {

        if (req.method == "GET") return res.view('user/admin/emailContent', { emails: await Email.find() });
    },

    email_content: async function (req, res) {

        await Email.update(req.params.id).set({
            emailcontent: req.body.Email.emailcontent,
            emailtitle: req.body.Email.emailtitle
        }).fetch();

        return res.redirect('/user/admin/emailContent');
    },

    profile: async function (req, res) {

        if (req.method == "GET") return res.view('user/admin/profile');
    },

    update_info: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            if (!model) return res.notFound();

            return res.view('/user/admin/profile', { user: model });

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

            return res.redirect('/user/admin/profile');
        }
    },

    change_password: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            if (!model) return res.notFound();

            return res.view('/user/admin/profile', { user: model });

        } else {

            var user = await User.findOne(req.session.userId);

            const match = await sails.bcrypt.compare(req.body.currentPw, user.Password);

            if (!match) return res.status(401).send("Wrong Password");

            const hash = await sails.bcrypt.hash(req.body.Password, saltRounds);

            var model = await User.update(req.session.userId).set({
                Password: hash
            }).fetch();

            if (model.length == 0) return res.notFound();

            return res.redirect('/user/admin/profile');
        }
    },

    statistics: async function (req, res) {

        if (req.method == "GET") {

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

            var applications = threeChoice * 3 + twoChoice * 2 + oneChoice * 1;

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

            var underConsideration = applications - accepted - rejected;

            var all = await User.count({
                where: {
                    or: [
                        { role: "student", status: 'submitted' },
                        { role: "student", status: 'approved' },
                        { role: "student", status: 'disapproved' },
                    ]
                },
            });

            var pending = await User.count({ where: { role: "student", status: "submitted" }, });

            //get the count of approved applications
            var approved = await User.count({ where: { role: "student", status: "approved" }, });

            //get the count of disapproved applications
            var disapproved = await User.count({ where: { role: "student", status: "disapproved" }, });

            var BachelorOfArtsNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts", status: 'submitted' },
                        { program1: "Bachelor of Arts", status: 'approved' },
                        { program1: "Bachelor of Arts", status: 'disapproved' },
                        { program2: "Bachelor of Arts", status: 'submitted' },
                        { program2: "Bachelor of Arts", status: 'approved' },
                        { program2: "Bachelor of Arts", status: 'disapproved' },
                        { program3: "Bachelor of Arts", status: 'submitted' },
                        { program3: "Bachelor of Arts", status: 'approved' },
                        { program3: "Bachelor of Arts", status: 'disapproved' },
                    ]
                },
            });

            var ArtsCPWNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons) in Creative and Professional Writing", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons) in Creative and Professional Writing", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons) in Creative and Professional Writing", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons) in Creative and Professional Writing", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons) in Creative and Professional Writing", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons) in Creative and Professional Writing", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons) in Creative and Professional Writing", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons) in Creative and Professional Writing", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons) in Creative and Professional Writing", status: 'disapproved' },
                    ]
                },
            });

            var ArtsCLLNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons) in Chinese Language and Literature", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons) in Chinese Language and Literature", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons) in Chinese Language and Literature", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons) in Chinese Language and Literature", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons) in Chinese Language and Literature", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons) in Chinese Language and Literature", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons) in Chinese Language and Literature", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons) in Chinese Language and Literature", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons) in Chinese Language and Literature", status: 'disapproved' },
                    ]
                },
            });

            var ArtsELLNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons) in English Language and Literature", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons) in English Language and Literature", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons) in English Language and Literature", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons) in English Language and Literature", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons) in English Language and Literature", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons) in English Language and Literature", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons) in English Language and Literature", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons) in English Language and Literature", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons) in English Language and Literature", status: 'disapproved' },
                    ]
                },
            });

            var ArtsHumNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons) in Humanities", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons) in Humanities", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons) in Humanities", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons) in Humanities", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons) in Humanities", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons) in Humanities", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons) in Humanities", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons) in Humanities", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons) in Humanities", status: 'disapproved' },
                    ]
                },
            });

            var ArtsMusicNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons) in Music", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons) in Music", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons) in Music", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons) in Music", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons) in Music", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons) in Music", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons) in Music", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons) in Music", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons) in Music", status: 'disapproved' },
                    ]
                },
            });

            var ArtsRPENum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons) in Religion, Philosophy and Ethics", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons) in Religion, Philosophy and Ethics", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons) in Religion, Philosophy and Ethics", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons) in Religion, Philosophy and Ethics", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons) in Religion, Philosophy and Ethics", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons) in Religion, Philosophy and Ethics", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons) in Religion, Philosophy and Ethics", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons) in Religion, Philosophy and Ethics", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons) in Religion, Philosophy and Ethics", status: 'disapproved' },
                    ]
                },
            });

            var ArtsTransNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons) in Translation", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons) in Translation", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons) in Translation", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons) in Translation", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons) in Translation", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons) in Translation", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons) in Translation", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons) in Translation", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons) in Translation", status: 'disapproved' },
                    ]
                },
            });

            var ArtsCINum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons) in Creative Industries", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons) in Creative Industries", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons) in Creative Industries", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons) in Creative Industries", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons) in Creative Industries", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons) in Creative Industries", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons) in Creative Industries", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons) in Creative Industries", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons) in Creative Industries", status: 'disapproved' },
                    ]
                },
            });

            var ArtsVANum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons) in Visual Arts", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons) in Visual Arts", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons) in Visual Arts", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons) in Visual Arts", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons) in Visual Arts", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons) in Visual Arts", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons) in Visual Arts", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons) in Visual Arts", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons) in Visual Arts", status: 'disapproved' },
                    ]
                },
            });

            var BBANum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Business Administration (Honours)", status: 'submitted' },
                        { program1: "Bachelor of Business Administration (Honours)", status: 'approved' },
                        { program1: "Bachelor of Business Administration (Honours)", status: 'disapproved' },
                        { program2: "Bachelor of Business Administration (Honours)", status: 'submitted' },
                        { program2: "Bachelor of Business Administration (Honours)", status: 'approved' },
                        { program2: "Bachelor of Business Administration (Honours)", status: 'disapproved' },
                        { program3: "Bachelor of Business Administration (Honours)", status: 'submitted' },
                        { program3: "Bachelor of Business Administration (Honours)", status: 'approved' },
                        { program3: "Bachelor of Business Administration (Honours)", status: 'disapproved' },
                    ]
                },
            });

            var ACCTNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Business Administration (Hons)-Accounting Concentration", status: 'submitted' },
                        { program1: "Bachelor of Business Administration (Hons)-Accounting Concentration", status: 'approved' },
                        { program1: "Bachelor of Business Administration (Hons)-Accounting Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Business Administration (Hons)-Accounting Concentration", status: 'submitted' },
                        { program2: "Bachelor of Business Administration (Hons)-Accounting Concentration", status: 'approved' },
                        { program2: "Bachelor of Business Administration (Hons)-Accounting Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Business Administration (Hons)-Accounting Concentration", status: 'submitted' },
                        { program3: "Bachelor of Business Administration (Hons)-Accounting Concentration", status: 'approved' },
                        { program3: "Bachelor of Business Administration (Hons)-Accounting Concentration", status: 'disapproved' },
                    ]
                },
            });

            var ECONNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Business Administration (Hons)-Applied Economics Concentration", status: 'submitted' },
                        { program1: "Bachelor of Business Administration (Hons)-Applied Economics Concentration", status: 'approved' },
                        { program1: "Bachelor of Business Administration (Hons)-Applied Economics Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Business Administration (Hons)-Applied Economics Concentration", status: 'submitted' },
                        { program2: "Bachelor of Business Administration (Hons)-Applied Economics Concentration", status: 'approved' },
                        { program2: "Bachelor of Business Administration (Hons)-Applied Economics Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Business Administration (Hons)-Applied Economics Concentration", status: 'submitted' },
                        { program3: "Bachelor of Business Administration (Hons)-Applied Economics Concentration", status: 'approved' },
                        { program3: "Bachelor of Business Administration (Hons)-Applied Economics Concentration", status: 'disapproved' },
                    ]
                },
            });

            var BBAEntNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Business Administration (Hons)-Entrepreneurship Concentration", status: 'submitted' },
                        { program1: "Bachelor of Business Administration (Hons)-Entrepreneurship Concentration", status: 'approved' },
                        { program1: "Bachelor of Business Administration (Hons)-Entrepreneurship Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Business Administration (Hons)-Entrepreneurship Concentration", status: 'submitted' },
                        { program2: "Bachelor of Business Administration (Hons)-Entrepreneurship Concentration", status: 'approved' },
                        { program2: "Bachelor of Business Administration (Hons)-Entrepreneurship Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Business Administration (Hons)-Entrepreneurship Concentration", status: 'submitted' },
                        { program3: "Bachelor of Business Administration (Hons)-Entrepreneurship Concentration", status: 'approved' },
                        { program3: "Bachelor of Business Administration (Hons)-Entrepreneurship Concentration", status: 'disapproved' },
                    ]
                },
            });

            var BBAFinNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Business Administration (Hons)-Finance Concentration", status: 'submitted' },
                        { program1: "Bachelor of Business Administration (Hons)-Finance Concentration", status: 'approved' },
                        { program1: "Bachelor of Business Administration (Hons)-Finance Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Business Administration (Hons)-Finance Concentration", status: 'submitted' },
                        { program2: "Bachelor of Business Administration (Hons)-Finance Concentration", status: 'approved' },
                        { program2: "Bachelor of Business Administration (Hons)-Finance Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Business Administration (Hons)-Finance Concentration", status: 'submitted' },
                        { program3: "Bachelor of Business Administration (Hons)-Finance Concentration", status: 'approved' },
                        { program3: "Bachelor of Business Administration (Hons)-Finance Concentration", status: 'disapproved' },
                    ]
                },
            });

            var BBAHRNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Business Administration (Hons)-Human Resources Management Concentration", status: 'submitted' },
                        { program1: "Bachelor of Business Administration (Hons)-Human Resources Management Concentration", status: 'approved' },
                        { program1: "Bachelor of Business Administration (Hons)-Human Resources Management Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Business Administration (Hons)-Human Resources Management Concentration", status: 'submitted' },
                        { program2: "Bachelor of Business Administration (Hons)-Human Resources Management Concentration", status: 'approved' },
                        { program2: "Bachelor of Business Administration (Hons)-Human Resources Management Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Business Administration (Hons)-Human Resources Management Concentration", status: 'submitted' },
                        { program3: "Bachelor of Business Administration (Hons)-Human Resources Management Concentration", status: 'approved' },
                        { program3: "Bachelor of Business Administration (Hons)-Human Resources Management Concentration", status: 'disapproved' },
                    ]
                },
            });

            var BBAisemNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Business Administration (Hons)-Information Systems and e-Business Management Concentration", status: 'submitted' },
                        { program1: "Bachelor of Business Administration (Hons)-Information Systems and e-Business Management Concentration", status: 'approved' },
                        { program1: "Bachelor of Business Administration (Hons)-Information Systems and e-Business Management Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Business Administration (Hons)-Information Systems and e-Business Management Concentration", status: 'submitted' },
                        { program2: "Bachelor of Business Administration (Hons)-Information Systems and e-Business Management Concentration", status: 'approved' },
                        { program2: "Bachelor of Business Administration (Hons)-Information Systems and e-Business Management Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Business Administration (Hons)-Information Systems and e-Business Management Concentration", status: 'submitted' },
                        { program3: "Bachelor of Business Administration (Hons)-Information Systems and e-Business Management Concentration", status: 'approved' },
                        { program3: "Bachelor of Business Administration (Hons)-Information Systems and e-Business Management Concentration", status: 'disapproved' },
                    ]
                },
            });

            var BBAmarNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Business Administration (Hons) Marketing Concentration", status: 'submitted' },
                        { program1: "Bachelor of Business Administration (Hons) Marketing Concentration", status: 'approved' },
                        { program1: "Bachelor of Business Administration (Hons) Marketing Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Business Administration (Hons) Marketing Concentration", status: 'submitted' },
                        { program2: "Bachelor of Business Administration (Hons) Marketing Concentration", status: 'approved' },
                        { program2: "Bachelor of Business Administration (Hons) Marketing Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Business Administration (Hons) Marketing Concentration", status: 'submitted' },
                        { program3: "Bachelor of Business Administration (Hons) Marketing Concentration", status: 'approved' },
                        { program3: "Bachelor of Business Administration (Hons) Marketing Concentration", status: 'disapproved' },
                    ]
                },
            });

            var mediNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Chinese Medicine and Bachelor of Science (Honours) in Biomedical Science", status: 'submitted' },
                        { program1: "Bachelor of Chinese Medicine and Bachelor of Science (Honours) in Biomedical Science", status: 'approved' },
                        { program1: "Bachelor of Chinese Medicine and Bachelor of Science (Honours) in Biomedical Science", status: 'disapproved' },
                        { program2: "Bachelor of Chinese Medicine and Bachelor of Science (Honours) in Biomedical Science", status: 'submitted' },
                        { program2: "Bachelor of Chinese Medicine and Bachelor of Science (Honours) in Biomedical Science", status: 'approved' },
                        { program2: "Bachelor of Chinese Medicine and Bachelor of Science (Honours) in Biomedical Science", status: 'disapproved' },
                        { program3: "Bachelor of Chinese Medicine and Bachelor of Science (Honours) in Biomedical Science", status: 'submitted' },
                        { program3: "Bachelor of Chinese Medicine and Bachelor of Science (Honours) in Biomedical Science", status: 'approved' },
                        { program3: "Bachelor of Chinese Medicine and Bachelor of Science (Honours) in Biomedical Science", status: 'disapproved' },
                    ]
                },
            });

            var pharNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Pharmacy (Honours) in Chinese Medicine", status: 'submitted' },
                        { program1: "Bachelor of Pharmacy (Honours) in Chinese Medicine", status: 'approved' },
                        { program1: "Bachelor of Pharmacy (Honours) in Chinese Medicine", status: 'disapproved' },
                        { program2: "Bachelor of Pharmacy (Honours) in Chinese Medicine", status: 'submitted' },
                        { program2: "Bachelor of Pharmacy (Honours) in Chinese Medicine", status: 'approved' },
                        { program2: "Bachelor of Pharmacy (Honours) in Chinese Medicine", status: 'disapproved' },
                        { program3: "Bachelor of Pharmacy (Honours) in Chinese Medicine", status: 'submitted' },
                        { program3: "Bachelor of Pharmacy (Honours) in Chinese Medicine", status: 'approved' },
                        { program3: "Bachelor of Pharmacy (Honours) in Chinese Medicine", status: 'disapproved' },
                    ]
                },
            });

            var commAMNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Communication (Hons) in Film (Animation and Media Arts Concentration)", status: 'submitted' },
                        { program1: "Bachelor of Communication (Hons) in Film (Animation and Media Arts Concentration)", status: 'approved' },
                        { program1: "Bachelor of Communication (Hons) in Film (Animation and Media Arts Concentration)", status: 'disapproved' },
                        { program2: "Bachelor of Communication (Hons) in Film (Animation and Media Arts Concentration)", status: 'submitted' },
                        { program2: "Bachelor of Communication (Hons) in Film (Animation and Media Arts Concentration)", status: 'approved' },
                        { program2: "Bachelor of Communication (Hons) in Film (Animation and Media Arts Concentration)", status: 'disapproved' },
                        { program3: "Bachelor of Communication (Hons) in Film (Animation and Media Arts Concentration)", status: 'submitted' },
                        { program3: "Bachelor of Communication (Hons) in Film (Animation and Media Arts Concentration)", status: 'approved' },
                        { program3: "Bachelor of Communication (Hons) in Film (Animation and Media Arts Concentration)", status: 'disapproved' },
                    ]
                },
            });

            var commFTNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Communication (Hons) in Film (Film and Television Concentration)", status: 'submitted' },
                        { program1: "Bachelor of Communication (Hons) in Film (Film and Television Concentration)", status: 'approved' },
                        { program1: "Bachelor of Communication (Hons) in Film (Film and Television Concentration)", status: 'disapproved' },
                        { program2: "Bachelor of Communication (Hons) in Film (Film and Television Concentration)", status: 'submitted' },
                        { program2: "Bachelor of Communication (Hons) in Film (Film and Television Concentration)", status: 'approved' },
                        { program2: "Bachelor of Communication (Hons) in Film (Film and Television Concentration)", status: 'disapproved' },
                        { program3: "Bachelor of Communication (Hons) in Film (Film and Television Concentration)", status: 'submitted' },
                        { program3: "Bachelor of Communication (Hons) in Film (Film and Television Concentration)", status: 'approved' },
                        { program3: "Bachelor of Communication (Hons) in Film (Film and Television Concentration)", status: 'disapproved' },
                    ]
                },
            });

            var JournNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Communication (Hons) in Journalism", status: 'submitted' },
                        { program1: "Bachelor of Communication (Hons) in Journalism", status: 'approved' },
                        { program1: "Bachelor of Communication (Hons) in Journalism", status: 'disapproved' },
                        { program2: "Bachelor of Communication (Hons) in Journalism", status: 'submitted' },
                        { program2: "Bachelor of Communication (Hons) in Journalism", status: 'approved' },
                        { program2: "Bachelor of Communication (Hons) in Journalism", status: 'disapproved' },
                        { program3: "Bachelor of Communication (Hons) in Journalism", status: 'submitted' },
                        { program3: "Bachelor of Communication (Hons) in Journalism", status: 'approved' },
                        { program3: "Bachelor of Communication (Hons) in Journalism", status: 'disapproved' },
                    ]
                },
            });

            var commJDMNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Communication (Hons) in Journalism and Digital Media", status: 'submitted' },
                        { program1: "Bachelor of Communication (Hons) in Journalism and Digital Media", status: 'approved' },
                        { program1: "Bachelor of Communication (Hons) in Journalism and Digital Media", status: 'disapproved' },
                        { program2: "Bachelor of Communication (Hons) in Journalism and Digital Media", status: 'submitted' },
                        { program2: "Bachelor of Communication (Hons) in Journalism and Digital Media", status: 'approved' },
                        { program2: "Bachelor of Communication (Hons) in Journalism and Digital Media", status: 'disapproved' },
                        { program3: "Bachelor of Communication (Hons) in Journalism and Digital Media", status: 'submitted' },
                        { program3: "Bachelor of Communication (Hons) in Journalism and Digital Media", status: 'approved' },
                        { program3: "Bachelor of Communication (Hons) in Journalism and Digital Media", status: 'disapproved' },
                    ]
                },
            });

            var commCJNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Communication (Hons) in Journalism (Chinese Journalism Concentration)", status: 'submitted' },
                        { program1: "Bachelor of Communication (Hons) in Journalism (Chinese Journalism Concentration)", status: 'approved' },
                        { program1: "Bachelor of Communication (Hons) in Journalism (Chinese Journalism Concentration)", status: 'disapproved' },
                        { program2: "Bachelor of Communication (Hons) in Journalism (Chinese Journalism Concentration)", status: 'submitted' },
                        { program2: "Bachelor of Communication (Hons) in Journalism (Chinese Journalism Concentration)", status: 'approved' },
                        { program2: "Bachelor of Communication (Hons) in Journalism (Chinese Journalism Concentration)", status: 'disapproved' },
                        { program3: "Bachelor of Communication (Hons) in Journalism (Chinese Journalism Concentration)", status: 'submitted' },
                        { program3: "Bachelor of Communication (Hons) in Journalism (Chinese Journalism Concentration)", status: 'approved' },
                        { program3: "Bachelor of Communication (Hons) in Journalism (Chinese Journalism Concentration)", status: 'disapproved' },
                    ]
                },
            });

            var commDMCNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Communication (Hons) in Journalism (Data and Media Communication Concentration)", status: 'submitted' },
                        { program1: "Bachelor of Communication (Hons) in Journalism (Data and Media Communication Concentration)", status: 'approved' },
                        { program1: "Bachelor of Communication (Hons) in Journalism (Data and Media Communication Concentration)", status: 'disapproved' },
                        { program2: "Bachelor of Communication (Hons) in Journalism (Data and Media Communication Concentration)", status: 'submitted' },
                        { program2: "Bachelor of Communication (Hons) in Journalism (Data and Media Communication Concentration)", status: 'approved' },
                        { program2: "Bachelor of Communication (Hons) in Journalism (Data and Media Communication Concentration)", status: 'disapproved' },
                        { program3: "Bachelor of Communication (Hons) in Journalism (Data and Media Communication Concentration)", status: 'submitted' },
                        { program3: "Bachelor of Communication (Hons) in Journalism (Data and Media Communication Concentration)", status: 'approved' },
                        { program3: "Bachelor of Communication (Hons) in Journalism (Data and Media Communication Concentration)", status: 'disapproved' },
                    ]
                },
            });

            var PRNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising", status: 'submitted' },
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising", status: 'approved' },
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising", status: 'disapproved' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising", status: 'submitted' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising", status: 'approved' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising", status: 'disapproved' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising", status: 'submitted' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising", status: 'approved' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising", status: 'disapproved' },
                    ]
                },
            });

            var AGSNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Fine Arts (Hons) in Acting for Global Screen", status: 'submitted' },
                        { program1: "Bachelor of Fine Arts (Hons) in Acting for Global Screen", status: 'approved' },
                        { program1: "Bachelor of Fine Arts (Hons) in Acting for Global Screen", status: 'disapproved' },
                        { program2: "Bachelor of Fine Arts (Hons) in Acting for Global Screen", status: 'submitted' },
                        { program2: "Bachelor of Fine Arts (Hons) in Acting for Global Screen", status: 'approved' },
                        { program2: "Bachelor of Fine Arts (Hons) in Acting for Global Screen", status: 'disapproved' },
                        { program3: "Bachelor of Fine Arts (Hons) in Acting for Global Screen", status: 'submitted' },
                        { program3: "Bachelor of Fine Arts (Hons) in Acting for Global Screen", status: 'approved' },
                        { program3: "Bachelor of Fine Arts (Hons) in Acting for Global Screen", status: 'disapproved' },
                    ]
                },
            });

            var commIJNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Communication (Hons) in Journalism (International Journalism Concentration)", status: 'submitted' },
                        { program1: "Bachelor of Communication (Hons) in Journalism (International Journalism Concentration)", status: 'approved' },
                        { program1: "Bachelor of Communication (Hons) in Journalism (International Journalism Concentration)", status: 'disapproved' },
                        { program2: "Bachelor of Communication (Hons) in Journalism (International Journalism Concentration)", status: 'submitted' },
                        { program2: "Bachelor of Communication (Hons) in Journalism (International Journalism Concentration)", status: 'approved' },
                        { program2: "Bachelor of Communication (Hons) in Journalism (International Journalism Concentration)", status: 'disapproved' },
                        { program3: "Bachelor of Communication (Hons) in Journalism (International Journalism Concentration)", status: 'submitted' },
                        { program3: "Bachelor of Communication (Hons) in Journalism (International Journalism Concentration)", status: 'approved' },
                        { program3: "Bachelor of Communication (Hons) in Journalism (International Journalism Concentration)", status: 'disapproved' },
                    ]
                },
            });

            var commABNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising (Advertising and Branding Concentration)", status: 'submitted' },
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising (Advertising and Branding Concentration)", status: 'approved' },
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising (Advertising and Branding Concentration)", status: 'disapproved' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising (Advertising and Branding Concentration)", status: 'submitted' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising (Advertising and Branding Concentration)", status: 'approved' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising (Advertising and Branding Concentration)", status: 'disapproved' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising (Advertising and Branding Concentration)", status: 'submitted' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising (Advertising and Branding Concentration)", status: 'approved' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising (Advertising and Branding Concentration)", status: 'disapproved' },
                    ]
                },
            });

            var commOCNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising (Organizational Communication Concentration)", status: 'submitted' },
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising (Organizational Communication Concentration)", status: 'approved' },
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising (Organizational Communication Concentration)", status: 'disapproved' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising (Organizational Communication Concentration)", status: 'submitted' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising (Organizational Communication Concentration)", status: 'approved' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising (Organizational Communication Concentration)", status: 'disapproved' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising (Organizational Communication Concentration)", status: 'submitted' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising (Organizational Communication Concentration)", status: 'approved' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising (Organizational Communication Concentration)", status: 'disapproved' },
                    ]
                },
            });

            var commPRNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising (Public Relations Concentration)", status: 'submitted' },
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising (Public Relations Concentration)", status: 'approved' },
                        { program1: "Bachelor of Communication (Hons) in Public Relations and Advertising (Public Relations Concentration)", status: 'disapproved' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising (Public Relations Concentration)", status: 'submitted' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising (Public Relations Concentration)", status: 'approved' },
                        { program2: "Bachelor of Communication (Hons) in Public Relations and Advertising (Public Relations Concentration)", status: 'disapproved' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising (Public Relations Concentration)", status: 'submitted' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising (Public Relations Concentration)", status: 'approved' },
                        { program3: "Bachelor of Communication (Hons) in Public Relations and Advertising (Public Relations Concentration)", status: 'disapproved' },
                    ]
                },
            });

            var BSCNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Honours)", status: 'submitted' },
                        { program1: "Bachelor of Science (Honours)", status: 'approved' },
                        { program1: "Bachelor of Science (Honours)", status: 'disapproved' },
                        { program2: "Bachelor of Science (Honours)", status: 'submitted' },
                        { program2: "Bachelor of Science (Honours)", status: 'approved' },
                        { program2: "Bachelor of Science (Honours)", status: 'disapproved' },
                        { program3: "Bachelor of Science (Honours)", status: 'submitted' },
                        { program3: "Bachelor of Science (Honours)", status: 'approved' },
                        { program3: "Bachelor of Science (Honours)", status: 'disapproved' },
                    ]
                },
            });

            var ATSNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Hons) in Analytical and Testing Sciences", status: 'submitted' },
                        { program1: "Bachelor of Science (Hons) in Analytical and Testing Sciences", status: 'approved' },
                        { program1: "Bachelor of Science (Hons) in Analytical and Testing Sciences", status: 'disapproved' },
                        { program2: "Bachelor of Science (Hons) in Analytical and Testing Sciences", status: 'submitted' },
                        { program2: "Bachelor of Science (Hons) in Analytical and Testing Sciences", status: 'approved' },
                        { program2: "Bachelor of Science (Hons) in Analytical and Testing Sciences", status: 'disapproved' },
                        { program3: "Bachelor of Science (Hons) in Analytical and Testing Sciences", status: 'submitted' },
                        { program3: "Bachelor of Science (Hons) in Analytical and Testing Sciences", status: 'approved' },
                        { program3: "Bachelor of Science (Hons) in Analytical and Testing Sciences", status: 'disapproved' },
                    ]
                },
            });

            var BiotechNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Hons) in Applied Biology-Biotechnology Concentration", status: 'submitted' },
                        { program1: "Bachelor of Science (Hons) in Applied Biology-Biotechnology Concentration", status: 'approved' },
                        { program1: "Bachelor of Science (Hons) in Applied Biology-Biotechnology Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Science (Hons) in Applied Biology-Biotechnology Concentration", status: 'submitted' },
                        { program2: "Bachelor of Science (Hons) in Applied Biology-Biotechnology Concentration", status: 'approved' },
                        { program2: "Bachelor of Science (Hons) in Applied Biology-Biotechnology Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Science (Hons) in Applied Biology-Biotechnology Concentration", status: 'submitted' },
                        { program3: "Bachelor of Science (Hons) in Applied Biology-Biotechnology Concentration", status: 'approved' },
                        { program3: "Bachelor of Science (Hons) in Applied Biology-Biotechnology Concentration", status: 'disapproved' },
                    ]
                },
            });

            var BioEnvNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Hons) in Applied Biology-Environmental Science Concentration", status: 'submitted' },
                        { program1: "Bachelor of Science (Hons) in Applied Biology-Environmental Science Concentration", status: 'approved' },
                        { program1: "Bachelor of Science (Hons) in Applied Biology-Environmental Science Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Science (Hons) in Applied Biology-Environmental Science Concentration", status: 'submitted' },
                        { program2: "Bachelor of Science (Hons) in Applied Biology-Environmental Science Concentration", status: 'approved' },
                        { program2: "Bachelor of Science (Hons) in Applied Biology-Environmental Science Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Science (Hons) in Applied Biology-Environmental Science Concentration", status: 'submitted' },
                        { program3: "Bachelor of Science (Hons) in Applied Biology-Environmental Science Concentration", status: 'approved' },
                        { program3: "Bachelor of Science (Hons) in Applied Biology-Environmental Science Concentration", status: 'disapproved' },
                    ]
                },
            });

            var BCDANum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Hons) in Business Computing and Data Analytics", status: 'submitted' },
                        { program1: "Bachelor of Science (Hons) in Business Computing and Data Analytics", status: 'approved' },
                        { program1: "Bachelor of Science (Hons) in Business Computing and Data Analytics", status: 'disapproved' },
                        { program2: "Bachelor of Science (Hons) in Business Computing and Data Analytics", status: 'submitted' },
                        { program2: "Bachelor of Science (Hons) in Business Computing and Data Analytics", status: 'approved' },
                        { program2: "Bachelor of Science (Hons) in Business Computing and Data Analytics", status: 'disapproved' },
                        { program3: "Bachelor of Science (Hons) in Business Computing and Data Analytics", status: 'submitted' },
                        { program3: "Bachelor of Science (Hons) in Business Computing and Data Analytics", status: 'approved' },
                        { program3: "Bachelor of Science (Hons) in Business Computing and Data Analytics", status: 'disapproved' },
                    ]
                },
            });

            var BASNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Hons) in Bioresource and Agricultural Science", status: 'submitted' },
                        { program1: "Bachelor of Science (Hons) in Bioresource and Agricultural Science", status: 'approved' },
                        { program1: "Bachelor of Science (Hons) in Bioresource and Agricultural Science", status: 'disapproved' },
                        { program2: "Bachelor of Science (Hons) in Bioresource and Agricultural Science", status: 'submitted' },
                        { program2: "Bachelor of Science (Hons) in Bioresource and Agricultural Science", status: 'approved' },
                        { program2: "Bachelor of Science (Hons) in Bioresource and Agricultural Science", status: 'disapproved' },
                        { program3: "Bachelor of Science (Hons) in Bioresource and Agricultural Science", status: 'submitted' },
                        { program3: "Bachelor of Science (Hons) in Bioresource and Agricultural Science", status: 'approved' },
                        { program3: "Bachelor of Science (Hons) in Bioresource and Agricultural Science", status: 'disapproved' },
                    ]
                },
            });

            var ChemNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Hons) in Chemistry", status: 'submitted' },
                        { program1: "Bachelor of Science (Hons) in Chemistry", status: 'approved' },
                        { program1: "Bachelor of Science (Hons) in Chemistry", status: 'disapproved' },
                        { program2: "Bachelor of Science (Hons) in Chemistry", status: 'submitted' },
                        { program2: "Bachelor of Science (Hons) in Chemistry", status: 'approved' },
                        { program2: "Bachelor of Science (Hons) in Chemistry", status: 'disapproved' },
                        { program3: "Bachelor of Science (Hons) in Chemistry", status: 'submitted' },
                        { program3: "Bachelor of Science (Hons) in Chemistry", status: 'approved' },
                        { program3: "Bachelor of Science (Hons) in Chemistry", status: 'disapproved' },
                    ]
                },
            });

            var CSTNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Hons) in Computer Science-Computing and Software Technologies Concentration", status: 'submitted' },
                        { program1: "Bachelor of Science (Hons) in Computer Science-Computing and Software Technologies Concentration", status: 'approved' },
                        { program1: "Bachelor of Science (Hons) in Computer Science-Computing and Software Technologies Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Science (Hons) in Computer Science-Computing and Software Technologies Concentration", status: 'submitted' },
                        { program2: "Bachelor of Science (Hons) in Computer Science-Computing and Software Technologies Concentration", status: 'approved' },
                        { program2: "Bachelor of Science (Hons) in Computer Science-Computing and Software Technologies Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Science (Hons) in Computer Science-Computing and Software Technologies Concentration", status: 'submitted' },
                        { program3: "Bachelor of Science (Hons) in Computer Science-Computing and Software Technologies Concentration", status: 'approved' },
                        { program3: "Bachelor of Science (Hons) in Computer Science-Computing and Software Technologies Concentration", status: 'disapproved' },
                    ]
                },
            });

            var DMCNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Hons) in Computer Science-Data and Media Communication Concentration", status: 'submitted' },
                        { program1: "Bachelor of Science (Hons) in Computer Science-Data and Media Communication Concentration", status: 'approved' },
                        { program1: "Bachelor of Science (Hons) in Computer Science-Data and Media Communication Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Science (Hons) in Computer Science-Data and Media Communication Concentration", status: 'submitted' },
                        { program2: "Bachelor of Science (Hons) in Computer Science-Data and Media Communication Concentration", status: 'approved' },
                        { program2: "Bachelor of Science (Hons) in Computer Science-Data and Media Communication Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Science (Hons) in Computer Science-Data and Media Communication Concentration", status: 'submitted' },
                        { program3: "Bachelor of Science (Hons) in Computer Science-Data and Media Communication Concentration", status: 'approved' },
                        { program3: "Bachelor of Science (Hons) in Computer Science-Data and Media Communication Concentration", status: 'disapproved' },
                    ]
                },
            });

            var ISANum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Hons) in Computer Science-Information Systems and Analytics Concentration", status: 'submitted' },
                        { program1: "Bachelor of Science (Hons) in Computer Science-Information Systems and Analytics Concentration", status: 'approved' },
                        { program1: "Bachelor of Science (Hons) in Computer Science-Information Systems and Analytics Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Science (Hons) in Computer Science-Information Systems and Analytics Concentration", status: 'submitted' },
                        { program2: "Bachelor of Science (Hons) in Computer Science-Information Systems and Analytics Concentration", status: 'approved' },
                        { program2: "Bachelor of Science (Hons) in Computer Science-Information Systems and Analytics Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Science (Hons) in Computer Science-Information Systems and Analytics Concentration", status: 'submitted' },
                        { program3: "Bachelor of Science (Hons) in Computer Science-Information Systems and Analytics Concentration", status: 'approved' },
                        { program3: "Bachelor of Science (Hons) in Computer Science-Information Systems and Analytics Concentration", status: 'disapproved' },
                    ]
                },
            });

            var MathsNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Hons) in Mathematics and Statistics", status: 'submitted' },
                        { program1: "Bachelor of Science (Hons) in Mathematics and Statistics", status: 'approved' },
                        { program1: "Bachelor of Science (Hons) in Mathematics and Statistics", status: 'disapproved' },
                        { program2: "Bachelor of Science (Hons) in Mathematics and Statistics", status: 'submitted' },
                        { program2: "Bachelor of Science (Hons) in Mathematics and Statistics", status: 'approved' },
                        { program2: "Bachelor of Science (Hons) in Mathematics and Statistics", status: 'disapproved' },
                        { program3: "Bachelor of Science (Hons) in Mathematics and Statistics", status: 'submitted' },
                        { program3: "Bachelor of Science (Hons) in Mathematics and Statistics", status: 'approved' },
                        { program3: "Bachelor of Science (Hons) in Mathematics and Statistics", status: 'disapproved' },
                    ]
                },
            });

            var PhyNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Science (Hons) in Physics and Green Energy", status: 'submitted' },
                        { program1: "Bachelor of Science (Hons) in Physics and Green Energy", status: 'approved' },
                        { program1: "Bachelor of Science (Hons) in Physics and Green Energy", status: 'disapproved' },
                        { program2: "Bachelor of Science (Hons) in Physics and Green Energy", status: 'submitted' },
                        { program2: "Bachelor of Science (Hons) in Physics and Green Energy", status: 'approved' },
                        { program2: "Bachelor of Science (Hons) in Physics and Green Energy", status: 'disapproved' },
                        { program3: "Bachelor of Science (Hons) in Physics and Green Energy", status: 'submitted' },
                        { program3: "Bachelor of Science (Hons) in Physics and Green Energy", status: 'approved' },
                        { program3: "Bachelor of Science (Hons) in Physics and Green Energy", status: 'disapproved' },
                    ]
                },
            });

            var PENum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons) in Physical Education and Recreation Management", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons) in Physical Education and Recreation Management", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons) in Physical Education and Recreation Management", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons) in Physical Education and Recreation Management", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons) in Physical Education and Recreation Management", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons) in Physical Education and Recreation Management", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons) in Physical Education and Recreation Management", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons) in Physical Education and Recreation Management", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons) in Physical Education and Recreation Management", status: 'disapproved' },
                    ]
                },
            });

            var GISNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons)/ Bachelor of Social Sciences (Hons) (Geography/ Government and International Studies/ History/ Sociology)", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons)/ Bachelor of Social Sciences (Hons) (Geography/ Government and International Studies/ History/ Sociology)", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons)/ Bachelor of Social Sciences (Hons) (Geography/ Government and International Studies/ History/ Sociology)", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons)/ Bachelor of Social Sciences (Hons) (Geography/ Government and International Studies/ History/ Sociology)", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons)/ Bachelor of Social Sciences (Hons) (Geography/ Government and International Studies/ History/ Sociology)", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons)/ Bachelor of Social Sciences (Hons) (Geography/ Government and International Studies/ History/ Sociology)", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons)/ Bachelor of Social Sciences (Hons) (Geography/ Government and International Studies/ History/ Sociology)", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons)/ Bachelor of Social Sciences (Hons) (Geography/ Government and International Studies/ History/ Sociology)", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons)/ Bachelor of Social Sciences (Hons) (Geography/ Government and International Studies/ History/ Sociology)", status: 'disapproved' },
                    ]
                },
            });

            var SWNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Social Work (Hons)", status: 'submitted' },
                        { program1: "Bachelor of Social Work (Hons)", status: 'approved' },
                        { program1: "Bachelor of Social Work (Hons)", status: 'disapproved' },
                        { program2: "Bachelor of Social Work (Hons)", status: 'submitted' },
                        { program2: "Bachelor of Social Work (Hons)", status: 'approved' },
                        { program2: "Bachelor of Social Work (Hons)", status: 'disapproved' },
                        { program3: "Bachelor of Social Work (Hons)", status: 'submitted' },
                        { program3: "Bachelor of Social Work (Hons)", status: 'approved' },
                        { program3: "Bachelor of Social Work (Hons)", status: 'disapproved' },
                    ]
                },
            });

            var HisNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Arts (Hons) in History", status: 'submitted' },
                        { program1: "Bachelor of Arts (Hons) in History", status: 'approved' },
                        { program1: "Bachelor of Arts (Hons) in History", status: 'disapproved' },
                        { program2: "Bachelor of Arts (Hons) in History", status: 'submitted' },
                        { program2: "Bachelor of Arts (Hons) in History", status: 'approved' },
                        { program2: "Bachelor of Arts (Hons) in History", status: 'disapproved' },
                        { program3: "Bachelor of Arts (Hons) in History", status: 'submitted' },
                        { program3: "Bachelor of Arts (Hons) in History", status: 'approved' },
                        { program3: "Bachelor of Arts (Hons) in History", status: 'disapproved' },
                    ]
                },
            });

            var BssCSENum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Social Sciences (Hons) in China Studies-Economics Concentration", status: 'submitted' },
                        { program1: "Bachelor of Social Sciences (Hons) in China Studies-Economics Concentration", status: 'approved' },
                        { program1: "Bachelor of Social Sciences (Hons) in China Studies-Economics Concentration", status: 'disapproved' },
                        { program2: "Bachelor of Social Sciences (Hons) in China Studies-Economics Concentration", status: 'submitted' },
                        { program2: "Bachelor of Social Sciences (Hons) in China Studies-Economics Concentration", status: 'approved' },
                        { program2: "Bachelor of Social Sciences (Hons) in China Studies-Economics Concentration", status: 'disapproved' },
                        { program3: "Bachelor of Social Sciences (Hons) in China Studies-Economics Concentration", status: 'submitted' },
                        { program3: "Bachelor of Social Sciences (Hons) in China Studies-Economics Concentration", status: 'approved' },
                        { program3: "Bachelor of Social Sciences (Hons) in China Studies-Economics Concentration", status: 'disapproved' },
                    ]
                },
            });

            var BssESFNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Social Sciences (Hons) in European Studies-French Stream", status: 'submitted' },
                        { program1: "Bachelor of Social Sciences (Hons) in European Studies-French Stream", status: 'approved' },
                        { program1: "Bachelor of Social Sciences (Hons) in European Studies-French Stream", status: 'disapproved' },
                        { program2: "Bachelor of Social Sciences (Hons) in European Studies-French Stream", status: 'submitted' },
                        { program2: "Bachelor of Social Sciences (Hons) in European Studies-French Stream", status: 'approved' },
                        { program2: "Bachelor of Social Sciences (Hons) in European Studies-French Stream", status: 'disapproved' },
                        { program3: "Bachelor of Social Sciences (Hons) in European Studies-French Stream", status: 'submitted' },
                        { program3: "Bachelor of Social Sciences (Hons) in European Studies-French Stream", status: 'approved' },
                        { program3: "Bachelor of Social Sciences (Hons) in European Studies-French Stream", status: 'disapproved' },
                    ]
                },
            });

            var BssESGNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Social Sciences (Hons) in European Studies-German Stream", status: 'submitted' },
                        { program1: "Bachelor of Social Sciences (Hons) in European Studies-German Stream", status: 'approved' },
                        { program1: "Bachelor of Social Sciences (Hons) in European Studies-German Stream", status: 'disapproved' },
                        { program2: "Bachelor of Social Sciences (Hons) in European Studies-German Stream", status: 'submitted' },
                        { program2: "Bachelor of Social Sciences (Hons) in European Studies-German Stream", status: 'approved' },
                        { program2: "Bachelor of Social Sciences (Hons) in European Studies-German Stream", status: 'disapproved' },
                        { program3: "Bachelor of Social Sciences (Hons) in European Studies-German Stream", status: 'submitted' },
                        { program3: "Bachelor of Social Sciences (Hons) in European Studies-German Stream", status: 'approved' },
                        { program3: "Bachelor of Social Sciences (Hons) in European Studies-German Stream", status: 'disapproved' },
                    ]
                },
            });

            var BssGCSNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Social Sciences (Hons) in Global and China Studies", status: 'submitted' },
                        { program1: "Bachelor of Social Sciences (Hons) in Global and China Studies", status: 'approved' },
                        { program1: "Bachelor of Social Sciences (Hons) in Global and China Studies", status: 'disapproved' },
                        { program2: "Bachelor of Social Sciences (Hons) in Global and China Studies", status: 'submitted' },
                        { program2: "Bachelor of Social Sciences (Hons) in Global and China Studies", status: 'approved' },
                        { program2: "Bachelor of Social Sciences (Hons) in Global and China Studies", status: 'disapproved' },
                        { program3: "Bachelor of Social Sciences (Hons) in Global and China Studies", status: 'submitted' },
                        { program3: "Bachelor of Social Sciences (Hons) in Global and China Studies", status: 'approved' },
                        { program3: "Bachelor of Social Sciences (Hons) in Global and China Studies", status: 'disapproved' },
                    ]
                },
            });

            var GeogNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Social Sciences (Hons) in Geography", status: 'submitted' },
                        { program1: "Bachelor of Social Sciences (Hons) in Geography", status: 'approved' },
                        { program1: "Bachelor of Social Sciences (Hons) in Geography", status: 'disapproved' },
                        { program2: "Bachelor of Social Sciences (Hons) in Geography", status: 'submitted' },
                        { program2: "Bachelor of Social Sciences (Hons) in Geography", status: 'approved' },
                        { program2: "Bachelor of Social Sciences (Hons) in Geography", status: 'disapproved' },
                        { program3: "Bachelor of Social Sciences (Hons) in Geography", status: 'submitted' },
                        { program3: "Bachelor of Social Sciences (Hons) in Geography", status: 'approved' },
                        { program3: "Bachelor of Social Sciences (Hons) in Geography", status: 'disapproved' },
                    ]
                },
            });

            var BssGISNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Social Sciences (Hons) in Government and International Studies", status: 'submitted' },
                        { program1: "Bachelor of Social Sciences (Hons) in Government and International Studies", status: 'approved' },
                        { program1: "Bachelor of Social Sciences (Hons) in Government and International Studies", status: 'disapproved' },
                        { program2: "Bachelor of Social Sciences (Hons) in Government and International Studies", status: 'submitted' },
                        { program2: "Bachelor of Social Sciences (Hons) in Government and International Studies", status: 'approved' },
                        { program2: "Bachelor of Social Sciences (Hons) in Government and International Studies", status: 'disapproved' },
                        { program3: "Bachelor of Social Sciences (Hons) in Government and International Studies", status: 'submitted' },
                        { program3: "Bachelor of Social Sciences (Hons) in Government and International Studies", status: 'approved' },
                        { program3: "Bachelor of Social Sciences (Hons) in Government and International Studies", status: 'disapproved' },
                    ]
                },
            });

            var SocNum = await User.count({
                where: {
                    or: [
                        { program1: "Bachelor of Social Sciences (Hons) in Sociology", status: 'submitted' },
                        { program1: "Bachelor of Social Sciences (Hons) in Sociology", status: 'approved' },
                        { program1: "Bachelor of Social Sciences (Hons) in Sociology", status: 'disapproved' },
                        { program2: "Bachelor of Social Sciences (Hons) in Sociology", status: 'submitted' },
                        { program2: "Bachelor of Social Sciences (Hons) in Sociology", status: 'approved' },
                        { program2: "Bachelor of Social Sciences (Hons) in Sociology", status: 'disapproved' },
                        { program3: "Bachelor of Social Sciences (Hons) in Sociology", status: 'submitted' },
                        { program3: "Bachelor of Social Sciences (Hons) in Sociology", status: 'approved' },
                        { program3: "Bachelor of Social Sciences (Hons) in Sociology", status: 'disapproved' },
                    ]
                },
            });


            return res.view('user/admin/statistics', {
                applicationNum: applications, allNum: all, pendingNum: pending, approvedNum: approved, 
                disapprovedNum: disapproved, underConsiderationNum: underConsideration, acceptedNum: accepted, rejectedNum: rejected,
                BachelorOfArts: BachelorOfArtsNum, ArtsCPW: ArtsCPWNum, ArtsCLL: ArtsCLLNum,
                ArtsELL: ArtsELLNum, ArtsHum: ArtsHumNum,
                ArtsMusic: ArtsMusicNum, ArtsRPE: ArtsRPENum, ArtsTrans: ArtsTransNum, ArtsCI: ArtsCINum, ArtsVA: ArtsVANum,
                BBA: BBANum, ACCT: ACCTNum, ECON: ECONNum, BBAEnt: BBAEntNum, BBAFin: BBAFinNum, BBAHR: BBAHRNum, BBAisem: BBAisemNum, BBAmarket: BBAmarNum,
                Medi: mediNum, Phar: pharNum, CommAM: commAMNum, CommFT: commFTNum, Journ: JournNum, CommJDM: commJDMNum, CommCJ: commCJNum,
                CommDMC: commDMCNum, PR: PRNum, AGS: AGSNum, CommIJ: commIJNum, CommAB: commABNum, CommOC: commOCNum, CommPR: commPRNum,
                BSC: BSCNum, ATS: ATSNum, Biotech: BiotechNum, BioEnv: BioEnvNum, BCDA: BCDANum, BAS: BASNum, Chem: ChemNum, CST: CSTNum,
                DMC: DMCNum, ISA: ISANum, Maths: MathsNum, Physics: PhyNum, PE: PENum, GIS: GISNum, SW: SWNum, History: HisNum,
                BssCSE: BssCSENum, BssESF: BssESFNum, BssESG: BssESGNum, BssGCS: BssGCSNum, Geog: GeogNum, BssGIS: BssGISNum, Sociology: SocNum
            });
        }
    },
};

