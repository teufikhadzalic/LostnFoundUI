import mongoose from "mongoose"
import dotenv from "dotenv"
import Post from "./backend/models/Post.js"

dotenv.config({ path: "./backend/.env" })

async function checkImageFormat() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        const post = await Post.findOne({ image: { $exists: true } })
        if (post) {
            console.log("Image sample (first 100 chars):", post.image.substring(0, 100))
            console.log("Total length:", post.image.length)
        } else {
            console.log("No posts with images found.")
        }
        await mongoose.disconnect()
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

checkImageFormat()
