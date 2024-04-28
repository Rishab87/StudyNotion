import React from 'react'
import { Chart , registerables } from 'chart.js';
import {Pie} from 'react-chartjs-2';
import { useState } from 'react';

Chart.register(...registerables);

const InstructorChart = ({courses}) => {
    const [currChat , setCurrentChart] = useState("students");

    const getRandomColors = (numColors)=>{
        const colors = [];
        for(let i = 0; i< numColors; i++){
            const color = `rgb(${Math.floor(Math.random()*256)} , ${Math.floor(Math.random()*256)} , ${Math.floor(Math.random()*256)})`;
            colors.push(color);
        }
        return colors;
    }

    const chartDataForStudents = {
        labels: courses.map((course)=>course.courseName),
        datasets:[
            {
                data: courses.map((course)=> course.totalStudentsEnrolled),
                backgroundColor: getRandomColors(courses.length),
            }
        ]
    }

    const chartDataForIncome = {
        labels: courses.map((course)=>course.courseName),
        datasets:[
            {
                data: courses.map((course)=> course.totalAmountEarned),
                backgroundColor: getRandomColors(courses.length),
            }
        ]
    }

    const options = {

    }


  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6    ">
        
            <p className="text-lg font-bold text-richblack-5">Visualize</p>
            <div className='flex gap-16 h-[350px]'>
        <div className="space-x-4 flex h-[40px] font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
            onClick={() => setCurrentChart("students")}
            className={`rounded-sm p-1 px-3 transition-all duration-200 ${
                currChat === "students"
                ? "bg-richblack-700 text-yellow-50"
                : "text-yellow-400"
            }`}
        >
            Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
            onClick={() => setCurrentChart("income")}
            className={`rounded-sm p-1 px-3 transition-all duration-200 ${
                currChat === "income"
                ? "bg-richblack-700 text-yellow-50"
                : "text-yellow-400"
            }`}
        >
            Income
        </button>
        </div>
        <div className="relative mx-auto aspect-square h-full w-full">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
            data={currChat === "students" ? chartDataForStudents : chartDataForIncome}
            options={options}
        />
                </div>

        </div>
  </div>
  )
}

export default InstructorChart