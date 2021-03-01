const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { validateRegisterInput,validateLoginInput } = require("../../utilities/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

//Helper function to generate tokens
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    //Mutation for login process
    async login(_, { username, password }) {
      /*Validate user data using loginInput validator
      If trying to login but username and/or password are empty loginValidator will return false for "valid"*/
      const { errors, valid } = validateLoginInput(username, password);

      //If loginValidator returned not valid throw the errors found
      if(!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //Create a const user to check if the user trying to login it's already in the db
      const user = await User.findOne({ username });

      //If the user is not in db them throw an error "User not found"
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      //If user was found in the db then....
      //If passwords don't match, throw error of "Wrong credentials"
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      //Then if there were no errors...
      //Generate a token for the logged in user
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    //Mutation for register process
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      /*Validate user data using registerInput validator
      If trying to register but username, password, and/or email are empty or with incorrect format registerValidator will return false for "valid"*/
      const { valid, errors } = validateRegisterInput(username,email,password,confirmPassword);

      //If registerValidator returned not valid throw the errors found
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //Make sure user doesn't already exist
      const user = await User.findOne({ username });

      //If a username is already in use send an error
      if (user) { 
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      //hash password before storing and create auth token
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      //If the user is good to be registered, save it to DB
      const res = await newUser.save();

      //Generate toke for the registered user
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
