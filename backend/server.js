const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Import routes
const customersRouter = require("./routes/customers");
const ordersRouter = require("./routes/orders");
const audiencesRouter = require("./routes/audiences");
const campaignsRoutes = require("./routes/campaigns");
const messagesRouter = require("./routes/messages");
const campaignsRouter = require("./routes/campaigns");

// Use routes
app.use("/api/customers", customersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/audiences", audiencesRouter);
app.use("/api/campaigns", campaignsRoutes);
app.use("/api/messages", messagesRouter);
app.use("/api/campaigns", campaignsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

console.log("Server setup complete. API endpoints:");
console.log("GET & POST /api/customers - Manage customers");
console.log("GET & POST /api/orders - Manage orders");
console.log("GET & POST /api/audiences - Manage audiences");
