import mongoose from "../configs/mongoose.js";
const { Schema, model } = mongoose;

const UserSchema = new Schema(
    {
        id: { type: String, index: true, unique: true },
        email: { type: String, required: true },
        name: { type: String },
        image: { type: String },
        earned: { type: Number, default: 0 },
        withdrawn: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default model("User", UserSchema);
