import { useCallback } from "react";
import { gql, useMutation } from '@apollo/client';
import { debounce } from "lodash"
import TextareaAutosize from "react-textarea-autosize";

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
const DELETE_TASK = gql`
  mutation UpdateTask($id: Int!) {
    removeTask(id: $id) 
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
  inputProps?: React.ButtonHTMLAttributes<HTMLTextAreaElement>
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
  const [deleteTask, deleteTaskProps] = useMutation(DELETE_TASK);
  const animatePulse = updateTaskProps.loading || deleteTaskProps.loading ? "animate-pulse" : "animate-none";

  const debouncedUpdateTask = useCallback(debounce((variables: any) => {
    updateTask({ variables });
  }, 300), []);

  const debouncedDeleteTask = useCallback(debounce((variables: any) => {
    deleteTask({ variables });
  }, 300), []);

  if (updateTaskProps.data && !updateTaskProps.error) {
    updateTaskProps.reset();
    onChange();
  }

  if (updateTaskProps.error) {
    updateTaskProps.reset();
    onError(updateTaskProps.error.message);
  }

  if (deleteTaskProps.data && !deleteTaskProps.error) {
    deleteTaskProps.reset();
    onChange();
  }

  if (deleteTaskProps.error) {
    deleteTaskProps.reset();
    onError(deleteTaskProps.error.message);
  }

  return (
    <div className={`relative my-1 mx-auto w-full max-w-md shadow-sm bg-white ${animatePulse}`}>
      <span className="absolute h-full">
        <button
          type="button"
          className="px-2 border-0"
          {...stateButtonProps}
        >
          <span className="material-symbols-rounded text-md text-indigo-800">
            radio_button_unchecked 
          </span>
        </button>
      </span>

      <TextareaAutosize
        type="text"
        className="w-full h-fit rounded-md border-gray-200 py-2.5 ps-10 pe-10 focus:outline-none"
        defaultValue={ taskRecord.contents }
        onChange={ 
          (event: React.ChangeEvent<HTMLTextAreaElement>) => { 
            debouncedUpdateTask({ id: taskRecord.id, contents: event.target.value })
          }
        }
        {...inputProps}
      />

      <span className="absolute end-0">
        <button
          type="button"
          className="px-2 border-0"
          {...stateButtonProps}
          onClick={() => { debouncedDeleteTask({ id: taskRecord.id }) }}
        >
          <span className="material-symbols-rounded text-md text-red-500">delete</span>
        </button>
      </span>
    </div>
  )
}
