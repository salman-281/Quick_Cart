import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/Models/userModel";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

//inngest Functions to save data in database

export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
    },
    {
        event: "clerk/user.created",
    },
    async ({ event }) => {
        const { id, first_name, last_name, image_url, email_addresses } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            imageUrl: image_url,
        }
        await connectDB();
        await User.create(userData);
    }
)

//update user data in database

export const syncUserUpdate = inngest.createFunction(
    {
        id: "update-user-from-clerk",
    },
    {
        event: "clerk/user.updated",
    },
    async ({ event }) => {
        const { id, first_name, last_name, image_url, email_addresses } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            imageUrl: image_url,
        }
        await connectDB();
        await User.findByIdAndUpdate(id, userData);
    }
)

//delete user data in database

export const syncUserDelete = inngest.createFunction(
    {
        id: "delete-user-from-clerk",
    },
    {
        event: "clerk/user.deleted",
    },
    async ({ event }) => {
        const { id } = event.data;
        await connectDB();
        await User.findByIdAndDelete(id);
    }
)