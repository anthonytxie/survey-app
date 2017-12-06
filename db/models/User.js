const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	googleId: String,
	credits: {
		type: Number,
		default: 0
	}
});

userSchema.statics.createOAuthUser = async function(strategy, identifier) {
	switch (strategy) {
		case "google":
			const user = await this.findOne({ googleId: identifier });
			if (!user) {
				return new User({ googleId: identifier }).save();
			} else {
				return user;
			}
			break;
		default:
			console.log("No idea what shit strategy was used");
	}
};

userSchema.methods.addCredits = async function(additionalCredits) {
	const user = await this.model("Users").findOneAndUpdate(
		{ _id: this._id },
		{ $inc: { credits: additionalCredits } },
		{ new: true }
	);
	return user;
};

const User = mongoose.model("Users", userSchema);

module.exports = { User };
