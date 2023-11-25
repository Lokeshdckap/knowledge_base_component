
const db = require("../utils/database");

const User = db.users;

const saveUser = async (req, res, next) => {
  try {
    const emailcheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (emailcheck) {
      return res.status(409).json({ email: "Email Already taken" });
    }
    next();
  } 
  catch (error) {
    console.log(error);
    return res.status(409).json({ error: error });

  }
};
module.exports = {
  saveUser,
};
