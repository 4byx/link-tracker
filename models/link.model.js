import mongoose from 'mongoose';

const linkClickSchema = new mongoose.Schema({
    trackingId: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
    redirectUrl: {type : String, required : true},
    hits: { type: Number, default: 0 },
});

const LinkClick = mongoose.model('LinkClick', linkClickSchema);
export default LinkClick;