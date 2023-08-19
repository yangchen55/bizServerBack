import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({

    title: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },
    contentImage: [
        {
            type: String,
        },
    ],
    author: {
        type: String,
        required: true,
    },
    profilePic: [
        {
            type: String,
        },

    ],

    // category: The category to which the blog post belongs(e.g., "Buying Tips," "Market Trends," "Home Improvement," etc.).
    blogCategory: {
        type: String,
        required: true,
    },
    // tags: An array of tags associated with the blog post.Tags can be used for better organization and search functionality.
    blogTag:
        [
            String
        ],

    status: [String]




},


    {
        timestamps: true,
    }
)

export default mongoose.model('Blog', blogSchema)
