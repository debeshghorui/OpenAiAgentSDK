import "dotenv/config";
import { Agent, run, RunContext, tool } from "@openai/agents";
import { z } from "zod";

interface MyContext {
    userId: string;
    userName: string;

    fetchUserInfo: () => Promise<string>;
}

const model = process.env.MODEL;

if (!model) {
    throw new Error("MODEL is not defined");
}

const getUserTool = tool({
    name: 'get_user_info',
    description: 'Get user information by user ID',
    parameters: z.object({}),
    execute: async (_, context?: RunContext<MyContext>): Promise<string | undefined> => {
        return await context?.context.fetchUserInfo();
    }
})

const customerSupportAgent = new Agent<MyContext>({
    name: "Customer Support Agent",
    instructions: ({ context }) => {
        return `
            You are a customer support agent.
            `
    },
    tools: [getUserTool],
    model,
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
    fetchUserInfo: async () => {
        return `UserId=1, UserName=John Doe`
    },
});