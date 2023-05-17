import { gql, useQuery } from '@apollo/client';
import Task from './Task';
import { AddIcon, ApproveIcon } from './Icons';

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
`

export default function() {
  const { loading, error, data } = useQuery(GET_TASKS_QUERY);
  if (loading) return <p>Loading ...</p>;

  const tasks = (data?.tasks ?? []).map((task: ResourceTask) => (
    <div className="mx-5">
      <Task key={task.id} contents={task.contents} icon={<ApproveIcon />} />
    </div>
  )) 
  const newTask = (
    <div className="my-5">
      <Task key="new-task" icon={<AddIcon />} placeholder="New Task..." />
    </div>
  )
  return (
    <div className="my-10 max-w-md mx-auto">
      <h1 className="m-20 text-8xl text-indigo-800 font-pacifico text-center">To Do</h1>
      {error?.message}
      {!error ? newTask : null}
      {!error ? tasks : null}
    </div>
  )
}
