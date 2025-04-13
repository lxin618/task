import React, { useState, useEffect, useRef } from "react";
import { FileInputComponent } from "./FileInputComponent";

interface Task {
    task_id: string;
    status: string;
}

export const TaskComponent = () => {

    const [file, setFile] = useState<File | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs for managing polling state
    const intervalIdRef = useRef(null);
    const retriesRef = useRef(0);
    const maxRetries = 3;
    // Poll every 10 seconds
    const pollInterval = 10000;

    useEffect(() => {
        // Clean up polling on component unmount
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, []);

    const handleRetry = () => {
        retriesRef.current += 1;
        if (retriesRef.current >= maxRetries) {
            setError("Polling failed after 3 retries.");
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        }
    };

    const taskSubmission = async (file: File) => {

        setLoading(true);
        retriesRef.current = 0;

        try {
            // simulate API call to submit the file
            const response = { task_id: Math.random().toString(36).substring(2, 6) };
            const task_id = response.task_id;

            const newTask: Task = { task_id, status: "Pending" };
            setTasks((prevTasks: Task[]) => [...prevTasks, newTask]);

            pollTaskStatus(task_id);
        } catch (error) {
            setError("Failed to submit file");
            setLoading(false);
        }
    }

    const pollTaskStatus = (task_id: string) => {

        // Start polling
        intervalIdRef.current = setInterval(async () => {
            try {
                // Simulate network failure 20% of the time
                if (Math.random() < 0.2) {
                    throw new Error("Network failure");
                }

                // Simulate backend response
                // Successful 2nd poll
                const response = retriesRef.current < 1 ? { status: "Pending" } : { status: "Successful" };
                const status = response.status;

                // if not pending means BE gives a response
                // can stop polling now
                if (status !== "Pending") {
                    setTasks((prevTasks: Task[]) =>
                        prevTasks.map((task) =>
                            task.task_id === task_id ? { ...task, status } : task
                        )
                    );
                    clearInterval(intervalIdRef.current!);
                    intervalIdRef.current = null;
                }
                // otherwise keep going till retry over 3 or BE gives proper response 
                else {
                    handleRetry();
                }
            } catch (err) {
                handleRetry();
            }
        }, pollInterval);
    }

    const handleFileSelect = (file: File) => {
        setFile(file);
        taskSubmission(file);
    };
    
    const handleCancelTask = (task_id: string) => {
        setTasks((prevTasks: Task[]) => prevTasks.filter((task) => task.task_id !== task_id));
    };


    return (
        <div>
            <h2>File Upload and Status Tracking</h2>
            <FileInputComponent onFileSelect={handleFileSelect} />

            {loading && <div>Uploading...</div>}

            {error && <div>{error}</div>}

            <div>
                <h3>Task List</h3>
                <ul>
                    {tasks.map((task: Task) => (
                    <li key={task.task_id}>
                        <span>Task ID: {task.task_id}</span> | Status: {task.status}{" "}
                        <button onClick={() => handleCancelTask(task.task_id)}>
                            Cancel Task
                        </button>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
