const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  credits: {
    type: Number,
    default: 0,
  },
});

userSchema.statics.createOAuthUser = async function(strategy, identifier) {
  switch (strategy) {
    case 'google':
      const user = await this.findOne({ googleId: identifier });
      if (!user) {
        return new User({ googleId: identifier }).save();
      } else {
        return user;
      }
    default:
      return '';
  }
};

userSchema.methods.changeCredits = async function(changeCredits) {
  const user = await this.model('Users').findOneAndUpdate(
    { _id: this._id },
    { $inc: { credits: changeCredits } },
    { new: true }
  );
  return user;
};

const User = mongoose.model('Users', userSchema);

module.exports = { User };
