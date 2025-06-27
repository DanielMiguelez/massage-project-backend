const User = require("../models/User")
const transporter = require("../config/email")

const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const UserController = {

    async createUser(req, res) {
        try {
            const passwordHashed = await bcrypt.hash(req.body.password, 10)
            const user = await User.create({ ...req.body, password: passwordHashed })
            res.status(201).send({ msg: "User created Successfully ! ", user })
        } catch (error) {
            console.log("Not able to create user:", error);
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(201).send({ msg: "Users brought successfully", users })
        } catch (error) {
            console.log("Not able to bring users:", error);
        }
    },

    async getUserById(req, res) {
        try {
            const userById = await User.findById(req.params._id);
            res.status(201).send({ msg: "User bythe ID you selected", userById })
        } catch (error) {
            console.log("Not able to bring user:", error);
        }
    },

    async deleteUserById(req, res) {
        try {
            const userToDelete = await User.findByIdAndDelete(req.params._id);

            if (!userToDelete) {
                return res.status(400).send("your user does not exist")
            }

            res.status(200).send({ msg: "user deleted", id: req.params._id })
        } catch (error) {
            console.log("Not able to bring user:", error);
        }
    },

    async updateUserById(req, res) {
        try {
            const userToUpdate = await User.findByIdAndUpdate(req.params._id, req.body, { new: true });

            if (!userToUpdate) {
                return res.status(400).send("There is no user to update")
            }
            res.status(200).send({ msg: "Your user updated", user: userToUpdate });
        } catch (error) {
            console.log("Not able to update user:", error);
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).send({ msg: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(req.body.password, user.password)

            if (!isMatch) {
                return res.status(400).send("User or password not correct")
            }

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET || "secretkey",
                { expiresIn: "2h" }
            );

            res.status(200).send({
                msg: "Login successful",
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            });
        } catch {
            console.log("Login error:", error);
            res.status(500).send({ msg: "Error during login", error });
        }
    },

    async forgotPassword(req, res) {
        try {
          const { email } = req.body;
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).send({ msg: "No user with that email" });
          }
      
          // Generar token y expiración
          const token = crypto.randomBytes(32).toString("hex");
          const expires = Date.now() + 3600000; // 1 hora
      
          user.resetPasswordToken = token;
          user.resetPasswordExpires = expires;
          await user.save();
      
          console.log(`Reset link: https://tuapp.com/reset-password?token=${token}`);
      
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Recuperación de contraseña",
            text: `Haz clic en el siguiente enlace para resetear tu contraseña: http://localhost:3000/reset-password?token=${token}`
          };
      
          await transporter.sendMail(mailOptions);
      
          res.status(200).send({ msg: "Password reset link sent (check your email)", token }); // El token solo para pruebas, normalmente no se envía en la respuesta
        } catch (error) {
          console.log("Forgot password error:", error);
          res.status(500).send({ msg: "Error in forgot password", error });
        }
    },

    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });
            if (!user) {
                return res.status(400).send({ msg: "Invalid or expired token" });
            }

            user.password = await bcrypt.hash(newPassword, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(200).send({ msg: "Password has been reset successfully" });
        } catch (error) {
            console.log("Reset password error:", error);
            res.status(500).send({ msg: "Error in reset password", error });
        }
    }

}

module.exports = UserController;