const { model, Schema } = require("mongoose");

//Schema for how the incidents will be created
const incidentSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String, //Body of the comment/update of the incident
      username: String, //User that created the comment
      createdAt: String, //Time of creation 
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Incident", incidentSchema);
