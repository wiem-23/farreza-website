const User = require("../models/User");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const { VENDOR } = require('../constants/roles.constant')

const signup = async (req, res) => {
    try {
        const { email, username, phone, password } = req.body;
        const user = await User.findOne({ email: { '$regex': email, '$options': 'i' } });
        if (user) {
            res.status(400).json({
                message: "This email already has an account",
            });
        } else {
            if (email && username && password) {
                const salt = uid2(16);
                const hash = SHA256(password + salt).toString(encBase64);
                const token = uid2(16);

                const newUser = new User({
                    email,
                    account: {
                        username,
                        phone,
                        avatar: { url: "https://image.noelshack.com/fichiers/2020/47/2/1605630068-avatar-05d357e6.png", },
                    },
                    token,
                    hash,
                    salt,
                });

                await newUser.save();
                res.status(200).json({
                    _id: newUser._id,
                    email: newUser.email,
                    account: newUser.account,
                    token: newUser.token,
                    role: newUser.role,
                });
            } else {
                res.status(400).json({
                    message: "Missing parameters",
                });
            }
        }
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

const login = async (req, res) => {
    try {
        const { password, email } = req.body;

        const userLogin = await User.findOne({ email });
        if (userLogin) {
            // Compare DB password with fields password + salt
            if (
                userLogin.hash === SHA256(password + userLogin.salt).toString(encBase64)
            ) {
                res.status(200).json({
                    _id: userLogin._id,
                    account: userLogin.account,
                    token: userLogin.token,
                    role: userLogin.role,
                });
            } else {
                res.status(401).json({
                    message: "Unauthorized",
                });
            }
        } else {
            res.status(400).json({
                message: "User not found",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

const getUserRole = async (req, res) => {
    try {
        // Intercept Token
        const token = req.headers.authorization.replace("Bearer ", "");
        //Get Claimed User By Token
        const user = await User.findOne({ token: token }, { role: 1 });

        if (user) {
            if (user.role) {
                res.status(200).json(user);
            } else {
                res.status(200).json({ role: VENDOR });
            }
        } else {
            res.status(400).json({
                message: "User not found",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

module.exports = {
    signup, login, getUserRole
}