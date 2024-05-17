import TrackingService from "../services/tracker.service.js";
const trackingService = new TrackingService();

// Endpoint to generate a tracking link
const create =  async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    try {
        const trackingLink = await trackingService.generateTrackingLink(originalUrl);
        res.json({ trackingLink });
    } catch (error) {
        console.log("==erro" , error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Endpoint to handle tracking link redirects
const redirect =  async (req, res) => {
    const { trackingId } = req.params;
    try {
        const originalUrl = await trackingService.getOriginalUrl(trackingId);
        if (!originalUrl) {
            return res.status(404).json({ error: 'Tracking link not found' });
        }
        // Log the click event
        await trackingService.logClickEvent(
            trackingId,
            new Date(),
            req.headers.referer
        );
        res.redirect(originalUrl);
    } catch (error) {
        console.log("==erro" , error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllStats = async (req, res) => {
    try {
        const allStats = await trackingService.getAllStats();
        res.json(allStats);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export default {
    create,
    redirect,
    getAllStats
};
