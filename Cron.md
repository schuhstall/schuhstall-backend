# Cron Setup

By default, cron is not installed. If you want to use it, follow these instructions.

## Installation

```shell
yarn add node-cron
```

And optionally 

```shell
yarn add cron-parser
```

## Setup
Execute the scheduling commands in `server.ts`.

```typescript
cron.schedule('* * * * *', () => {..})
```