import express from 'express'
import { signup, login, logout, updateProfile, checkAuth ,deleteProfile} from '../controllers/auth.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",protectRoute,logout)

router.put("/update-profile",protectRoute,updateProfile)
router.delete("/delete-profile",protectRoute,deleteProfile)

router.get("/check", protectRoute, checkAuth)


export default router