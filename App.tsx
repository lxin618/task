// flat file strucutre for easiler readability, no need for nesting file structure

import React from "react";
import './App.css';
import { TaskComponent } from "./TaskComponent";

const App = () => {
    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <TaskComponent />
        </div>
    );
};

export default App;