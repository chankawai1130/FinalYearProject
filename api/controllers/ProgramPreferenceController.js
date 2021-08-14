/**
 * ProgramPreferenceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    programme_preference: async function (req, res) {

        if (req.method == "GET")
            return res.view('forms/programmePreference');

        req.session.data = req.body.ProgramPreference;

        if (req.session.programmePreferenceData == null) {

            req.session.programmePreferenceData = req.body;

            await ProgramPreference.create(req.session.data);

            await User.update(req.session.userId).set({
                programmePreferenceData: req.body

            }).fetch();

        } else {
            req.session.programmePreferenceData = req.body;

            await ProgramPreference.update({ id: req.session.programmePreferenceData.ProgramPreference.id }).set({
                program1: req.body.ProgramPreference.program1,
                entryYear1: req.body.ProgramPreference.entryYear1,
                concentration1: req.body.ProgramPreference.concentration1,
                program2: req.body.ProgramPreference.program2,
                entryYear2: req.body.ProgramPreference.entryYear2,
                concentration2: req.body.ProgramPreference.concentration2,
                program3: req.body.ProgramPreference.program3,
                entryYear3: req.body.ProgramPreference.entryYear3,
                concentration3: req.body.ProgramPreference.concentration3
            }).fetch();

            await User.update(req.session.userId).set({
                programmePreferenceData: req.body

            }).fetch();
        }

        return res.redirect('/forms/otherInformation');
    },

    save: async function (req, res) {

        if (req.method == "GET")
            return res.view('forms/programmePreference');

        req.session.data = req.body.ProgramPreference;

        if (req.session.programmePreferenceData == null) {

            req.session.programmePreferenceData = req.body;

            await ProgramPreference.create(req.session.data);

            await User.update(req.session.userId).set({
                programmePreferenceData: req.body

            }).fetch();

        } else {
            req.session.programmePreferenceData = req.body;

            await ProgramPreference.update({ id: req.session.programmePreferenceData.ProgramPreference.id }).set({
                program1: req.body.ProgramPreference.program1,
                entryYear1: req.body.ProgramPreference.entryYear1,
                concentration1: req.body.ProgramPreference.concentration1,
                program2: req.body.ProgramPreference.program2,
                entryYear2: req.body.ProgramPreference.entryYear2,
                concentration2: req.body.ProgramPreference.concentration2,
                program3: req.body.ProgramPreference.program3,
                entryYear3: req.body.ProgramPreference.entryYear3,
                concentration3: req.body.ProgramPreference.concentration3
            }).fetch();

            await User.update(req.session.userId).set({
                programmePreferenceData: req.body

            }).fetch();
        }

        return res.redirect('/forms/programmePreference');
    },
};

