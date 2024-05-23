import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function BasicBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${import.meta.env.VITE_REACT_APP_URL}/api/getCountCargo.php`);
        const formattedData = result.data.map((item, index) => ({
          id: index,
          descricaoCargo: item.descricaoCargo,
          Funcionarios: item.totalFuncionarios,
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width={500} height={400}>
    <BarChart width={900} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="descricaoCargo" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar 
      dataKey="Funcionarios" 
      fill="#8884d8"

      />
    </BarChart>
    </ResponsiveContainer>
  );
}
