"use client"
import React, { useEffect, useState } from 'react'

const School = ({params}) => {
  const [schoolData, setSchoolData] = useState()
  
  const handler = async () => {
    const {school} = await params;
    
    try {
      const response = await fetch(`/api/school/${school}`);

      if (!response.ok) {
        const result = await response.text();
        console.log(result)
        return;
      }

      const data = await response.json()
      console.log(data)
      setSchoolData(data)
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(()=>{
    handler()
  },[params])

  if (!schoolData) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">School not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{schoolData?.name}</h1>
      <p>{schoolData?.description}</p>
      <div>
        <h3 className="text-xl">Contact Details</h3>
        <p>{schoolData?.contact}</p>
      </div>
    </div>
  );
}

export default School
