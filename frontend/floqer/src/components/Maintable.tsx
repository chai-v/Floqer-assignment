import React from 'react';
import { Table } from 'antd';
import { SortOrder } from 'antd/lib/table/interface'; 
import type { ColumnsType } from 'antd/es/table';


interface SalaryData {
    year: number;
    totalJobs: number;
    avgSalary: number;
  }

  interface MainTableProps {
    setRow: (val: number) => void;
    data: SalaryData[];
    loading: boolean
  } 

const MainTable: React.FC<MainTableProps> = ({ setRow, data, loading }) => {
      const handleRowClick = (record: SalaryData, rowIndex?: number) => {
        return {
          onClick: () => {
            setRow(record.year); 
          },
        };
      };

    const columns: ColumnsType<SalaryData> =[
        { 
            title: 'Year', 
            dataIndex: 'year', 
            key: 'year',
            defaultSortOrder: 'descend' as SortOrder, 
            sorter: (a: any, b: any) => a.year - b.year,
        },
        { 
            title: 'Total Jobs', 
            dataIndex: 'totalJobs', 
            key: 'totalJobs',
            defaultSortOrder: 'descend' as SortOrder, 
            sorter: (a: any, b: any) => a.totalJobs - b.totalJobs,
        },
        { 
            title: 'Average Salary (USD)', 
            dataIndex: 'avgSalary', 
            key: 'avgSalary',
            defaultSortOrder: 'descend' as SortOrder, 
            sorter: (a: any, b: any) => a.avgSalary - b.avgSalary,
        }
    ];


  return(
    <div className='leading-normal text-left flex flex-col gap-2'>
      <div className='bg-cream rounded-full w-fit px-4'>
        <span className='text-xl font-semibold text-purple ' >Table Data</span>
      </div>
      <Table dataSource={data} columns={columns} rowKey="year" loading={loading} showSorterTooltip={{target: 'sorter-icon',}} onRow={handleRowClick}/>
    </div>
  ) 
};

export default MainTable;
