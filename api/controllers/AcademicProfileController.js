/**
 * AcademicProfileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    academic_profile: async function (req, res) {

        if (req.method == "GET") {

            return res.view('forms/academicProfile');
        }

        req.session.data = req.body.AcademicProfile;

        if (req.session.academicProfileData == null) {

            req.session.academicProfileData = req.body;

            await AcademicProfile.create(req.session.data);

            await User.update(req.session.userId).set({
                academicProfileData: req.body

            }).fetch();

        } else {

            req.session.academicProfileData = req.body;

            await AcademicProfile.update({ id: req.session.academicProfileData.AcademicProfile.id }).set({
                primaryYrs: req.body.AcademicProfile.primaryYrs,
                secondaryYrs: req.body.AcademicProfile.secondaryYrs,
                postYrs: req.body.AcademicProfile.postYrs,

                postCountry1: req.body.AcademicProfile.postCountry1,
                postInstitution1: req.body.AcademicProfile.postInstitution1,
                postProgramTitle: req.body.AcademicProfile.postProgramTitle,
                postStudyStatus1: req.body.AcademicProfile.postStudyStatus1,
                postStudyMode1: req.body.AcademicProfile.postStudyMode1,
                postGPA1: req.body.AcademicProfile.postGPA1,
                postMaxGPA1: req.body.AcademicProfile.postMaxGPA1,
                postPeriodFrom1: req.body.AcademicProfile.postPeriodFrom1,
                postPeriodTo1: req.body.AcademicProfile.postPeriodTo1,
                postQualification1: req.body.AcademicProfile.postQualification1,

                secCountry1: req.body.AcademicProfile.secCountry1,
                secCurriculum1: req.body.AcademicProfile.secCurriculum1,
                secSchoolName1: req.body.AcademicProfile.secSchoolName1,
                secPeriodFrom1: req.body.AcademicProfile.secPeriodFrom1,
                secPeriodTo1: req.body.AcademicProfile.secPeriodTo1,
                secLevelAttained1: req.body.AcademicProfile.secLevelAttained1
            }).fetch();

            await User.update(req.session.userId).set({
                academicProfileData: req.body

            }).fetch();
        }

        return res.redirect('/forms/academicQualification');
    },

    save: async function (req, res) {

        if (req.method == "GET") {

            return res.view('forms/academicProfile');
        }

        req.session.data = req.body.AcademicProfile;

        if (req.session.academicProfileData == null) {

            req.session.academicProfileData = req.body;

            await AcademicProfile.create(req.session.data);

            await User.update(req.session.userId).set({
                academicProfileData: req.body

            }).fetch();

        } else {

            req.session.academicProfileData = req.body;

            await AcademicProfile.update({ id: req.session.academicProfileData.AcademicProfile.id }).set({
                primaryYrs: req.body.AcademicProfile.primaryYrs,
                secondaryYrs: req.body.AcademicProfile.secondaryYrs,
                postYrs: req.body.AcademicProfile.postYrs,
                postCountry1: req.body.AcademicProfile.postCountry1,
                postInstitution1: req.body.AcademicProfile.postInstitution1,
                postProgramTitle1: req.body.AcademicProfile.postProgramTitle1,
                postStudyStatus1: req.body.AcademicProfile.postStudyStatus1,
                postStudyMode1: req.body.AcademicProfile.postStudyMode1,
                postGPA1: req.body.AcademicProfile.postGPA1,
                postMaxGPA1: req.body.AcademicProfile.postMaxGPA1,
                postPeriodFrom1: req.body.AcademicProfile.postPeriodFrom1,
                postPeriodTo1: req.body.AcademicProfile.postPeriodTo1,
                postQualification1: req.body.AcademicProfile.postQualification1,
            }).fetch();

            await User.update(req.session.userId).set({
                academicProfileData: req.body

            }).fetch();
        }

        return res.redirect('/forms/academicProfile');
    },

    clear: async function (req, res) {

        if (req.method == "GET") {

            return res.view('forms/academicProfile');
        }

        req.session.data = req.body.AcademicProfile;

        req.session.academicProfileData = req.body;

        await AcademicProfile.update({ id: req.session.academicProfileData.AcademicProfile.id }).set({
            postCountry1: "",
            postInstitution1: "",
            postProgramTitle1: "",
            postStudyStatus1: "",
            postStudyMode1: "",
            postGPA1: "",
            postMaxGPA1: "",
            postPeriodFrom1: "",
            postPeriodTo1: "",
            postQualification1: "",
        }).fetch();

        await User.update(req.session.userId).set({
            academicProfileData: req.body
        }).fetch();

        return res.redirect('/forms/academicProfile');
    }
};

