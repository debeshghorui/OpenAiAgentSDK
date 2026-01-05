import 'dotenv/config';
import { OpenAI } from 'openai';

const model = process.env.MODEL

if (!model) {
    throw new Error('MODEL is not defined');
}

// Making Client
const client = new OpenAI();

client.conversations.create({}).then((conversation) => {
    console.log(conversation);
    console.log(`Conversation Created: ${conversation.id}`);
});