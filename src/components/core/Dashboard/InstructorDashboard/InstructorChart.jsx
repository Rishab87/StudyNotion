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
    <div>
        <p>Visualise</p>
        <div>
            <button onClick={()=> setCurrentChart("students")}>Student</button>
            <button onClick={()=> setCurrentChart("income")}>Income</button>
        </div>
        <div>
            <Pie 
                data = {currChat === "students"? chartDataForStudents: chartDataForIncome}
                options={options}
            />
        </div>
    </div>
  )
}

export default InstructorChart