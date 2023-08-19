import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

//db connect
import { dbConnect } from "./src/config/dbConfig.js";
dbConnect();

const __dirname = path.resolve();
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname)));

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API routers
import blogRouter from "./src/routers/blogRouter.js"
app.use("/api/v1/blog", blogRouter)
//root url request
app.use("/", (req, res, next) => {
    const error = {
        message: "You don't have permission here",
    };
    res.json(error);
});

//global error handler
app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.errorCode || 404;
    res.status(statusCode).json({
        status: "error",
        message: error.message,
    });
});

app.listen(PORT, (error) => {
    error
        ? console.log(error)
        : console.log(`Server running at http://localhost:${PORT}`, path.join(__dirname, "public"));
});