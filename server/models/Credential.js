import mongoose from "../configs/mongoose.js";
const { Schema, model } = mongoose;
import { v4 as uuidv4 } from "uuid";

const CredentialSchema = new Schema(
    {
        id: { type: String, default: uuidv4, index: true, unique: true },
        listingId: { type: String, required: true },
        originalCredential: { type: [Schema.Types.Mixed], default: [] },
        updatedCredential: { type: [Schema.Types.Mixed], default: [] },
    },
    { timestamps: true }
);

export default model("Credential", CredentialSchema);
