import React, { useState } from "react";
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

    const taskSubmission = async (file: File) => {

        setLoading(true);

        try {
            // simulate API call to submit the file
            // random taskid
            const response = { task_id: Math.random().toString(36).substring(2, 6) };
            const task_id = response.task_id;
      
            const newTask: Task = { task_id, status: "Pending" };
            setTasks((prevTasks:  Task[]) => [...prevTasks, newTask]);
      
            pollTaskStatus(task_id);

          } catch (error) {
            setError("Failed to submit file");
            setLoading(false);
          }
    }

    const pollTaskStatus = (task_id: string) => {

        let retries = 0;

        // poll every 10 secs
        const intervalId = setInterval(async () => {

            try {
                // simulate API call to get task status
                // simluate a delay, only change status after 1st try
                const response = retries < 1 ? { status: "Pending" } : {status: "Successful"};
                const status = response.status;

                // stop processing if not pending
                // update status
                if (status != 'Pending') {
                    setTasks((prevTasks: Task[]) =>
                        prevTasks.map((task) =>
                            task.task_id === task_id ? { ...task, status } : task
                        )
                    );
                    clearInterval(intervalId);
                }
                // else increment counter to retry
                else {
                    retries += 1;
                }

            }
            catch(error) {
                // just stop here if something wrong to stop loading server
                clearInterval(intervalId);
                setError("Failed to poll the file - server side error");
            }

        }, 10000)

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