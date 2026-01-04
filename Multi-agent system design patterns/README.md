# [Multi-agent system design patterns](openai.github.io/openai-agents-js/guides/agents/)

There are many ways to compose agents together. Two patterns we regularly see in production apps are:

1. Manager (agents as tools) – a central agent owns the conversation and invokes specialized agents that are exposed as tools.
2. Handoffs – the initial agent delegates the entire conversation to a specialist once it has identified the user’s request.

These approaches are complementary. Managers give you a single place to enforce guardrails or rate limits, while handoffs let each agent focus on a single task without retaining control of the conversation.
