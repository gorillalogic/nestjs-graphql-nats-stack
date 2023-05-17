import { gql, useQuery } from '@apollo/client';
import Task from './Task';

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
    <Task key={task.id} contents={task.contents} />
  )) 
  const newTask = (<div 
    className="mx-5 my-5">
    <Task key="new-task"/>
  </div>)
  return (
    <div className="my-10 w-1/2 max-w-md mx-auto">
      {error?.message}
      {!error ? tasks : null}
      {!error ? newTask : null}
    </div>
  )
}
