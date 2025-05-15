const path = require("path");
const fs = require("fs");

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { type } = req.body;
    if (!type || !["image", "audio"].includes(type)) {
      return res.status(400).json({ message: "Invalid media type" });
    }

    // Create URL for the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      message: "File uploaded successfully",
      url: fileUrl,
      type: type
    });
  } catch (err) {
    res.status(500).json({ message: "File upload failed", error: err.message });
  }
};
