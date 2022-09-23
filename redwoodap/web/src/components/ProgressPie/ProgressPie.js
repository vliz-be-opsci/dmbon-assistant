import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressPie = (content) => {
  const display = content.content;

  const data = {
    labels: ['Good(%)','Warn(%)','Req(%)'],
    datasets: [
      {
        label: 'Annotations',
        data: [display.green, display.orange, display.red],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div>
      <Pie
        data={data}
        options={options}
        width={"100%"}
        />
    </div>
  )
}

export default ProgressPie
