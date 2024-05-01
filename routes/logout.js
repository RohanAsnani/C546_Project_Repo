import { Router } from "express";
const router = Router();


router.route('/')
    .get(async (req, res) => {
        try {
            req.session.destroy();
            return res.render('logout', { title: 'Logout', hidden: "hidden" });
        } catch (e) {
            return res.json({ error: e.message });
        }
    });




export default router