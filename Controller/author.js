const User = require("../Models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const sessionModel = require("../Models/sessions.models");
const expressError = require("../utils/expressError");
const { title } = require("process");

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    const alreadyRegistered = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (alreadyRegistered) {
      return res.status(409).json({
        message: "Username or email is already registered.",
      });
    }

    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    const session = await sessionModel.create({
      user: user._id,
      token: token,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("/login");
  } catch (err) {
    console.error("Register error:", err.message);

    return res.status(401).json({
      message: "Error Occured",
    });
  }
}
// getMe Function 
async function getMe(req, res) {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token not found",
      });
    }

    const decodedData = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decodedData.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user: {
        username: user.username,
        email: user.email,
      },
    });
}
// Logout function
async function logout(req, res) {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new expressError(501, `token not found`);
    }

    const session = await sessionModel.findOne({
      token,
      revoked: false,
    });

    if (!session) {
      throw new expressError(400 ,"Session not found");
    }
    session.revoked = true;
    await session.save();

    res.clearCookie("accessToken");
    req.session.flash = {
      title: "success",
      message: "Looged out successfully"
    }
    return res.render("home");
}
//login function
async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new expressError(501, `User not found `);
  }

  const loginPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if( loginPassword !== user.password) throw new expressError(501,`Wrong password`);

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  const session = await new sessionModel({
    user: user,
    token,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  await session.save();
  req.session.flash = {
    title:"success",
    message:"Login Successfull"
  }
  return res.redirect("/helpdesk/dashboard");
}

//Google Login 
async function googleLogin(req, res) {
  const token = jwt.sign(
    { id: req.user._id },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  await sessionModel.create({
    user: req.user._id,
    token,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  req.session.flash = {
    title: "success",
    message: "Login Successfull"
  }
  
  return res.redirect("/helpdesk/dashboard");
}

const authController = {
  register,
  getMe,
  logout,
  login,
  googleLogin,
};

module.exports = authController;
