"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const passport_config_1 = __importDefault(require("./config/passport.config"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const errorHandler_util_1 = require("./utils/errorHandler.util");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const express_session_1 = __importDefault(require("express-session"));
require("./config/passport.config");
dotenv_1.default.config();
const portEnv = process.env.PORT;
if (!portEnv) {
    console.error("Error: PORT is not defined in .env file");
    process.exit(1);
}
const PORT = parseInt(portEnv, 10);
if (isNaN(PORT)) {
    console.error("Error: PORT is not a number in .env file");
    process.exit(1);
}
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
    credentials: true,
    allowedHeaders: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
};
app.use((0, express_session_1.default)({
    secret: 'da5rk4mor3al6ly8greym3n',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport_config_1.default.initialize());
app.use(passport_config_1.default.session());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api/v1/users", user_route_1.default);
app.use("/api/v1/courses", course_route_1.default);
app.use("/api/v1/auth", auth_route_1.default);
app.use(errorHandler_util_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
