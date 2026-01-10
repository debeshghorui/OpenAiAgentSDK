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

async function main(query: string) {
    const result = await run(agent, query, {
        stream: true,
    });

    result.toTextStream({ compatibleWithNodeStreams: true }).pipe(process.stdout);

    // for await (const chunk of stream) {
    //     // Printing chunks properly
    //     process.stdout.write(chunk);
    // }
}

main('Tell me a story about a cat.')