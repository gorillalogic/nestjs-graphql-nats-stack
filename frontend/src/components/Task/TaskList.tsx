import { gql, useQuery } from '@apollo/client';
import Task from './Task';

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

export default function() {
  const { loading, error, data } = useQuery(GET_TASKS_QUERY);
  if (loading) return <p>Loading ...</p>;

  const tasks = (data?.tasks ?? []).map((task) => (
    <Task key={task.id} contents={task.contents} />
  )) 
  return (
    <div className="my-10 w-1/2 max-w-md mx-auto">
      {error}
      {tasks}
      <div className="mx-5 my-5">
      <Task key="new-task"/>
      </div>
    </div>
  )
}
