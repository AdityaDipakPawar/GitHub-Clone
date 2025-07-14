const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");


const yargs = require("yargs");  // Yargs helps you build interactive command line tools, by parsing arguments and generating an elegant user interface
const { hideBin } = require("yargs/helpers"); // this helps to read input argument

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

yargs(hideBin(process.argv))
    .command("start", "Start a new server", {}, startServer)
    .command("init", "Initialise a new repository", {}, initRepo)
    .command("add <file>", "Add a file to Repository", (yargs) => { yargs.positional("file", { describe: "File to add to the staging area", type: "string" }); }, (argv) => { addRepo(argv.file); })
    .command("commit <message>", "Commit the staged files", (yargs) => { yargs.positional("message", { describe: "Commit message", type: "string" }); }, (argv) => { commitRepo(argv.message); })
    .command("push", "Push commits", {}, pushRepo)
    .command("pull", "Pull commits", {}, pullRepo)
    .command("revert <commitID>", "Revert commit", (yargs) => { yargs.positional("commitID", { describe: "Commit ID to revert to", type: "string" }); }, (argv) => { revertRepo(argv.commitID); })
    .demandCommand(1, "You need atleast one command").showCompletionScript().argv;

function startServer() {
    const app = express();
    const port = process.env.PORT || 3002;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGODB_URI;

    mongoose
        .connect(mongoURI)
        .then(() => console.log("MongoDB Connected!"))
        .catch((err) => console.error("Unable to Connect: ", err));

    app.use(cors({ 
        origin: 'http://localhost:5173',
        credentials: true
    }));

    

    app.use("/", mainRouter);

    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        socket.on("joinRoom", (userID) => {
            user = userID;
            console.log("====");
            console.log(user);
            console.log("====");
            socket.join(userID);
        })
    });

    const db = mongoose.connection;

    db.once("open", async () => {
        console.log("CRUD operations called");
    });

    httpServer.listen(port, () => {
        console.log(`Server is running on PORT ${port}`);
    });
}