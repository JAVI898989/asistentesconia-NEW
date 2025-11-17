import serverless from "serverless-http";
import { createServer } from "../../server";

let handler: any = null;

const initializeHandler = async () => {
  if (!handler) {
    const app = await createServer();
    handler = serverless(app);
  }
  return handler;
};

exports.handler = async (event: any, context: any) => {
  const serverlessHandler = await initializeHandler();
  return serverlessHandler(event, context);
};
