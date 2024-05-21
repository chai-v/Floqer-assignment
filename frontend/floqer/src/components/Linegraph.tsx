import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface SalaryData {
    year: number;
    totalJobs: number;
    avgSalary: number;
  }

interface LineChartProps {
    data: SalaryData[];
}

interface Data
{
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
    }[];
};

const LineChart: React.FC<LineChartProps> = ({ data }) => {

    const years = data.map(item => item.year.toString());
    const salaries = data.map(item => item.avgSalary);


    const graphData: Data = {
        labels: years,
        datasets: [
            {
                label: "Average Salary in USD",
                data: salaries,
                borderColor: 'rgba(137,43,231,1)',
                backgroundColor: 'rgba(137,43,231,0.5)',
            }
        ]
    }

    return (
        <div className='bg-cream p-6 rounded-md'>
            <Line data={graphData} />
        </div>
    );
};

export default LineChart;
