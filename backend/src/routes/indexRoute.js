const routes = [
    {
        path: "/api/vistor",
        route: require("./vistorRoute.js"),
    },
    {
        path: "/api/admin",
        route: require("./adminRoute.js"),
    },
    {
        path: "/api/gui",
        route: require("./guiRoutes.js"),
    },
    {
        path: "/api/package",
        route: require("./packageRoute.js"),
    },
    {
        path: "/api/payment",
        route: require("./paymentRoute.js"),
    },
    {
        path: "/api/adminCheckIn",
        route: require("./adminCheckInRoute.js"),
    },
    {
        path: "/api/blogs/",
        route: require("./blogsRoute"),
    },
    {
        path: "/api/comments/",
        route: require("./commentsRoute"),
    },
];

module.exports = {
    httpRoutes: () => {
        return routes;
    },
};
