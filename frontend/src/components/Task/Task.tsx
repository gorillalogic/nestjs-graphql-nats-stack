import { AddIcon, ApproveIcon } from "./Icons";

export default function({ contents = undefined }){
  return (
    <div className="relative my-2 mx-auto w-full max-w-md shadow-sm bg-white">
      <input id="default-checkbox" 
        type="checkbox" 
        defaultValue="" 
        className="rounded w-10 accent-green-600 focus:accent-green-600" 
      /> 
      <input
        type="text"
        placeholder="New Task..."
        defaultValue={contents}
        className="w-4/5 rounded-md border-gray-200 py-2.5 ps-2 pe-10"
      />

      <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
        <button
          type="button"
          className="rounded-full bg-green-600 p-0.5 text-white hover:bg-green-700"
        >
          <ApproveIcon />
        </button>
      </span>
    </div>
  )
}
