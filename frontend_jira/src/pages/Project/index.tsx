// React
import { useEffect, useState } from "react";

// API
import { fetchData } from "../../services/api";

// Interface
import type { Project } from "../../types";

export default function ProjectPage() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetchData("/api/project/").then(res => {
            setProjects(res.project)
        })
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">My Jira Projects</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projects.map(p => (
                <div key={p.id} className="p-4 border rounded-lg hover:shadow-lg transition cursor-pointer bg-white">
                    <h3 className="font-semibold text-blue-600">{p.name}</h3>
                    <p className="text-sm text-gray-500">Create by: {p.creator.name}</p>
                </div>
                ))}
            </div>
        </div>
    );
}