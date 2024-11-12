const sarMusic = require("../Login/controller");
const authenticateToken = require('../../config/auth');

module.exports = app => {
    app.post("/api/loginUser",sarMusic.loginUser);
    app.get("/api/getLoginUser", authenticateToken, sarMusic.getLoginUser);
}
