const fs = require('fs');
const path = require('path');

function writeBookDetails({ title, author, publisher }) {
  const outputDir = path.join(__dirname, '..', 'output');
  const outputFile = path.join(outputDir, 'book_details.txt');

  fs.mkdirSync(outputDir, { recursive: true });

  const content = `Title: ${title}\nAuthor: ${author}\nPublisher: ${publisher}\n`;
  fs.writeFileSync(outputFile, content, 'utf8');
}

module.exports = { writeBookDetails };
