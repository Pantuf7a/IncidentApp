//The goal of this context it's to check if a user is logged in, since all the operations should not be able to proceed without login in
const { AuthenticationError } = require("apollo-server");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');

module.exports = (context) => {
  // context will have a object = {...headers}
  const authHeader = context.req.headers.authorization;
  if(authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if(token){
      try{
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch(err){
        throw new AuthenticationError('Invalid or Expired token');
      }
    }
    throw new Error('Authentication token must be \'Beater [token]')
  }
      throw new Error('Authorization header must be provided');
}