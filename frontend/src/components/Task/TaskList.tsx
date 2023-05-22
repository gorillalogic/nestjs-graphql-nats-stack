import { useCallback, useState } from "react";
import { gql, useQuery } from '@apollo/client';
import Task, { IResourceTask } from './Task';
import TaskNew from './TaskNew';
import { debounce } from "lodash"

const GET_TASKS_QUERY = gql`
  query GetTasks {
    tasks {
      id
      contents
      completed
      createdAt
      updatedAt
    }
  }
`;
 
export default function() {
  const [notice, setNotice] = useState<string | undefined>(undefined);
  const getTasksProps = useQuery(GET_TASKS_QUERY);
  const animate = getTasksProps.loading ? "animate-pulse" : "animate-none";

  const debouncedGetTasks = useCallback(debounce((_variables: any = {}) => {
    getTasksProps.refetch();
  }, 300), []);

  if (!getTasksProps.loading && getTasksProps.error && notice != getTasksProps.error.message) {
    setNotice(getTasksProps.error.message)
  }

  const tasksComp = (getTasksProps.data?.tasks ?? []).map((task: IResourceTask) => (
    <div className={`mx-5 ${animate}`} key={task.id}>
      <Task 
        taskRecord={task}
        onChange={() => { debouncedGetTasks() }}
        onError={(err) => { setNotice(err) }}
      />
    </div>
  )) 
  const newTaskComp = (
    <div className={`my-5 ${animate}`}>
      <TaskNew 
        onAdded={() => { debouncedGetTasks() }}
        onError={(err) => { setNotice(err) }}
      />
    </div>
  )

  return (
    <div className="my-10 max-w-md mx-auto">
      <h1 className="m-20 text-8xl text-indigo-800 font-pacifico text-center">To Do</h1>
      {notice}
      {!getTasksProps.error ? newTaskComp : null}
      {!getTasksProps.error ? tasksComp : null}
    </div>
  )
}
