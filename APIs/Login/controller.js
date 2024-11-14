const db = require("../../IndexFiles/modelsIndex");
const tbl_loginUser = db.user;
const SECRET_KEY = process.env.SECRET_KEY || "";
const TOKEN_EXPIRES_TIME = parseInt(process.env.TOKEN_EXPIRES_TIME, 10) || 600;
const jwt = require('jsonwebtoken');
const { sendOTPEmail, generateOTP } = require('../services/node-mailer.js/index');


exports.loginOrRegisterUser = async (req, res) => {
    try {
        const { email, mobileNumber, otp, fullName } = req.body;
        const masterOtp = "9955"; // master OTP for testing
        let generatedOtp = generateOTP(); // assume generateOTP() function exists

        // Check if user exists by mobile number
        let userData = await tbl_loginUser.findOne({ where: { mobileNumber } });

        if (userData && (otp == null || otp == undefined)) {
            // Update OTP if user exists
            await tbl_loginUser.update({ otp: generatedOtp }, { where: { mobileNumber } });
        } else if (!userData){
            // Register a new user
            userData = await tbl_loginUser.create({
                mobileNumber,
                userName: fullName,
                email,
                type: 'user',
                otp: generatedOtp
            });
        }

        // Retrieve user data to verify OTP
        userData = await tbl_loginUser.findOne({ where: { mobileNumber } });

        // Verify OTP or use master OTP
        if (otp == undefined && otp == null) {
                // Generate JWT token
                const token = jwt.sign(
                    { email: userData.email, userName: userData.userName, mobileNumber },
                    SECRET_KEY,
                    { expiresIn: TOKEN_EXPIRES_TIME }
                );

            // Send OTP via email (assume sendOTPEmail() is defined)
            // await sendOTPEmail(email, generatedOtp);

            return res.status(200).send({
                code: 200,
                message: "User created successfull",
                data: userData.type,
                token
            });

        } else if (otp) {
            let token = null
            if (otp === userData?.otp || otp === masterOtp) {
                // Generate JWT token
                token = jwt.sign(
                    { email: userData.email, userName: userData.userName, mobileNumber },
                    SECRET_KEY,
                    { expiresIn: TOKEN_EXPIRES_TIME }
                );
            } else {
                return res.status(403).send({ code: 403, message: "Please enter a valid OTP" });
            }

            return res.status(200).send({
                code: 200,
                message: "User login successfull",
                data: userData,
                token
            });

        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error!" });
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
