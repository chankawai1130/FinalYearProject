/**
 * PersonalParticularsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    personal_particulars: async function (req, res) {

        if (req.method == "GET") {

            return res.view('forms/personalParticulars');
        }

        req.session.data = req.body.PersonalParticulars;

        if (req.session.personalParticularsData == null) {

            req.session.personalParticularsData = req.body;

            await PersonalParticulars.create(req.session.data);

            await User.update(req.session.userId).set({
                personalParticularsData: req.body

            }).fetch();

        } else {

            req.session.personalParticularsData = req.body;

            await PersonalParticulars.update({ id: req.session.personalParticularsData.PersonalParticulars.id }).set({
                engName: req.body.PersonalParticulars.engName,
                chiName: req.body.PersonalParticulars.chiName,
                telNum: req.body.PersonalParticulars.telNum,
                hkID: req.body.PersonalParticulars.hkID,
                nationality: req.body.PersonalParticulars.nationality,
                placeOfBirth: req.body.PersonalParticulars.placeOfBirth,
                nationalID: req.body.PersonalParticulars.nationalID,
                issueCountry1: req.body.PersonalParticulars.issueCountry1,
                travelDocNum: req.body.PersonalParticulars.travelDocNum,
                issueCountry2: req.body.PersonalParticulars.issueCountry2,
                mobileNum: req.body.PersonalParticulars.mobileNum,
                address: req.body.PersonalParticulars.address,
            }).fetch();

            await User.update(req.session.userId).set({
                personalParticularsData: req.body,
            }).fetch();


        }

        return res.redirect('/forms/academicProfile');
    },

    save: async function (req, res) {

        if (req.method == "GET") {

            return res.view('forms/personalParticulars');
        }

        req.session.data = req.body.PersonalParticulars;

        if (req.session.personalParticularsData == null) {

            req.session.personalParticularsData = req.body;

            await PersonalParticulars.create(req.session.data);

            await User.update(req.session.userId).set({
                personalParticularsData: req.body

            }).fetch();

        } else {

            req.session.personalParticularsData = req.body;

            await PersonalParticulars.update({ id: req.session.personalParticularsData.PersonalParticulars.id }).set({
                engName: req.body.PersonalParticulars.engName,
                chiName: req.body.PersonalParticulars.chiName,
                telNum: req.body.PersonalParticulars.telNum,
                hkID: req.body.PersonalParticulars.hkID,
                nationality: req.body.PersonalParticulars.nationality,
                placeOfBirth: req.body.PersonalParticulars.placeOfBirth,
                issueCountry1: req.body.PersonalParticulars.issueCountry1,
                issueCountry2: req.body.PersonalParticulars.issueCountry2,
                nationalID: req.body.PersonalParticulars.nationalID,
                issueCountry1: req.body.PersonalParticulars.issueCountry1,
                travelDocNum: req.body.PersonalParticulars.travelDocNum,
                issueCountry2: req.body.PersonalParticulars.issueCountry2,
                mobileNum: req.body.PersonalParticulars.mobileNum,
                address: req.body.PersonalParticulars.address,
            }).fetch();

            await User.update(req.session.userId).set({
                personalParticularsData: req.body,
            }).fetch();


        }

        return res.redirect('/forms/personalParticulars');
    },
};

