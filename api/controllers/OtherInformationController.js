/**
 * OtherInformationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    other_information: async function (req, res) {

        if (req.method == "GET")
            return res.view('forms/otherInformation');

        req.session.data = req.body.OtherInformation;

        if (req.session.otherInformationData == null) {

            req.session.otherInformationData = req.body;

            await OtherInformation.create(req.session.data);

            await User.update(req.session.userId).set({
                otherInformationData: req.body

            }).fetch();

        } else {
            req.session.otherInformationData = req.body;

            await OtherInformation.update({ id: req.session.otherInformationData.OtherInformation.id }).set({
                personalStatement: req.body.OtherInformation.personalStatement,
                organization1: req.body.OtherInformation.organization1,
                position1: req.body.OtherInformation.position1,
                workNature1: req.body.OtherInformation.workNature1,
                workMode1: req.body.OtherInformation.workMode1,
                periodFromMonth1: req.body.OtherInformation.periodFromMonth1,
                periodFromYear1: req.body.OtherInformation.periodFromYear1,
                periodToMonth1: req.body.OtherInformation.periodToMonth1,
                periodToYear1: req.body.OtherInformation.periodToYear1,
                duties1: req.body.OtherInformation.duties1,
            }).fetch();

            await User.update(req.session.userId).set({
                otherInformationData: req.body

            }).fetch();
        }

        return res.redirect('/forms/otherInformation');
    },

    submit: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            return res.view('forms/otherInformation', { user: model });

        }

        req.session.data = req.body.OtherInformation;

        if (req.session.otherInformationData == null) {

            req.session.otherInformationData = req.body;

            await OtherInformation.create(req.session.data);

            await User.update(req.session.userId).set({
                otherInformationData: req.body

            }).fetch();

        } else {
            req.session.otherInformationData = req.body;

            await OtherInformation.update({ id: req.session.otherInformationData.OtherInformation.id }).set({
                personalStatement: req.body.OtherInformation.personalStatement,
                organization1: req.body.OtherInformation.organization1,
                position1: req.body.OtherInformation.position1,
                workNature1: req.body.OtherInformation.workNature1,
                workMode1: req.body.OtherInformation.workMode1,
                periodFromMonth1: req.body.OtherInformation.periodFromMonth1,
                periodFromYear1: req.body.OtherInformation.periodFromYear1,
                periodToMonth1: req.body.OtherInformation.periodToMonth1,
                periodToYear1: req.body.OtherInformation.periodToYear1,
                duties1: req.body.OtherInformation.duties1,
            }).fetch();

            await User.update(req.session.userId).set({
                otherInformationData: req.body

            }).fetch();
        }

        // if (req.session.academicProfileData == null || req.session.personalParticularsData == null || req.session.programmePreferenceData == null) {

        //     return res.status(401).send("You have not completed all the sections of the application form."); //bad Request
        // }

        await User.update(req.session.userId).set({
            status: 'submitted',
        }).fetch();

        req.session.status = 'submitted'

        var year = new Date().getFullYear();
        var modelNum = await User.count({ or: [{ status: 'submitted' }, { status: 'approved' }, { status: 'disapproved' }, { status: 'accepted' }, { status: 'rejected' }], })
        var idCode = "UA" + year + "-" + modelNum;

        await User.update(req.session.userId).set({
            idCode: idCode,
        }).fetch();

        var user = await User.findOne({ id: req.session.userId });

        var html = await sails.renderView('user/student/email_applicationSubmission', {
            model: user,
            layout: false
        });

        await sails.helpers.sendSingleEmail({
            to: user.Email,
            from: sails.config.custom.mailgunFrom,
            subject: 'HKBU - Application Submission Acknowledgement',
            html: html
        });

        // return res.redirect('/user/student/myApplication');
        if (req.wantsJSON) {

            return res.json({ message: "Login successfully.", url: '/user/student/myApplication' });

        } else {

            return res.redirect('/user/student/myApplication');
        }
    },
};

