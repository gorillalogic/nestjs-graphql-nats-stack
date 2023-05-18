import { MouseEventHandler, ReactNode } from "react";

export interface ITaskProps {
  contents?: string
  placeholder?: string
  icon: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function({
   contents = undefined,
   placeholder = "Description...",
   icon,
   onClick,
   onChange, 
  } : ITaskProps){
  const iconSection = (
    <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
      <button
        type="button"
        className="rounded-full bg-indigo-800 p-0.5 text-white hover:bg-indigo-600"
        onClick={onClick}
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
        value={contents}
        className="w-4/5 rounded-md border-gray-200 py-2.5 ps-5 pe-10 focus:outline-none"
        onChange={onChange}
      />
      { icon ? iconSection : "" }
    </div>
  )
}
