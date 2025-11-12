import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({ path: "./backend/.env" })

async function fixIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Drop the problematic unique index
    await mongoose.connection.collection("users").dropIndex("npm_1")
    console.log("Dropped npm_1 index")

    // Recreate as sparse (allows multiple empty/null values)
    await mongoose.connection.collection("users").createIndex(
      { npm: 1 },
      { unique: true, sparse: true }
    )
    console.log("Created npm_1 index as sparse")

    await mongoose.disconnect()
  } catch (err) {
    console.error("Error:", err.message)
    process.exit(1)
  }
}

fixIndex()


//ONLY USE IF REGIS PROBLEM SHIZZZZZ