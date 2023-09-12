const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const verifyJwtToken = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    console.log("Could not get header", token);
    return res.status(401).send("Not authenticated");
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "userToken");
  } catch (error) {
    console.log("could not decode token. error ", error);
    return res.status(401).send("Not authenticated");
  }

  return decodedToken.userId;
};

const verifyUserEmail = async (req, res) => {
  const { email, verify_token } = req.query;
  if (!email || !verify_token) {
    console.log("either one or both query params missing");
    return res.status(401).send("Cannot verify");
  }

  const user = await User.findOne({
    email: email,
    verificationToken: verify_token,
  });

  if (user) {
    user.isVerified = true;
    try {
      await user.save();
      return res.status(200).json({
        userName: user.userName,
        email: user.email
      });
    } catch (error) {
      console.log("user not verified : ", error);
      return res.status(400).send({ message: "User not verified!" });
    }
  }
};

module.exports = { verifyUserEmail, verifyJwtToken };
