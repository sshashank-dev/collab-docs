const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const commentRoutes = require("./routes/commentRoutes");
const versionRoutes =
    require("./routes/versionRoutes");
const activityRoutes = require("./routes/activityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


dotenv.config();

const app = express();

// ==============================
// Middleware
// ==============================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
            process.env.FRONTEND_URL,
        ].filter(Boolean),
        credentials: true,
    })
);

app.use(express.json());

// ==============================
// Database
// ==============================

connectDB();

// ==============================
// Routes
// ==============================

app.get("/", (req, res) => {
    res.json({
        message: "CollabDocs API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/comments", commentRoutes);
app.use(
    "/api/versions",
    versionRoutes
);
app.use(
    "/api/activities",
    activityRoutes
);
app.use(
    "/api/notifications",
    notificationRoutes
);

// ==============================
// Server
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server running on http://localhost:${PORT}`
    );
});