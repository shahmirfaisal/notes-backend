const route = require("express").Router();
const { signup, login, isLogin } = require("../controllers/user");
const checkAuth = require("../middlewares/checkAuth");

route.post("/signup", signup);
route.post("/login", login);
route.get("/is-login", checkAuth, isLogin);

module.exports = route;
