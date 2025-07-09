const guiRoutes = require("express").Router();
const guiController = require("../controllers/GuiController");



guiRoutes.get("/:languageId/:appId", guiController.fetchGUIText)

module.exports = guiRoutes;
