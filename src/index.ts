import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "./config/passport.config";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import { errorHandler } from "./utils/errorHandler.util";
import authRoutes from "./routes/auth.route";
import session from "express-session";
import "./config/passport.config"
import deleteUnverifiedUser from "./cronJob/DeleteUnverifiedUsers";
import enrollmentRouter from "./routes/enrollment.route";


dotenv.config();
deleteUnverifiedUser()

const portEnv = process.env.PORT;
if(!portEnv){
    console.error("Error: PORT is not defined in .env file");
    process.exit(1);
}

const PORT:number = parseInt(portEnv, 10);
if(isNaN(PORT)){
    console.error("Error: PORT is not a number in .env file");
    process.exit(1);
}

const app = express();
const corsOptions = {
    origin:
    "*",
    credentials: true,
    allowedHeaders: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
};

app.use(session({
    secret: 'da5rk4mor3al6ly8greym3n',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24
    }   
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1/users", userRouter)
app.use("/api/v1/courses", courseRouter)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/enrollments", enrollmentRouter)

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
});