import "dotenv/config";
import { Agent, run } from "@openai/agents";

const model = process.env.MODEL;

if (!model) {
    throw new Error("MODEL is not defined");
}


const agent = new Agent({
    name: 'Storyteller',
    instructions:
        'You are a storyteller. You will be given a topic and you will tell a story about it.',
});

// Add a Generator function
async function* streamOutput(query: string) {
    const result = await run(agent, query, {
        stream: true,
    });

    const stream = result.toTextStream();

    for await (const chunk of stream) {
        yield { isCompleted: false, value: chunk };
    }

    yield { isCompleted: true, value: result.finalOutput };
}

async function main(query: string) {
    for await (const chunk of streamOutput(query)) {
        console.log(chunk);
    }
}

main('Tell me a story about a cat.');