/**
 * AcademicQualificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    academic_qualification: async function (req, res) {

        if (req.method == "GET") {

            var model = await User.findOne(req.session.userId);

            return res.view('forms/academicQualification', { user: model });
        }

        req.session.data = req.body.AcademicQualification;

        if (req.session.academicQualificationData == null) {

            req.session.academicQualificationData = req.body;

            await AcademicQualification.create(req.session.data);

            await User.update(req.session.userId).set({
                academicQualificationData: req.body

            }).fetch();

        } else {

            req.session.academicQualificationData = req.body;

            await AcademicQualification.update({ id: req.session.academicQualificationData.AcademicQualification.id }).set({
                examYear: req.body.AcademicQualification.examYear,
                examName: req.body.AcademicQualification.examName,
                subject: req.body.AcademicQualification.subject,
                grade: req.body.AcademicQualification.grade,
            }).fetch();

            await User.update(req.session.userId).set({
                academicQualificationData: req.body

            }).fetch();
        }

        return res.redirect('/forms/programmePreference');
    },

    save: async function (req, res) {

        if (req.method == "GET") {

            return res.view('forms/academicQualification');
        }

        req.session.data = req.body.AcademicQualification;

        if (req.session.academicQualificationData == null) {

            req.session.academicQualificationData = req.body;

            await AcademicQualification.create(req.session.data);

            await User.update(req.session.userId).set({
                academicQualificationData: req.body

            }).fetch();

        } else {

            req.session.academicQualificationData = req.body;

            await AcademicQualification.update({ id: req.session.academicQualificationData.AcademicQualification.id }).set({
                examYear: req.body.AcademicQualification.examYear,
                examName: req.body.AcademicQualification.examName,
                subject: req.body.AcademicQualification.subject,
                grade: req.body.AcademicQualification.grade,
            }).fetch();

            await User.update(req.session.userId).set({
                academicQualificationData: req.body

            }).fetch();
        }

        return res.redirect('/forms/academicQualification');
    },

    delete_all: async function (req, res) {

       if (req.method == "GET") {

            return res.view('forms/academicQualification');
        }

        req.session.data = req.body.AcademicQualification;

        if (req.session.academicQualificationData == null) {

            req.session.academicQualificationData = req.body;

            await AcademicQualification.create(req.session.data);

            await User.update(req.session.userId).set({
                academicQualificationData: req.body

            }).fetch();

        } else {

            req.session.academicQualificationData = req.body;

            await AcademicQualification.update({ id: req.session.academicQualificationData.AcademicQualification.id }).set({
                examYear: "",
                examName: "",
                subject: "",
                grade: "",
            }).fetch();

            await User.update(req.session.userId).set({
                academicQualificationData: req.body

            }).fetch();
        }

        return res.redirect('/forms/academicQualification');
    }
};

