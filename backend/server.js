import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import config from "./src/config/env.js";

const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
  });
};
startServer();