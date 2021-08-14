/**
 * AcademicReferenceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    academic_reference: async function (req, res) {

        if (req.method == "GET") {

            return res.view('forms/academicReference');
        }

        req.session.data = req.body.AcademicReference;

        if (req.session.academicReferenceData == null) {

            req.session.academicReferenceData = req.body;

            await AcademicReference.create(req.session.data);

            await User.update(req.session.userId).set({
                academicReferenceData: req.body

            }).fetch();

        } else {

            req.session.academicReferenceData = req.body;

            await AcademicReference.update({ id: req.session.academicReferenceData.AcademicReference.id }).set({
                relationship1: req.body.AcademicReference.relationship1,
                refName1: req.body.AcademicReference.refName1,
                email1: req.body.AcademicReference.email1,
                description1: req.body.AcademicReference.description1,
                relationship2: req.body.AcademicReference.relationship2,
                refName2: req.body.AcademicReference.refName2,
                email2: req.body.AcademicReference.email2,
                description2: req.body.AcademicReference.description2
            }).fetch();

            await User.update(req.session.userId).set({
                academicReferenceData: req.body

            }).fetch();
        }

        return res.redirect('/forms/otherInformation');
    },

    save: async function (req, res) {

        if (req.method == "GET") {

            return res.view('forms/academicReference');
        }

        req.session.data = req.body.AcademicReference;

        if (req.session.academicReferenceData == null) {

            req.session.academicReferenceData = req.body;

            await AcademicReference.create(req.session.data);

            await User.update(req.session.userId).set({
                academicReferenceData: req.body

            }).fetch();

        } else {

            req.session.academicReferenceData = req.body;

            await AcademicReference.update({ id: req.session.academicReferenceData.AcademicReference.id }).set({
                relationship1: req.body.AcademicReference.relationship1,
                refName1: req.body.AcademicReference.refName1,
                email1: req.body.AcademicReference.email1,
                description1: req.body.AcademicReference.description1,
                relationship2: req.body.AcademicReference.relationship2,
                refName2: req.body.AcademicReference.refName2,
                email2: req.body.AcademicReference.email2,
                description2: req.body.AcademicReference.description2
            }).fetch();

            await User.update(req.session.userId).set({
                academicReferenceData: req.body

            }).fetch();
        }

        return res.redirect('/forms/academicReference');
    },
};

