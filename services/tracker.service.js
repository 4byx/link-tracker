import LinkClick from '../models/link.model.js';
import UserLinkVisit from '../models/userLinkVisit.model.js';
import { v4 as uuidv4 } from 'uuid';


class TrackingService {
    constructor() {}

    async generateTrackingLink(originalUrl) {
        const trackingId = uuidv4();
    
        const linkClick = new LinkClick({
            trackingId,
            originalUrl,
            redirectUrl : `${process.env.BASE_URL}/api/v1/track/${trackingId}`
        });
        await linkClick.save();
    
        return `${process.env.BASE_URL}/api/v1/track/${trackingId}`;
    }
    
    async getOriginalUrl(trackingId) {
        const linkClick = await LinkClick.findOne({ trackingId });
        return linkClick ? linkClick.originalUrl : null;
    }
    
    async logClickEvent(trackingId, timestamp) {
        await LinkClick.updateOne(
            { trackingId },
            { $set: {timestamp }, $inc: { hits: 1 } }
        );

        // Create a new document in UserLinkVisit collection
        const linkClick = await LinkClick.findOne({ trackingId });
        if (linkClick) {
            const userLinkVisit = new UserLinkVisit({
                linkId: linkClick._id,
                timestamp,
            });
            await userLinkVisit.save();
        }
    }

    // async getAllStats() {
    //     const allLinks = await LinkClick.find({});
    //     const stats = await UserLinkVisit.aggregate([
    //         {
    //             $group: {
    //                 _id: {
    //                     linkId: "$linkId",
    //                     date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
    //                 },
    //                 count: { $sum: 1 },
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: "$_id.linkId",
    //                 visits: {
    //                     $push: {
    //                         date: "$_id.date",
    //                         hits: "$count",
    //                     },
    //                 },
    //             },
    //         },
    //     ]);

    //     return allLinks.map(link => {
    //         const linkStats = stats.find(stat => stat._id.equals(link._id));
    //         return {
    //             redirectUrl : link.redirectUrl,
    //             originalUrl: link.originalUrl,
    //             visits: linkStats ? linkStats.visits : [],
    //             hits: link.hits,
    //         };
    //     });
    // }

    async getAllStats() {
        const allLinks = await LinkClick.find({});
        
        // Calculate the date for 4 days ago
        const fourDaysAgo = new Date();
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    
        const stats = await UserLinkVisit.aggregate([
            {
                $match: {
                    timestamp: { $gte: fourDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        linkId: "$linkId",
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: "$_id.linkId",
                    visits: {
                        $push: {
                            date: "$_id.date",
                            hits: "$count",
                        },
                    },
                },
            },
            {
                $project: {
                    visits: { $slice: ["$visits", -4] } // Get only the last 4 visits
                }
            },
            {
                $unwind: "$visits" // Flatten the visits array to sort them by date
            },
            {
                $sort: {
                    "visits.date": 1 // Sort visits by date
                }
            },
            {
                $group: {
                    _id: "$_id",
                    visits: {
                        $push: "$visits"
                    }
                }
            }
        ]);
    
        return allLinks.map(link => {
            const linkStats = stats.find(stat => stat._id.equals(link._id));
            return {
                redirectUrl: link.redirectUrl,
                originalUrl: link.originalUrl,
                visits: linkStats ? linkStats.visits : [],
                hits: link.hits,
            };
        });
    }
    

}


export default TrackingService;