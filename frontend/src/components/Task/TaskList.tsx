import { useState, useEffect, useCallback } from "react";
import { gql, useQuery, useMutation } from '@apollo/client';
import Task from './Task';
import { AddIcon, ApproveIcon } from './Icons';
import { subscribeKey } from "../../lib/events";
import { debounce } from "lodash"

interface ResourceTask {
  id: string
  contents: string
  createdAt: string
  updatedAt: string
}

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

const ADD_TASK = gql`
  mutation AddTask($contents: String!) {
    createTask(createTaskInput: {
      contents: $contents
    }) {
      id
      contents
      createdAt
      updatedAt
    }
  }
`;

const DEFAULT_NEW_TASK = {
  contents: "",
}
 
export default function() {
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState(DEFAULT_NEW_TASK);
  const getTasksProps = useQuery(GET_TASKS_QUERY);
  const [addTask, addTaskProps] = useMutation(ADD_TASK);
  const [enterKeyPressed, setEnterKeyPressed] = useState(false);
  let notice;

  useEffect(() => {
     return subscribeKey(
      'Enter',
      () => { setEnterKeyPressed(true) },
      () => { setEnterKeyPressed(false) },
    ) 
  }, []);

  const debouncedAddTask = useCallback(debounce((variables: any) => {
      addTask({ variables });
    }, 500), []);

  if (getTasksProps.loading) {
    notice = "Loading..." 
  }
  if (getTasksProps.error) {
    notice = getTasksProps.error.message
  }

  if (addTaskProps.loading) {
    notice = "Submitting..."
  }
  if (addTaskProps.error) {
    notice = addTaskProps.error.message
  }
  if (addTaskProps.called && !addTaskProps.error) {
    addTaskProps.reset();
    setNewTask(DEFAULT_NEW_TASK);
    getTasksProps.refetch();
    notice = "Loading..." 
  }
  if (enterKeyPressed) {
    debouncedAddTask({ contents: newTask.contents });
  }

  const tasksComp = (getTasksProps.data?.tasks ?? []).map((task: ResourceTask) => (
    <div className="mx-5" key={task.id}>
      <Task 
        contents={task.contents}
        icon={<ApproveIcon />} 
        onClick={() => { addTask({ variables: { contents: "sample" }}) }}
        onChange={(event) => { 
          setTasks({
            ...tasks,
            [task.id]: { ...task, contents: event.target.value },
          });
        }}
      />
    </div>
  )) 
  const newTaskComp = (
    <div className="my-5">
      <Task 
        contents={newTask.contents}
        icon={<AddIcon />} 
        placeholder="New Task..." 
        onClick={() => { debouncedAddTask(newTask.contents) } }
        onChange={(event) => {
          setNewTask({ contents: event.target.value });
        }}
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
