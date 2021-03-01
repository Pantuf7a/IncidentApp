const { UserInputError, AuthenticationError } = require("apollo-server");

const checkAuth = require("../../utilities/check-auth")
const Incident = require('../../models/Incident');

module.exports = {
  Mutation: {
    //Mutation for creating comment process, it needs an incidentId and a body
    createComment: async (_, { incidentId, body }, context) => {
      const { username } = checkAuth(context);

      //If the body of the comment it's empty, it will throw an error
      if(body.trim() === '') {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "comment body must not be empty"
          }
        })
      }

      //Check for incident using it's id
      const incident = await Incident.findById(incidentId);

      //If there's indeed an incident where we can post a comment "unshift" it (locate it at the top)
      //If there's no incident, throw error
      if(incident) {
        incident.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        })

        //Save to DB
        await incident.save();
        return incident;
      } else {
        throw new UserInputError("Incident not found");
      }
    },
    //Mutation for delete comment process, takes the incidentId and the commentId 
    async deleteComment(_, { incidentId, commentId }, context) {
      const { username } = checkAuth(context);

      //Find the incident where the comment is
      const incident = await Incident.findById(incidentId);

      //If an incident is found it will do all the delete process, if not found it will throw an error
      if(incident){
        //Find the index of the comment that needs to be deleted
        const commentIndex = incident.comments.findIndex(c => c.id === commentId);

        /*At the moment the user that wants to delete an incident's comment must be the same user that created it
        If anyone should be able to delete this, the "if statement" should be removed/commented */
        if(incident.comments[commentIndex].username === username){
          incident.comments.splice(commentIndex, 1);
          await incident.save();
          return incident;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Incident not found");
      }
    }
  }
}