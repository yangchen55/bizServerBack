import BlogSchema from "./BlogSchema.js";

export const createBlog = (obj) => {
    return BlogSchema(obj).save();
};

export const getAllBlog = () => {
    return BlogSchema.find();
};


export const deleteBlogMethod = (_id) => {
    return BlogSchema.findByIdAndDelete(_id);
};


export const updateBlog = ({ _id, ...rest }) => {
    return BlogSchema.findByIdAndUpdate(_id, rest);
};