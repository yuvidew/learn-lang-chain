import { Hono } from "hono";
import { handle } from "hono/vercel";
import ai_contract_analyzer from "@/features/ai-contract-analyzer/server/route"

const app = new Hono().basePath("/api");

const routes = app
    .route("/ai-contract-analyzer" , ai_contract_analyzer)
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;