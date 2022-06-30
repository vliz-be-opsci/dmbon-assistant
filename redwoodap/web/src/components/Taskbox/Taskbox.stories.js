import Taskbox from './Taskbox'

const Template = (args) => <Taskbox {...args} />;

export const Interactive = Template.bind({});
Interactive.args = {
  type: 'success',
  name: 'Task 1',
  description: 'This is a task'
}

Interactive.argTypes = {
  type: { control: { type: 'select', options: ['success', 'error', 'pending', 'running'] } },
  name: { control: { type: 'text' } },
  description: { control: { type: 'text' } },
}

export const All_options = () => {
  return (
    <>
      <Taskbox type="success" name="Task 1" description="This is a success task" />
      <Taskbox type="running" name="Task 2" description="This is a running task" />
      <Taskbox type="error" name="Task 3" description="This is an error task" />
      <Taskbox type="pending" name="Task 4" description="This is a pending task" />
    </>
  )
}


export default { 
  title: 'Components/Taskbox',
  component: Taskbox
  };
