import { useState, useCallback } from "react";
import { gql, useMutation } from '@apollo/client';
import { ApproveIcon } from "./Icons";
import { debounce } from "lodash"

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
export interface IResourceTask {
  id: string
  contents: string
  createdAt: string
  updatedAt: string
}

export interface ITaskProps {
  taskRecord: IResourceTask,
  inputProps?: React.ButtonHTMLAttributes<HTMLInputElement>
  stateButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  onChange?: () => void
  onDelete?: () => void
  onError?: (err: string) => void
}

export default function({
  taskRecord,
  inputProps = {},
  stateButtonProps = {},
  onChange = () => {},
  onDelete = () => {},
  onError = () => {},
} : ITaskProps){
  const [updateTask, updateTaskProps] = useMutation(UPDATE_TASK);
  const animateSpin = updateTaskProps.loading ? "animate-spin" : "animate-none";
  const animatePulse = updateTaskProps.loading ? "animate-pulse" : "animate-none";

  const debouncedUpdateTask = useCallback(debounce((variables: any) => {
    updateTask({ variables });
  }, 300), []);

  if (updateTaskProps.data && !updateTaskProps.error) {
    updateTaskProps.reset();
    onChange();
  }

  if (updateTaskProps.error) {
    updateTaskProps.reset();
    onError(updateTaskProps.error.message);
  }

  return (
    <div className={`relative my-1 mx-auto w-full max-w-md shadow-sm bg-white ${animatePulse}`}>
      <input
        type="text"
        className="w-4/5 rounded-md border-gray-200 py-2.5 ps-5 pe-10 focus:outline-none"
        defaultValue={ taskRecord.contents }
        onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => { 
            debouncedUpdateTask({ id: taskRecord.id, contents: event.target.value })
          }
        }
        {...inputProps}
      />
      <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
        <button
          type="button"
          className="rounded-full bg-indigo-800 p-0.5 text-white hover:bg-indigo-600"
          {...stateButtonProps}
        >
          <div className={animateSpin}>
            <ApproveIcon />
          </div>
        </button>
      </span>
    </div>
  )
}
