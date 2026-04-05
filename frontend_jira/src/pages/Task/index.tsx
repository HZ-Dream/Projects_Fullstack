// React
import { useEffect, useState } from "react";

// API
import { fetchData } from "../../services/api";

// Interface
import type { Task } from '../../types';

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchData("/api/task/").then((res) => {
      setTasks(res.task);
    });
  }, []);

  return (
    <div className="flex gap-4 p-6 overflow-x-auto bg-gray-50 min-h-screen">
      {tasks.map((task) => ( // Đổi t thành task cho rõ nghĩa
        <div key={task.id} className="bg-white p-4 rounded-xl shadow-md min-w-75 border border-gray-200 h-fit">
          {/* Header Task */}
          <div className="mb-4">
            <span className="text-xs font-bold uppercase px-2 py-1 bg-blue-100 text-blue-600 rounded">
              {task.status}
            </span>
            <h2 className="font-bold text-xl text-gray-800 mt-2">{task.title}</h2>
          </div>

          <div className="space-y-4">
            {/* Project Info */}
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Project</p>
              <h3 className="text-sm font-medium text-gray-700">{task.project?.name}</h3>
            </div>

            {/* Members Section */}
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Members</p>
              <div className="flex flex-wrap gap-2">
                {/* Sửa lỗi ở đây: task.assignees thay vì tasks.assignees */}
                {task.assignees?.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center bg-gray-100 px-2 py-1 rounded-full border border-gray-200"
                    title={member.email}
                  >
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold mr-1">
                      {member.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-600">{member.email.split('@')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />
            
            {/* Footer Task */}
            <div className="flex justify-between items-center">
               <span className="text-[10px] text-gray-400">ID: #{task.id}</span>
               <div className="text-xs text-blue-500 font-medium">
                Owner: {task.creator.name}
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}