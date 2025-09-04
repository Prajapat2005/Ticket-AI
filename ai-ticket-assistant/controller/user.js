import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js"
import { inngest } from "../inngest/client.js";
import dotenv from "dotenv"
dotenv.config();

export const signup = async (req, res) => {
    const { email, password, skills = [] } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        console.log(req.body);
        const user = await User.create({ email, password: hashPassword, skills });


        await inngest.send({
            name: "user/signup",
            data: { email }
        });

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );
        return res.status(200).json({ user, token });

    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "Signup Failed",
            details: error.message
        });
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                error: "User Not Found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid credentials"
            })
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        res.status(200).json({ user, token });
    }
    catch (error) {
        res.status(500).json({
            error: "Login Failed",
            details: error.message
        });
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];  // Bearer token_value

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    error: "Unauthorized",
                });
            }
        })

        res.json({ message: "Logout successfully" });
    }
    catch (error) {
        res.status(500).json({
            error: "Logout Failed",
            details: error.message
        });
    }
}

export const updateUser = async (req, res) => {
    const { skills = [], role, email } = req.body;

    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                error: "Forbidden"
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                error: "User Not Found"
            })
        }

        await User.updateOne({ email }, {
            skills: skills.length ? skills : user.skills,
            role: role
        });

        res.json({
            message: "User updated"
        })
    }
    catch (error) {
        res.status(500).json({
            error: "Update Failed",
            details: error.message
        });
    }
}

export const getUser = async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                error: "Forbidden"
            })
        }

        const users = await User.find().select("-password");

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            error: "Get Failed",
            details: error.message
        });
    }
};