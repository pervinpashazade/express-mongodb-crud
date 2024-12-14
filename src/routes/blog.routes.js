import { Router } from "express"
import { BlogController } from "../controllers/blog.controller.js"
import { useAuth } from "../middlewares/auth.middleware.js"
import multer from "multer";
import { appConfig } from "../consts.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // const filename = Date.now() + "-" + file.originalname;
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename)
    }
})

// const upload = multer({ dest: 'uploads/' })

const upload = multer({
    storage,
    fileFilter: (_, file, cb) => {

        const arr = [1, 2, 3, 4]
        const searchResult = arr.find(item => item === 15)
        // [].every(item => item === 15)
        // [].some(item => item === 15)

        // const searchResultIndex = arr.indexOf(499) // 3 -> -1
        const num = 0
        if (num) {
            // ...
        } else {
            // ...
        }

        // if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        // if (appConfig.allowedImageTypes.includes(file.mimetype)) {
        if (appConfig.allowedImageTypes.indexOf(file.mimetype) !== -1) {
            cb(null, true)
        } else {
            cb(new Error("File type must be jpeg or png"), false)
        }
    }
})

export const blogRoutes = Router()
const controller = BlogController()

// -> /api/blog/create
blogRoutes.post("/create", useAuth, upload.single('img'), controller.create)

// -> /api/blog/list
blogRoutes.get("/list", controller.getList)
// -> /api/blog/123
blogRoutes.get("/:id", controller.getById)