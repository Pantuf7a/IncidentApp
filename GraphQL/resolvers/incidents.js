const { AuthenticationError } = require('apollo-server');

const Incident = require("../../models/Incident");
const checkAuth= require('../../utilities/check-auth');


module.exports = {
  //for each query/mutation/subscription it has its corresponding resolver
  //Query for getting all the incidents/Incidents
  Query: {
    //Query for getting all incidents
    async getIncidents() {
      try {
        //Find all incidents and sort them from most recent to less recent
        const incidents = await Incident.find().sort({ createdAt: -1});
        return incidents;
      } catch (err) {
        throw new Error(err);
      }
    },
    //Query for getting 1 incident
    async getIncident(_, { incidentId }){
      try{
        const incident = await Incident.findById(incidentId);
        if(incident) {
          return incident;
        } else {
          throw new Error('Incident not found')
        }
      } catch(err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    //Mutation for the creating incident process
    async createIncident(_, { body }, context) {
      const user = checkAuth(context);

      //When creating an incident, if the body it's empty, return an error.
      if(body.trim() === '') {
        throw new Error("Incident body mmust not be empty");
      }
      
      const newIncident = new Incident({
        body,
        user: user.id, 
        username: user.username,
        createdAt: new Date().toISOString()
      });

      //Save incident to DB
      const incident = await newIncident.save();

      return incident;
    },
    //Mutation for the deleting incident process
    async deleteIncident(_, { incidentId }, context) {
      const user = checkAuth(context);

      try{
        const incident = await Incident.findById(incidentId);
        /*At the moment the user that wants to delete an incident must be the same user that created it
        If anyone should be able to delete this, the "if statement" should be removed/commented */
        if(user.username === incident.username){
          await incident.delete();
          return "Incident deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch(err) {
        throw new Error(err);
      }
    }
  }
};
