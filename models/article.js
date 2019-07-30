var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // Title of article
  title: {
    type: String,
    required: true
  },
  // Article link
  link: {
    type: String,
    required: true
  },
  // User note about article
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  },
  // Summary of the article
  summary: {
    type: String,
    required: true
  },
  // If user has saved the article
  // Required, but defaults to not saved
  isSaved: {
    type: Boolean,
    required: true,
    default: false
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
