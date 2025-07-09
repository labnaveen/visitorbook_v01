const constants = require("../constants/Constants");
const responseHelper = require("../helpers/ResponseHelper");
class Permissions {
    checkAdminAndSuperAdminPermission = () => {
        return async (req, res, next) => {
            try {
                const { role } = req.credentials;

                let roleId = parseInt(role);

                if (roleId === constants.employeeRoleId) {
                    return await responseHelper.UnAuthorized(res, "UnAuthorized!", "Admin permission check middleware.");
                }
                next();
            } catch (error) {
                return await responseHelper.ISError(res, error.message, "Permission check middleware.");
            }
        };
    };

    checkVisitorPermission = () => {
        return async (req, res, next) => {
            try {
                const { role } = req.credentials;
                let roleId = parseInt(role);

                if (roleId !== constants.visitorRoleId) {
                    return await responseHelper.UnAuthorized(res, "UnAuthorized !", "Admin permission check middleware.");
                }
                next();
            } catch (error) {
                return await responseHelper.ISError(res, error.message, "Permission check middleware.");
            }
        };
    };
}
module.exports = new Permissions();
