import React, { useState, useEffect} from 'react';
import MainTable from '../../components/Maintable';
import SmallTable from '../../components/Smalltable';
import axios from 'axios';
import LineChart from '../../components/Linegraph';

interface Contentprops {
  
}

interface SalaryData {
  year: number;
  totalJobs: number;
  avgSalary: number;
}

const Container: React.FC<Contentprops> = () => {
  const [selectedRow, setSelectedRow] = useState<number>();
  const [data, setData] = useState<SalaryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = await axios.get('http://localhost:5000/salaries');
          const formattedData = response.data.map((item: any) => ({
            year: item.year,
            totalJobs: item.total_jobs,
            avgSalary: Math.round(item.average_salary_usd),
          }));
          setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const setRow = (val: number): void => {
    setSelectedRow(val);
  };

  return (
    <div className='w-full h-full'>
      <div className='w-full h-1/2 flex flex-row px-24 mt-5 mb-10'>
          <div className='w-1/3 p-8 leading-normal flex flex-col items-center justify-center text-center text-cream'>
            <p className=' inline-block align-middle font-semibold'>The provided data allows for a thorough examination of salary trends and job distribution of machine learning positions over different years. By analyzing the aggregated salary data, one can gain insights into how average salaries have evolved over time, providing valuable information about changes in compensation trends. Additionally, by exploring the distribution of job titles within specific years, it becomes possible to understand which roles are in demand and how job landscapes have shifted over time.</p>
          </div>
          <div className='w-2/3 h-full p-10'>
            <LineChart data={data}/>
          </div>
      </div>
      <div className='w-full h-1/2 px-10'>
        <div className='grid grid-cols-3 mb-10'>
          <div className='col-span-2 px-2'>
            <MainTable setRow={setRow} data={data} loading={loading}/>
          </div>
          <div className='col-span-1 px-2'>
            <SmallTable selectedRow={selectedRow}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
