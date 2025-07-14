const fs = require("fs").promises;
const path = require("path"); // path gives path to current directory

async  function initRepo() {
    const repoPath = path.resolve(process.cwd(), ".GitInit");  // this gives repo path
    const commitsPath = path.join(repoPath, "commits");

    try {
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitsPath, { recursive: true });
        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({ bucket: process.env.S3_BUCKET})
        );
        console.log("Repository Initialised")
    } catch(err) {
        console.log("Error initialising repository", err)
    }
}

module.exports = { initRepo };