const app = require("express");
const router = app.Router();

const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");
const emailService = require("../utils/emailService");

router.post("/signup-user", authController.signupUser);
router.post("/login-user", authController.loginUser);
router.get("/send-token/:email/:verify_token", emailService.sendEmail);
router.get("/api/verify", authMiddleware.verifyUserEmail);
router.post("/forgot-password", authController.initiateResetPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
