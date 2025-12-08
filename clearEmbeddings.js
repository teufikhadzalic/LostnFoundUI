import mongoose from "mongoose"
import dotenv from "dotenv"
import Post from "./backend/models/Post.js"

dotenv.config({ path: "./backend/.env" })

async function clearEmbeddings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB")

        // Unset embeddings for all posts
        const res = await Post.updateMany({}, { $unset: { embedding: "" } })
        console.log(`Cleared embeddings for ${res.modifiedCount} posts.`)

        await mongoose.disconnect()
        console.log("Done.")
    } catch (err) {
        console.error("Error:", err)
        process.exit(1)
    }
}

clearEmbeddings()
