import { Client } from "@upstash/workflow";
import { QSTASH_TOKEN, QSTASH_URL } from "./env.js";

const client = new Client({
  url: QSTASH_URL,
  token: QSTASH_TOKEN,
});

export const workflowClient = client;
export default client;
