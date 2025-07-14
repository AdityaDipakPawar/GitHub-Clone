const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");


async function createRepository(req, res) {
    const { owner, name, issues, content, description, visibility } = req.body;
    
    try {
        if (!name) {
            return res.status(400).json({ error: "Repository name is required!"});
        }

        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Invalid User ID!"});
        }

        const newRepository = new Repository({
            name,
            description,
            visibility,
            owner,
            content,
            issues
        });

        const result = await newRepository.save();

        res.status(201).json({
            message: "Repository created!",
            repositoryID: result._id,
        })

    } catch (err) {
    console.error("Error during repository creation : ", err.message);
    res.status(500).send("Server error!");
  }
};

async function getAllRepositories(req, res) {
    try {
        const repositories = await Repository.find({})
            .populate("owner")
            .populate("issues");

        // Filter out repositories with invalid owner IDs
        const validRepositories = repositories.filter(repo => {
            return repo.owner && 
                   repo.owner._id && 
                   mongoose.Types.ObjectId.isValid(repo.owner._id) &&
                   repo.owner._id.toString() !== "undefined";
        });

        res.json(validRepositories);
    } catch (err) {
    console.error("Error during fetching repositories : ", err.message);
    res.status(500).send("Server error!");
  }
};

async function fetchRepositoryById(req, res) {
    const { id } = req.params;
  try {
    const repository = await Repository.find({ _id: id })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
};

async function fetchRepositoryByName(req, res) {
    const { name } = req.params;
  try {
    const repository = await Repository.find({ name })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
};

async function fetchRepositoriesForCurrentUser(req, res) {
    const userId = req.params.userID;

    try {
        // Validate the user ID first
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid User ID format!" });
        }

        const repositories = await Repository.find({ owner: userId });

        if(!repositories || repositories.length == 0) {
            return res.status(404).json({error:"User Repositories not found!"});
        }
        res.json({ message: "Repositories found!", repositories });
    } catch (err) {
    console.error("Error during fetching repositories : ", err.message);
    res.status(500).send("Server error");
  }
};

async function updateRepositoryById(req, res) {
    const { id } = req.params;
    const { name, description, visibility } = req.body;

    try {
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found!" });
        }

        // Update the fields if they are provided
        if (name !== undefined) {
            repository.name = name;
        }
        if (description !== undefined) {
            repository.description = description;
        }
        if (visibility !== undefined) {
            repository.visibility = visibility;
        }

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository updated successfully!",
            repository: updatedRepository,
        });
    } catch (err) {
        console.error("Error during updating repository : ", err.message);
        res.status(500).send("Server error");
    } 
};

async function toggleVisibilityById(req, res) {
    const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during toggling visibility : ", err.message);
    res.status(500).send("Server error");
  }
};

async function deleteRepositoryById(req, res) {
    const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send("Server error");
  }
};

async function cleanupInvalidRepositories(req, res) {
    try {
        // Find and remove repositories with invalid owner IDs
        const result = await Repository.deleteMany({
            $or: [
                { owner: { $exists: false } },
                { owner: null },
                { owner: "undefined" },
                { owner: { $type: "string", $regex: /^undefined$/ } }
            ]
        });

        res.json({
            message: `Cleaned up ${result.deletedCount} invalid repositories`,
            deletedCount: result.deletedCount
        });
    } catch (err) {
        console.error("Error during cleanup : ", err.message);
        res.status(500).send("Server error!");
    }
}

module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById,
    cleanupInvalidRepositories
}