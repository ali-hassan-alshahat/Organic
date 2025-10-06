import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFolders = ["fruits", "vegetables", "bread", "snacks", "oil"];
const basePath = path.resolve("../client/src/assets");
const uploadedFile = "uploaded_images.json";

// Load already uploaded list (if it exists)
let uploaded = [];
if (fs.existsSync(uploadedFile)) {
  uploaded = JSON.parse(fs.readFileSync(uploadedFile));
}

async function uploadImages() {
  const allResults = [...uploaded];
  for (const folder of uploadFolders) {
    const folderPath = path.join(basePath, folder);
    const files = fs
      .readdirSync(folderPath)
      .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file));
    console.log(`Uploading ${files.length} images from "${folder}"`);
    for (const file of files) {
      // Skip if already uploaded
      if (uploaded.find((u) => u.file === file && u.folder === folder)) {
        console.log(`Skipped (already uploaded): ${file}`);
        continue;
      }
      const imagePath = path.join(folderPath, file);
      try {
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: `organic/${folder}`,
        });
        console.log(`${file} Uploaded`);
        allResults.push({
          folder,
          file,
          url: result.secure_url,
        });
      } catch (err) {
        console.error(`Failed to upload ${file}:`, err.message);
      }
    }
    console.log(`Finished uploading folder: ${folder}`);
  }
  fs.writeFileSync(uploadedFile, JSON.stringify(allResults, null, 2));
  console.log(
    `All uploads complete ${allResults.length} total images uploaded.`,
  );
  process.exit(0);
}

uploadImages();
