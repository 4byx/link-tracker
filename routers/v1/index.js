import {Router} from 'express';
import TrackingController from '../../controller/tracking.controller.js';

const router = Router();
router.get('/health-check', (req, res) => {
    res.send('Server is up and running');
})

router.post('/create-url', TrackingController.create);
router.get('/track/:trackingId', TrackingController.redirect);
router.get('/stats',TrackingController.getAllStats);

export default router;