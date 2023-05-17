import { ReactNode } from "react";

export interface ITaskProps {
  contents?: string
  placeholder?: string
  icon: ReactNode
}

export default function({ contents = undefined, placeholder = "Description...", icon } : ITaskProps){
  const iconSection = (
    <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
      <button
        type="button"
        className="rounded-full bg-indigo-800 p-0.5 text-white hover:bg-indigo-600"
      >
        { icon }
      </button>
    </span>
  )

  return (
    <div className="relative my-1 mx-auto w-full max-w-md shadow-sm bg-white">
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={contents}
        className="w-4/5 rounded-md border-gray-200 py-2.5 ps-5 pe-10 focus:outline-none"
      />
      { icon ? iconSection : "" }
    </div>
  )
}
