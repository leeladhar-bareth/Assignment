# Node.js CLI — Word Frequency Analyzer

## 📌 Project Description

This project is a Command Line Interface (CLI) application developed using **Node.js**. The application reads a text file provided through the command line and counts the frequency of each word present in the file.

The application converts words to lowercase so that uppercase and lowercase words are treated as the same.

For example:

```text
Node, NODE, node
```

are counted as:

```text
node : 3
```

The application also handles basic errors such as a missing filename, file not found, and an empty file.

---

## 🚀 Features

* Accepts filename using `process.argv`
* Reads file using Node.js `fs/promises`
* Counts the frequency of each word
* Converts words to lowercase
* Handles punctuation
* Displays word frequency in the terminal
* Handles missing filename
* Handles file-not-found error
* Handles empty files
* Uses modern ES Module syntax

---

## 🛠️ Technologies Used

* **Node.js**
* **JavaScript**
* **File System (`fs/promises`)**
* **ES Modules**

---

## 📁 Project Structure

```text
Unit 1/
│
├── app.js
├── sample.txt
├── package.json
└── README.md
```

---

## ⚙️ Installation

Make sure **Node.js** is installed on your computer.

Check Node.js version:

```bash
node --version
```

The `package.json` already contains:

```json
{
  "type": "module"
}
```

---

## ▶️ How to Run

Use the following command:

```bash
node app.js <filename>
```

### Example

```bash
node app.js sample.txt
```

---

## 📄 Sample Input

The `sample.txt` file contains:

```text
Node.js is awesome.
Node.js is powerful.
Node.js is easy to learn.
JavaScript and Node.js are popular.
```

---

## 💻 Sample Output

Run:

```bash
node app.js sample.txt
```

Output (after converting to lowercase):

```text
{
  node: 4,
  js: 4,
  is: 3,
  awesome: 1,
  powerful: 1,
  easy: 1,
  to: 1,
  learn: 1,
  javascript: 1,
  and: 1,
  are: 1,
  popular: 1
}
```

---

## ❌ Error Handling

### 1. Filename Not Provided

Command:

```bash
node app.js
```

Output:

```text
Error: Please provide a filename.
Usage: node app.js <filename>
```

### 2. File Not Found

Command:

```bash
node app.js abc.txt
```

Output:

```text
Error: File "abc.txt" not found.
```

### 3. Empty File

If the given file is empty:

```bash
node app.js empty.txt
```

Output:

```text
Error: The file is empty.
```

---

## 🔍 How It Works

The application follows these steps:

1. Gets the filename from `process.argv`.
2. Reads the file using `fs.readFile()`.
3. Checks whether the file is empty.
4. Converts the file content to lowercase.
5. Splits the content into individual words.
6. Stores each word and its count in an object.
7. Displays the word frequency in the terminal.

---

## 📌 Main Concepts Used

### `process.argv`

Used to receive the filename from the command line.

```javascript
const filePath = process.argv[2]
```

### `fs/promises`

Used to read the file asynchronously.

```javascript
import fs from "node:fs/promises"
```

### Word Splitting

The file content is converted into an array of words using:

```javascript
fileContent
    .toLowerCase()
    .split(/[\W]+/)
    .filter((word) => word)
```

### Word Counting

An object is used to store the frequency of each word:

```javascript
const wordsCount = {}
```

---

## 🎯 Objective

The main objective of this project is to demonstrate the use of:

* Node.js CLI
* Command-line arguments
* File handling
* String manipulation
* Regular expressions
* Objects
* Loops
* Error handling
* ES Modules

---

## 👨‍💻 Author

**Leeladhar Bareth**

### Project

**Node.js CLI — Word Frequency Analyzer**
