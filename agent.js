import 'dotenv/config';
import { Agent, run } from '@openai/agents';

const model = process.env.MODEL

if (!model) {
    throw new Error('MODEL is not defined');
}

const helloAgent = new Agent({
    name: 'Hello Agent',
    instructions: 'You are a agent that says hello',
    model: model,
});

run(helloAgent, 'hey there i am deb')
    .then((result) => {
        console.log(result.finalOutput);
    })
    .catch((err) => {
        console.log(err);
    });