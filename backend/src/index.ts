// Imports
import express = require("express");
import cors = require("cors");
import stockRoutes = require("./routes/stockRoutes")

// Create Express App
const app = express();

app.use(express.json());

const PORT = 3000;


// Allow requests from the frontend
app.use(cors({ origin: "http://localhost:5173" }));

// Connect stock routes
app.use("/api/stocks", stockRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

