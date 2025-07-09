require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const Op = Sequelize.Op;

//SAMPLE TO CHECK

/* defining database configuration */
let DBOption = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    define: {
        timestamps: false,
    },
    logging: false,
    sync: { force: true },
    // pool: {
    //     max: 20, // Increase this from default 5
    //     min: 0,
    //     acquire: 30000, // 30 seconds to try acquiring connection
    //     idle: 10000, // Connection is released after 10s of inactivity
    // },
};
console.log(">>>>>>>>>>>>>>>>>>process.env.ENVIRONMENT:", process.env.ENVIRONMENT);
if (process.env.ENVIRONMENT != "development" && process.env.ENVIRONMENT != "staging" && process.env.ENVIRONMENT != "local" && process.env.ENVIRONMENT != "uat") {
    // const serverCa = [fs.readFileSync(process.env.DB_CERTIFICATE_PATH, "utf8")];
    DBOption = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        define: {
            timestamps: false,
        },
        dialectOptions: {
            ssl: {
                ca: "serverCa",
            },
        },
        logging: false,
        sync: { force: true },
    };
}
let sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, DBOption);
/* connection for DB */
sequelize
    .authenticate()
    .then(() => {
        console.log("MYSQL --> Connection to DB has been established successfully.");
    })
    .catch((err) => {
        console.log("Unable to connect to the database:", err);
    });

module.exports.sequelize = sequelize;
