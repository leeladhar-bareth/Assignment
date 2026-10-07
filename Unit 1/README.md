# Word Frequency Counter — Node.js CLI Tool

## Overview

A simple command-line utility built with Node.js that analyzes any text file and reports how often each word appears. All words are normalized to lowercase so that variations in capitalization are treated as identical.

Example:

```text
Hello, HELLO, hello
```

Results in:

```text
hello : 3
```

The program also gracefully handles common issues such as a missing argument, a non-existent file, or an empty input file.

---

## Key Capabilities

* Accepts the target file name via command-line arguments (`process.argv`)
* Reads the file asynchronously with `fs/promises`
* Counts occurrences of every distinct word
* Normalizes text to lowercase
* Strips punctuation and special characters
* Prints a clean frequency report in the terminal
* Validates that a filename was supplied
* Detects and reports missing files
* Detects and reports empty files
* Written with modern ES Module syntax

---

## Tech Stack

* Node.js
* JavaScript (ES Modules)
* Node.js File System API (`fs/promises`)

---

## Directory Layout

```text
Unit 1/
│
├── app.js
├── sample.txt
├── package.json
└── README.md
```

---

## Setup

Ensure Node.js is installed on your system.

Verify the installation:

```bash
node --version
```

The included `package.json` already sets the module type:

```json
{
  "type": "module"
}
```

---

## Running the Application

Execute the tool with:

```bash
node app.js <filename>
```

### Quick Example

```bash
node app.js sample.txt
```

---

## Sample Input File

Contents of `sample.txt`:

```text
Programming with JavaScript is fun.
JavaScript helps build interactive websites.
Learning JavaScript improves problem solving skills.
Many developers love JavaScript for its versatility.
```

---

## Expected Output

Command:

```bash
node app.js sample.txt
```

Result:

```text
Word Frequency:

programming : 1
with : 1
javascript : 4
is : 1
fun : 1
helps : 1
build : 1
interactive : 1
websites : 1
learning : 1
improves : 1
problem : 1
solving : 1
skills : 1
many : 1
developers : 1
love : 1
for : 1
its : 1
versatility : 1
```

---

## Error Messages

### Missing filename

```bash
node app.js
```

```text
Error: Please provide a filename.
Usage: node app.js <filename>
```

### File does not exist

```bash
node app.js missing.txt
```

```text
Error: File "missing.txt" not found.
```

### Empty file

```bash
node app.js empty.txt
```

```text
Error: The file is empty.
```

---

## Internal Workflow

1. Retrieve the filename from `process.argv[2]`.
2. Attempt to read the file using `fs.readFile()`.
3. Reject empty content.
4. Convert the entire text to lowercase.
5. Split the text into words using a regular expression that removes non-word characters.
6. Maintain a frequency map (plain object).
7. Print each word and its count.

---

## Core Concepts Demonstrated

### Command-line arguments

```javascript
const filePath = process.argv[2]
```

### Asynchronous file reading

```javascript
import fs from "node:fs/promises"
```

### Word extraction

```javascript
fileContent
    .toLowerCase()
    .split(/[\W]+/)
    .filter((word) => word)
```

### Frequency tracking

```javascript
const wordsCount = {}
```

---

## Learning Goals

This assignment practices:

* Building a Node.js CLI application
* Working with process arguments
* Reading files from disk
* String processing and regular expressions
* Using objects as hash maps
* Iteration with `forEach` / `for...of`
* Proper error handling
* ES Module imports

---

## Author

**Leeladhar Bareth**

### Project Title

**Word Frequency Counter — Node.js CLI Tool**
