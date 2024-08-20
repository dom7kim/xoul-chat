// lib/questionData.js
import fs from 'fs';
import path from 'path';

export function getQuestionData() {
  const filePath = path.join(process.cwd(), 'public', 'questions.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}