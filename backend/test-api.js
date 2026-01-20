import { GoogleGenerativeAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Gemini API Configuration...\n');

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

console.log('✅ API Key found:', process.env.GEMINI_API_KEY.substring(0, 20) + '...\n');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test different model names
const modelsToTest = [
  'gemini-pro',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro'
];

async function testModel(modelName) {
  try {
    console.log(`Testing model: ${modelName}...`);
    
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent('Say "Hello World" in one word');
    const response = result.response;
    const text = response.text();
    
    console.log(`✅ ${modelName} WORKS!`);
    console.log(`   Response: ${text.trim()}\n`);
    
    return true;
  } catch (error) {
    console.log(`❌ ${modelName} FAILED`);
    console.log(`   Error: ${error.message}\n`);
    
    return false;
  }
}

// Test all models
async function testAllModels() {
  console.log('📋 Testing available models...\n');
  
  let workingModel = null;
  
  for (const modelName of modelsToTest) {
    const works = await testModel(modelName);
    if (works && !workingModel) {
      workingModel = modelName;
    }
  }
  
  console.log('=' .repeat(50));
  
  if (workingModel) {
    console.log(`\n✨ SUCCESS! Use this model: "${workingModel}"`);
    console.log(`\nUpdate chatbot.config.js with:`);
    console.log(`model: '${workingModel}',\n`);
  } else {
    console.log('\n❌ No working models found!');
    console.log('\nPossible issues:');
    console.log('1. Invalid API key');
    console.log('2. API key not activated');
    console.log('3. Region restrictions');
    console.log('\nGet a new API key at: https://aistudio.google.com/app/apikey\n');
  }
}

testAllModels().catch(console.error);
