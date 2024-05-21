import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SortOrder } from 'antd/lib/table/interface'; 
import type { ColumnsType } from 'antd/es/table';
import Table from 'antd/es/table';

interface SmallTableProps {
    selectedRow: number | undefined;
}

interface jobData{
    title: string,
    count: number
}

const SmallTable: React.FC<SmallTableProps> = ({ selectedRow = 2020 }) => {
    const [data, setData] = useState<jobData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://floqer-assignment-wmve.onrender.com/salaries/${selectedRow}`);
                const formattedData = response.data.map((item: any) => ({
                title: item.job_title,
                count: item.count,
                }));
                setData(formattedData);
            } catch (error) {
            console.error('Error fetching data:', error);
            } finally {
            setLoading(false);
            }
        };
      fetchData();
    },[selectedRow])

    const columns: ColumnsType<jobData> =[
        { 
            title: 'Job Title', 
            dataIndex: 'title', 
            key: 'title',
        },
        {
            title: 'Count',
            dataIndex: 'count',
            key: 'count',
            defaultSortOrder: 'descend' as SortOrder, 
            sorter: (a: any, b: any) => a.count - b.count,
        },
    ];

    return (
        <div className='leading-normal text-left flex flex-col gap-2'>
        <div className='bg-cream rounded-full w-fit px-4'>
          <span className='text-xl font-semibold text-purple'>Job Year: {selectedRow}</span>
          </div>
            <Table dataSource={data} columns={columns} rowKey="year" loading={loading} showSorterTooltip={{target: 'sorter-icon',}} pagination={{ pageSize: 5 }}/>
        </div>
        
    );
};

export default SmallTable;
