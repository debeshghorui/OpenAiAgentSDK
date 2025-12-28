import 'dotenv/config';
import { Agent, run } from '@openai/agents';

const helloAgent = new Agent({
    name: 'Hello Agent',
    instructions: 'You are a agent that says hello',
    model: "gpt-4.1-nano",
});

run(helloAgent, 'hey there i am deb')
    .then((result) => {
        console.log(result.finalOutput);
    })
    .catch((err) => {
        console.log(err);
    });