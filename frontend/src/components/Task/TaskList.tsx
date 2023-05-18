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
  }, 300), []);
  const debounceUpdateTask = useCallback(debounce((variables: any) => {
    updateTask({ variables });
  }, 300), []);

  if (getTasksProps.loading) {
    notice = "Loading..." 
  }
  if (getTasksProps.error) {
    notice = getTasksProps.error.message
  }

  if (addTaskProps.loading) {
    notice = "Adding..."
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

  if (updateTaskProps.loading) {
    notice = "Updating..."
  }
  if (updateTaskProps.error) {
    notice = updateTaskProps.error.message
  }
  if (updateTaskProps.called && !updateTaskProps.error) {
    updateTaskProps.reset();
    getTasksProps.refetch();
    notice = "Loading";
  }

  const tasksComp = (getTasksProps.data?.tasks ?? []).map((task: ResourceTask) => (
    <div className="mx-5" key={task.id}>
      <Task 
        inputProps={
          {
            defaultValue: task.contents,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => { 
              debounceUpdateTask({ id: task.id, contents: event.target.value })
            }
          }
        }
        icon={<ApproveIcon />} 
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
        icon={<AddIcon />} 
        onClick={() => { debouncedAddTask({ contents: newTask.contents }) } }
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
