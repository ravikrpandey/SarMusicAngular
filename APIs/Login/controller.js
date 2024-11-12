const db = require("../../IndexFiles/modelsIndex");
const tbl_loginUser = db.user;
const SECRET_KEY = process.env.SECRET_KEY || "";
const TOKEN_EXPIRES_TIME = parseInt(process.env.TOKEN_EXPIRES_TIME, 10) || 600; 
const jwt = require('jsonwebtoken');
const {sendOTPEmail, generateOTP} = require('../services/node-mailer.js/index');


exports.loginUser = async (req, res) => {
    try {
        const { email, mobileNumber, otp, userName, type } = req.body;
        const masterOtp = "1234"; // Define master OTP
        let generatedOtp = generateOTP();

        let userData = await tbl_loginUser.findOne({
            where: { mobileNumber }
        });

        if (userData) {
            // If user exists, update with master OTP
            await tbl_loginUser.update({ otp: generatedOtp }, { where: { mobileNumber } });
        } else {
            // If user does not exist, create new user with master OTP
            userData = await tbl_loginUser.create({
                mobileNumber,
                userName,
                type,
                otp: generatedOtp
            });
        }

        userData = await tbl_loginUser.findOne({
            where: { mobileNumber }
        });

        if (otp === userData?.otp || otp === masterOtp) {
            const token = jwt.sign({ userName: userData.userName, mobileNumber }, SECRET_KEY, {
                expiresIn: TOKEN_EXPIRES_TIME
            });

            await sendOTPEmail(email, generatedOtp);

            return res.status(200).send({
                code: 200,
                message: "User login successfully",
                data: userData.type,
                token
            });
        } else {
            return res.status(403).send({
                code: 403,
                message: "Please enter a valid OTP"
            });
        }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error!"
        });
    }
};

//========================= 

exports.getLoginUser = async (req, res) => {
    try {
        const userData = await tbl_loginUser.findAll({});
        return res
            .status(200)
            .send({
                code: 200,
                message: "Data fetched successfully",
                data: userData,
            });
    } catch (error) {
        return res
            .status(500)
            .send({ code: 500, message: error.message || "Server Error !" });
    }
};
