export type Task = {
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    status: "pending" | "in-progress" | "completed";
    important: boolean;
    createdAt: string;
    updatedAt: string;
};
