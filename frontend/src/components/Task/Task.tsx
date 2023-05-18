import { MouseEventHandler, ReactNode } from "react";

export interface ITaskProps {
  inputProps?: React.ButtonHTMLAttributes<HTMLInputElement>
  icon: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function({
   inputProps = {},
   icon,
   onClick,
  } : ITaskProps){
  const actionSection = (
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
        className="w-4/5 rounded-md border-gray-200 py-2.5 ps-5 pe-10 focus:outline-none"
        {...inputProps}
      />
      { icon ? actionSection : "" }
    </div>
  )
}
