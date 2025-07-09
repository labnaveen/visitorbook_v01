const sequelize = require("../config/db.config").sequelize;
const { Op } = require("sequelize");
const ResponseHelper = require("../helpers/ResponseHelper");
const GuiText = require("../models/guiTextModel");
const sanitize = require("sanitize-html");

class GuiController {
    async fetchGUIText(req, res) {
        try {
            let { languageId, appId } = req.params;
            languageId = sanitize(languageId)
            appId = sanitize(appId)
            const guiTextData = await GuiText.findOne({
                where: {
                    language_id: languageId,
                    application_id: appId
                },
                attributes: ["text"],
            });
            if (!guiTextData) {
                return await ResponseHelper.NotFound(res, false, "Not data found !", "Fetch GUI text API.")
            }
            return await ResponseHelper.OK(res, true, "Gui Text fetched successfully !", guiTextData, null, "Fetch GUI text API.")
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return await ResponseHelper.ISError(res,  error.message, "Fetch GUI text API.")
        }
    }
}
module.exports = new GuiController();
