import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import userRoutes from "./routes/user.js"
import ticketRoutes from "./routes/ticket.js"
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js"
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";

import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT
const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use("/api/inngest", serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreated]
}));

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MONGO CONNECTED");
        app.listen(3000, () => {
            console.log("server started" + 3000);
        })
    })
    .catch((error) => console.error("MONGO ERROR: ", error))