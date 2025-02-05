import Joi from "joi"
import { Blog } from "../models/blog.model.js"
import jwt from "jsonwebtoken";
import { appConfig } from "../consts.js";
import { User } from "../models/user.model.js";

// const count = 4;

// if (isNaN(count) === false) {
//     res.status(200).json(count)
// } else {
//     res.status(500).json(count)
// }

const create = async (req, res, next) => {

    // if (!req.file) return res.status(400).json({
    //     message: "Image required!",
    // })

    // return res.json(req.body) 

    const user = req.user;

    if (!user.isVerifiedEmail) return res.status(400).json({
        message: "User email not verified!",
    })

    const { title, description } = await Joi.object({
        title: Joi.string().trim().min(3).max(50).required(),
        description: Joi.string().trim().min(10).max(1000).required(),
        img: Joi.object().required(),
    }).validateAsync({
        ...req.body,
        img: req.file,
    }, { abortEarly: false })
        .catch(err => {
            return res.status(422).json({
                message: "Xeta bash verdi!",
                error: err.details.map(item => item.message)
            })
        })

    await Blog.create({
        title,
        description,
        user: user.id,
        img_path: req.file.filename,
    })
        .then(newBlog => res.status(201).json(newBlog))
        .catch(error => res.status(500).json({
            message: "Xeta bash verdi!",
            error,
        }))
}

const getList = async (req, res, next) => {
    try {
        const list = await Blog.find().populate("user", "fullname").select("_id title user img_path")

        // res.json(list.map(item => {
        //     return {
        //         id: item._id,
        //         ...item._doc,
        //         _id: undefined,
        //     }
        // }))

        res.json(list)
    } catch (error) {
        res.json({
            message: "Xeta bash Verdi!",
            error,
        })
    }
}

const getById = async (req, res, next) => {
    const id = req.params.id;
    if (!id) return res.json({
        message: "Id required",
    })
    const blog = await Blog.findById(id).populate("user", "fullname")

    res.json(blog)
}

export const BlogController = () => ({
    create,
    getList,
    getById,
})