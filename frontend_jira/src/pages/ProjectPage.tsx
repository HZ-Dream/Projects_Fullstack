// import { useEffect, useState } from "react";
// import { getProjects } from "../services/api";

// interface Project {
//     id: number;
//     name: string;
// }

export default function ProjectPage() {
    // const [projects, setProjects] = useState<Project[]>([]);

    // useEffect(() => {
    //     getProjects().then(setProjects);
    // }, []);

    return (
        <div>
            <h1 className="text-3xl text-red-500">Project</h1>
            {/* {projects.map(p => (
                <div key={p.id}>{p.name}</div>
            ))} */}
        </div>
    );
}