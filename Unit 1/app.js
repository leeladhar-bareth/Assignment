
import fs from "node:fs/promises"

const filePath = process.argv[2]

if (!filePath) {
    console.log("Error: Please provide a filename.")
    console.log("Usage: node app.js <filename>")
    process.exit(1)
}

try {
    const fileContent = await fs.readFile(filePath, "utf-8")

    if (!fileContent.trim()) {
        console.log("Error: The file is empty.")
        process.exit(1)
    }

    const wordsArray = fileContent
        .toLowerCase()
        .split(/[\W]+/)
        .filter((word) => word)

    const wordsCount = {}

    wordsArray.forEach((word) => {
        if (word in wordsCount) {
            wordsCount[word] += 1
        } else {
            wordsCount[word] = 1
        }
    })

    console.log("Word Frequency:\n")
    for (const [word, count] of Object.entries(wordsCount)) {
        console.log(`${word} : ${count}`)
    }
} catch (error) {
    if (error.code === "ENOENT") {
        console.log(`Error: File "${filePath}" not found.`)
    } else {
        console.log("Error:", error.message)
    }
    process.exit(1)
}
