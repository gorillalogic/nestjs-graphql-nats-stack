import { useState, useEffect, useCallback } from "react";
import { gql, useMutation } from '@apollo/client';
import { AddIcon } from "./Icons";
import { debounce } from "lodash"
import { subscribeKey } from "../../lib/events";

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

export interface ITaskProps {
  inputProps?: React.ButtonHTMLAttributes<HTMLInputElement>
  addButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  onAdded?: () => void
  onError?: (err: string) => void
}

export default function({
  inputProps = {},
  addButtonProps = {},
  onAdded = () => {},
  onError = () => {},
} : ITaskProps){
  const [newTask, setNewTask] = useState(DEFAULT_NEW_TASK);
  const [enterKeyPressed, setEnterKeyPressed] = useState(false);

  const [addTask, addTaskProps] = useMutation(ADD_TASK);
  const newTaskAnimationClass = addTaskProps.loading ? "animate-spin" : "animate-none";

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

  if (enterKeyPressed) {
    debouncedAddTask({ contents: newTask.contents });
  }

  if (addTaskProps.data && !addTaskProps.error) {
    addTaskProps.reset();
    onAdded();
    setNewTask(DEFAULT_NEW_TASK);
  }
    
  if (addTaskProps.error) {
    onError(addTaskProps.error.message);
    addTaskProps.reset();
  }

  return (
    <div className="relative my-1 mx-auto w-full max-w-md shadow-sm bg-white">
      <input
        type="text"
        className="w-4/5 rounded-md border-gray-200 py-2.5 ps-5 pe-10 focus:outline-none"
        value={newTask.contents}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setNewTask({ contents: event.target.value })
        }}
        placeholder="New Task..."
        {...inputProps}
      />
      <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
        <button
          type="button"
          className="rounded-full bg-indigo-800 p-0.5 text-white hover:bg-indigo-600"
          onClick={ () => { debouncedAddTask({ contents: newTask.contents }) } }
          {...addButtonProps}
        >
          <div className={newTaskAnimationClass}>
            <AddIcon />
          </div>
        </button>
      </span>
    </div>
  )
}
