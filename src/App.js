import React from 'react'
import './App.css';
import LineChart from "./components/LineChart";

function App() {
  const data = [
    {
      date: 'Test',
      uv: 10,
      pv: 20,
    },
    {
      date: 'Test 1',
      uv: 20,
      pv: 10
    },
    {
      date: 'Test 2',
      uv: 5,
      pv: 50,
    },
    {
      date: 'Test 3',
      uv: 60,
      pv: 30,
    },
    {
      date: 'Test 4',
      uv: 50,
      pv: 20
    },
    {
      date: 'Test 5',
      uv: 20,
      pv: 80
    },
    {
      date: 'Test 6',
      uv: 40,
      pv: 50,
    },
  ]

  const lines = [
    {
      key: 'uv',
      color: '#8884d8'
    },
    {
      key: 'pv',
      color: '#82ca9d'
    },
  ]

  const annotations = [
    {
      key: 'uv',
      index: 0,
      annotation: 'First annotation'
    },
    {
      key: 'uv',
      index: 6,
      annotation: 'Last annotaion'
    },
    {
      key: 'uv',
      index: 2,
      annotation: 'This is test'
    },
  ]

  return (
    <div className="App">
      <LineChart lines={lines} data={data} width={800} height={400} annotations={annotations}/>
    </div>
  );
}

export default App;
