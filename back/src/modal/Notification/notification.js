const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
const mongoosePaginate = require("mongoose-paginate-v2");

const NotificationSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: "user",
  },
  title:{
    type : String,
    default: ""
  },
  body: {
    type: String,
    default: ""
  },
  n_type: {
    type: String,
    default: "",
  },
  n_link: {
    type: String,
    default: "",
  },
  seen: {
    type: Boolean,
    default: false,
  }
},{
  timestamps : true
});

NotificationSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

NotificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Notification", NotificationSchema);
