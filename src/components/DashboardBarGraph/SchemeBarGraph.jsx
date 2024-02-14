import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { get_schemes } from '../../helper/Api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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
    // mode: 'index' as const,
    // intersect: false,
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

export default function SchemeBarGraph() {
    const [schemes,setSchemes]=useState([]);
    useEffect(() => {
        fetch_schemedata();
    }, []);
    const fetch_schemedata=async()=>{
        try {
            const {data}=await get_schemes();
            // console.log(data)
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
            // console.log(error)
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
    // const labels = ['Scheme 1', 'Scheme 2', 'Scheme 3', 'Scheme 4', 'Scheme 5', 'Scheme 6', 'Scheme 7'];
    // console.log(budget,utilised_budget,payable_expanses)
    const data={
        labels,
        datasets: [
            {
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
            {
            label: 'Payable expanses',
            data: payable_expanses,
            backgroundColor: '#6E94F3',
            stack: 'Stack 2',
            },
        ],
    }
  return <Bar options={options} data={data} />;
}
