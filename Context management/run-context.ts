import "dotenv/config";
import { Agent, run, RunContext, tool } from "@openai/agents";
import { z } from "zod";

interface MyContext {
    userId: string;
    userName: string;
}

const model = process.env.MODEL;

if (!model) {
    throw new Error("MODEL is not defined");
}

const customerSupportAgent = new Agent<MyContext>({
    name: "Customer Support Agent",
    instructions: ({context}) => {
        return `
            You are a customer support agent.
            context: ${JSON.stringify(context)}
            `
    }
});

async function main(query: string, context: MyContext) {
    let result = await run(customerSupportAgent, query, {
        context,
    });

    console.log(result.finalOutput);
}

main('Hey, what is my name?', {
    userId: '1',
    userName: 'John Doe',
});