import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, ".env") })

import Post from "./models/Post.js"

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        const ids = ["6923667bd07f7bce368a5476", "692365c1d07f7bce368a53e2"]

        for (const id of ids) {
            const post = await Post.findById(id)
            console.log(`POST ${id} EXISTS: ${!!post}`)
            if (post) {
                console.log(`   - Title: ${post.itemName}`)
                console.log(`   - Status: ${post.status}`)
            }
        }

        mongoose.disconnect()
    } catch (err) {
        console.error(err)
        mongoose.disconnect()
    }
}

run()
