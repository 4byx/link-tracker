// models/userLinkVisit.js

import mongoose from 'mongoose';

const userLinkVisitSchema = new mongoose.Schema({
    linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'LinkClick', required: true }, // Reference to LinkClick model
    timestamp: { type: Date, default: Date.now },
});

const UserLinkVisit = mongoose.model('UserLinkVisit', userLinkVisitSchema);

export default UserLinkVisit;
