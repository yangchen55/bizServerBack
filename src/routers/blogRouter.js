import express from "express";
import { createBlog, deleteBlogMethod, getAllBlog, updateBlog } from "../models/BlogModel.js";

import slugify from "slugify";
const router = express.Router();
import multer from "multer";
import fs from "fs";
import path from "path";


const imgFolderPath = 'public/img/uploads';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let error = null;
        // validation error check
        cb(error, imgFolderPath);
    },
    filename: (req, file, cb) => {
        let error = null;
        const fullFileName = Date.now() + "_" + file.originalname;
        cb(error, fullFileName);
    },
});

const upload = multer({ storage });

router.post('/', upload.fields([{ name: 'contentImage' }, { name: 'profilePic' }]), async (req, res, next) => {
    try {

        req.body.contentImage = req.files.contentImage[0]['path'];
        req.body.profilePic = req.files.profilePic[0]['path']
        const selectedTags = req.body.blogTag;
        const tagString = selectedTags.split(',');
        req.body.blogTag = tagString

        const { _id } = await createBlog(req.body);
        _id
            ? res.json({
                status: "success",
                message: "Blog has been added successfully",
            })
            : res.json({
                status: "error",
                message: "Error!, unable to add blog, please try again later",
            });

    } catch (error) {
        if (error.message.includes("E11000 duplicate key error collection")) {
            error.errorCode = 200;
            error.message =
                "There is already another product has same slug, Pelase change the produt name and try agnain later.";
        }
        next(error);
    }


});


// router.post("/", upload.array('images', 2), async (req, res, next) => {
//     try {
//         const contentImage = req.files[0]["path"];
//         const profilePic = req.files[1]["path"];
//         const selectedTags = req.body.blogTag;
//         const tagString = selectedTags.split(',');
//         req.body.contentImage = contentImage;
//         req.body.profilePic = profilePic;
//         req.body.blogTag = tagString
//         console.log(tagString)
//         const { _id } = await createBlog(req.body);

//         _id
//             ? res.json({
//                 status: "success",
//                 message: "Blog has been added successfully",
//             })
//             : res.json({
//                 status: "error",
//                 message: "Error!, unable to add blog, please try again later",
//             });
//     } catch (error) {
//         if (error.message.includes("E11000 duplicate key error collection")) {
//             error.errorCode = 200;
//             error.message =
//                 "There is already another product has same slug, Pelase change the produt name and try agnain later.";
//         }
//         next(error);
//     }


// });

router.get("/", async (req, res, next) => {
    try {
        const blogs = await getAllBlog();
        res.json({
            status: "success",
            message: "Blog lists are here",
            blogs,
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/:_id", async (req, res, next) => {
    try {
        const { _id } = req.params;
        if (_id) {
            const result = await deleteBlogMethod(_id);
            if (result?._id) {
                return res.json({
                    status: "success",
                    message: "Blog has been deleted successfully!",
                });
            }
        }

        res.json({
            status: "error",
            message: "Unable to delete the blog. Invalid request.",
        });
    } catch (error) {
        next(error);
    }
});

router.put('/', upload.fields([{ name: 'contentImage' }, { name: 'profilePic' }]), async (req, res, next) => {
    try {
        console.log(req.files, '......................');

        // Set flags to determine whether new images were selected
        let newContentImageSelected = false;
        let newProfilePicSelected = false;

        if (Object.keys(req.files).length > 0) {
            if (req.files.contentImage) {
                req.body.contentImage = req.files.contentImage[0]['path'];
                newContentImageSelected = true;
            }
            if (req.files.profilePic) {
                req.body.profilePic = req.files.profilePic[0]['path'];
                newProfilePicSelected = true;
            }
        }

        // Only update images if new images were selected
        if (!newContentImageSelected) {
            delete req.body.contentImage;
        }

        if (!newProfilePicSelected) {
            delete req.body.profilePic;
        }
        const selectedTags = req.body.blogTag;
        const tagString = selectedTags.split(',');
        req.body.blogTag = tagString



        const { _id } = await updateBlog(req.body);

        _id
            ? res.json({
                status: "success",
                message: "Blog has been edited successfully",
            })
            : res.json({
                status: "error",
                message: "Error!, unable to edit the blog, please try agin later",
            });
    } catch (error) {
        next(error);
    }
});

export default router;