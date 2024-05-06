import { Router } from "express";
const router = Router();


router.route('/')
    .get(async (req, res) => {
        try {
            req.session.destroy();
            return res.render('logout', { title: 'Logout', hidden: "hidden" });
        } catch (e) {
            return res.status(400).json(e.message).render('error', {
                title: 'Error',
                class: 'error-class',
                message: e.message,
                previous_Route: '/hrc/login',
                linkMessage: 'Go back'
            });
        }
    });




export default router