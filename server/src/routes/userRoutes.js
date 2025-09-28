import { Router } from "express";
import { getGuideline, getGuidelines, getScheme, getSchemes, getUser, loginUser, logoutUser, registerUser } from "../controllers/userControllers.js";


const router=Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',logoutUser)
router.get('/getUser',getUser)
router.get('/getSchemes',getSchemes)
router.get('/scheme/:id',getScheme)
router.get('/getGuidelines',getGuidelines)
router.get('/guideline/:id',getGuideline)

export default router