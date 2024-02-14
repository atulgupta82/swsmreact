import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';

import { Bar, Chart } from 'react-chartjs-2';
import { get_schemes } from '../../helper/Api';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: 'Scheme Bar Graph',
    },
  },
  responsive: true,
  interaction: {
  },
  scales: {
    x: {
      stacked: false,
    },
    y: {
      stacked: false,
    },
  },
};

export default function BarLineGraph() {
    const [schemes,setSchemes]=useState([]);
    useEffect(() => {
        fetch_schemedata();
    }, []);
    const fetch_schemedata=async()=>{
        try {
            const {data}=await get_schemes();
            if(data.status){
                const updated_schemes=data.schemes.filter((scheme)=>{
                  return (scheme.l2_status==="1" && scheme.l3_status==='1')
                })
                // console.log(updated_schemes)
                setSchemes(updated_schemes)
            }else{
                setSchemes([])
            }
        } catch (error) {
            console.log(error)
            setSchemes([])
        }
    }
    let labels=[];
    let budget=[];
    let utilised_budget=[];
    let payable_expanses=[];
    schemes.map((scheme)=>{
        if(scheme.name.length>20){
            labels.push(scheme.name.substr(0,20)+"...")
        }else{
            labels.push(scheme.name)
        }
        budget.push(parseInt(scheme.total_budget))
        utilised_budget.push(parseInt(scheme.utilised_budget))
        payable_expanses.push(parseInt(scheme.payable_expanses))
    })
    
    const data={
        labels,
        datasets: [
            {
            type: 'line',
            label: 'Scheme budget',
            data: budget,
            backgroundColor: '#58CEA7',
            stack: 'Stack 0',
            },
            {
            label: 'Utilized budget',
            data: utilised_budget,
            backgroundColor: '#EC8D87',
            stack: 'Stack 1',
            },
        ],
    }
  return <Chart type='bar' options={options} data={data} />;
}
