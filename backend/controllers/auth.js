const { hash, compare } = require("bcrypt");
const Notes = require("../models/notes");
const User = require("../models/user");

exports.signIn = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username)
    return res
      .status(400)
      .json({ error: "Username field cannoot be empty!!!" });

  if (!password)
    return res.status(400).json({ error: "Password field cannot be empty!!!" });

  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ error: "User doesn't exist" });

  const isPasswordMatch = await compare(password, user.password);

  if (!isPasswordMatch)
    return res.status(400).json({ error: "Incorrect password!!!" });

  req.session.user = { username: user.username, notesId: user.notesId };

  res.status(200).json({ username: user.username, notesId: user.notesId });
};

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username)
    return res
      .status(400)
      .json({ error: "Username field cannoot be empty!!!" });

  if (!password)
    return res.status(400).json({ error: "Password field cannot be empty!!!" });

  const existingUser = await User.findOne({ username });

  if (existingUser)
    return res.status(400).json({ error: "User already exist" });

  const hashedPassword = await hash(password, 12);

  const newNote = new Notes({
    notes: [
      {
        title: "Welcome to Note making App",
        description:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt in quae, rem molestias sapiente dolorum officia, iste illum, cumque minus impedit. Provident, nesciunt cum fugit ipsum esse soluta fugiat numquam?",
      },
    ],
  });

  const notesData = await newNote.save();

  const newUser = new User({
    username,
    password: hashedPassword,
    notesId: notesData._id,
  });

  const userData = await newUser.save();

  res
    .status(200)
    .json({ username: userData.username, notesId: userData.notesId });
};

exports.logout = async (req, res, next) => {
  req.session.destroy((err) => {
    //delete session data from store, using sessionID in cookie
    if (err) throw err;
    res.clearCookie("session-id"); // clears cookie containing expired sessionID
    res.json("Logged out successfully");
  });
};

exports.authChecker = (req, res, next) => {
  if (req.session.user) {
    res.status(200).json({
      username: req.session.user.username,
      notesId: req.session.user.notesId,
    });
  } else {
    res.status(400).json({ error: "Unauthenticated" });
  }
};
