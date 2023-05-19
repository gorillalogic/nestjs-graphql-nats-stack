import { useCallback } from "react";
import { gql, useQuery, useMutation } from '@apollo/client';
import Task, { IResourceTask } from './Task';
import TaskNew from './TaskNew';
import { debounce } from "lodash"

const GET_TASKS_QUERY = gql`
  query GetTasks {
    tasks {
      id
      contents
      createdAt
      updatedAt
    }
  }
`;
 
export default function() {
  const getTasksProps = useQuery(GET_TASKS_QUERY);
  const animate = getTasksProps.loading ? "animate-pulse" : "animate-none";

  const debouncedGetTasks = useCallback(debounce((variables: any = {}) => {
    getTasksProps.refetch();
  }, 300), []);

  const tasksComp = (getTasksProps.data?.tasks ?? []).map((task: IResourceTask) => (
    <div className={`mx-5 ${animate}`} key={task.id}>
      <Task 
        taskRecord={task}
        onChange={() => { debouncedGetTasks() }}
      />
    </div>
  )) 
  const newTaskComp = (
    <div className={`my-5 ${animate}`}>
      <TaskNew 
        onAdded={() => { debouncedGetTasks() }}
      />
    </div>
  )

  return (
    <div className="my-10 max-w-md mx-auto">
      <h1 className="m-20 text-8xl text-indigo-800 font-pacifico text-center">To Do</h1>
      {!getTasksProps.error ? newTaskComp : null}
      {!getTasksProps.error ? tasksComp : null}
    </div>
  )
}
