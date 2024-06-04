import app from "./src/app";

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.info("Server is stopped");
  });
});
