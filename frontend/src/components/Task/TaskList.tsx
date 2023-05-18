import { useState, useEffect, useCallback } from "react";
import { gql, useQuery, useMutation } from '@apollo/client';
import Task from './Task';
import { AddIcon, ApproveIcon } from './Icons';
import { subscribeKey } from "../../lib/events";
import { debounce } from "lodash"
import { fetchTasks } from "../../reducers/graphql/TaskReducer";

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

const UPDATE_TASK = gql`
  mutation UpdateTask($id: Int!, $contents: String!) {
    updateTask(updateTaskInput: {
      id: $id,
      contents: $contents,
    }) {
      id
      contents
      createdAt
      updatedAt
    }
  } 
`

const DEFAULT_NEW_TASK = {
  contents: "",
}
 
export default function() {
  const [newTask, setNewTask] = useState(DEFAULT_NEW_TASK);
  const [enterKeyPressed, setEnterKeyPressed] = useState(false);

  const getTasksProps = useQuery(GET_TASKS_QUERY);
  const [addTask, addTaskProps] = useMutation(ADD_TASK);
  const [updateTask, updateTaskProps] = useMutation(UPDATE_TASK);

  useEffect(() => {
     return subscribeKey(
      'Enter',
      () => { setEnterKeyPressed(true) },
      () => { setEnterKeyPressed(false) },
    ) 
  }, []);

  const debouncedGetTasks = useCallback(debounce((variables: any) => {
    getTasksProps.refetch();
  }, 300), []);
  const debouncedAddTask = useCallback(debounce((variables: any) => {
    addTask({ variables });
  }, 300), []);
  const debouncedUpdateTask = useCallback(debounce((variables: any) => {
    updateTask({ variables });
  }, 300), []);

  if (addTaskProps.data && !addTaskProps.error) {
    addTaskProps.reset();
    setNewTask(DEFAULT_NEW_TASK);
    getTasksProps.refetch();
  }
  if (enterKeyPressed) {
    debouncedAddTask({ contents: newTask.contents });
  }

  if (updateTaskProps.data && !updateTaskProps.error) {
    updateTaskProps.reset();
    debouncedGetTasks({})
  }

  let notice = addTaskProps.error?.message || updateTaskProps.error?.message || getTasksProps.error?.message;
  let newTaskAnimationClass = addTaskProps.loading ? "animate-spin" : "animate-none";
  let taskAnimationClass = updateTaskProps.loading || getTasksProps.loading ? "animate-spin" : "animate-none";

  const tasksComp = (getTasksProps.data?.tasks ?? []).map((task: ResourceTask) => (
    <div className="mx-5" key={task.id}>
      <Task 
        inputProps={
          {
            defaultValue: task.contents,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => { 
              debouncedUpdateTask({ id: task.id, contents: event.target.value })
            }
          }
        }
        icon={
          <div className={taskAnimationClass}>
            <ApproveIcon />
          </div>
        }
        onClick={() => {}}
      />
    </div>
  )) 
  const newTaskComp = (
    <div className="my-5">
      <Task 
        inputProps={
          {
            value: newTask.contents,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              setNewTask({ contents: event.target.value });
            },
            placeholder: "New Task..." 
          }
        }
        icon={
          <div className={newTaskAnimationClass}>
            <AddIcon />
          </div>
        } 
        onClick={() => { debouncedAddTask({ contents: newTask.contents }) } }
      />
    </div>
  )

  return (
    <div className="my-10 max-w-md mx-auto">
      <h1 className="m-20 text-8xl text-indigo-800 font-pacifico text-center">To Do</h1>
      {!getTasksProps.error ? newTaskComp : null}
      {notice}
      {!getTasksProps.error ? tasksComp : null}
    </div>
  )
}
