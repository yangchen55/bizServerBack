import mongoose from "mongoose"

export const dbConnect = async () => {
    try {
        mongoose.set("strictQuery", true);
        const conn = await mongoose.connect(process.env.MONGO_CLIENT);
        conn?.connections
            ? console.log("DB connected successfully")
            : console.log("unable to connect mongodb, please check again");

    } catch (error) {
        console.log(error);

    }

}

