# [Human in the loop](https://openai.github.io/openai-agents-js/guides/human-in-the-loop/)

This guide demonstrates how to use the built-in human-in-the-loop support in the SDK to pause and resume agent runs based on human intervention.

The primary use case for this right now is asking for approval for sensitive tool executions.

## Approval requests

You can define a tool that requires approval by setting the needsApproval option to true or to an async function that returns a boolean.

```typescript
import { tool } from '@openai/agents';
import z from 'zod';

const sensitiveTool = tool({
  name: 'cancelOrder',
  description: 'Cancel order',
  parameters: z.object({
    orderId: z.number(),
  }),
  // always requires approval
  needsApproval: true,
  execute: async ({ orderId }, args) => {
    // prepare order return
  },
});

const sendEmail = tool({
  name: 'sendEmail',
  description: 'Send an email',
  parameters: z.object({
    to: z.string(),
    subject: z.string(),
    body: z.string(),
  }),
  needsApproval: async (_context, { subject }) => {
    // check if the email is spam
    return subject.includes('spam');
  },
  execute: async ({ to, subject, body }, args) => {
    // send email
  },
});
```
