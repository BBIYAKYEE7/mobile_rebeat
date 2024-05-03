import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Pusher from 'pusher-js';
import logo from './logo.png';
import icon from './location.png';
import './App.css';

function App() {
  const [data, setData] = useState({ score: [], depth: 0, pressure: 0, cycle: 0, elapsed_time: 0 });
  const minutes = Math.floor(data.elapsed_time / 60);
  const seconds = data.elapsed_time % 60;

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.title = "Rebeat"; // replace with your title

    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = logo;
    document.getElementsByTagName('head')[0].appendChild(link);
    const pusher = new Pusher('af314e57292c6a5efb2a', {
      cluster: 'ap3',
    });

    const channel = pusher.subscribe('my-channel');
    channel.bind('my-event', function (newData) {
      setData(prevData => ({
        ...newData,
        score: [...prevData.score, newData.score],
      }));
    });

    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

  const chartData = {
    labels: data.score.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Score',
        data: data.score,
        fill: false,
        backgroundColor: 'rgb(107, 98, 241)',
        borderColor: 'rgba(107, 98, 241, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Score',
        },
      },
    },
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={icon} alt="icon" style={{ height: '25.07px', width: '21px', marginRight: '10px', marginLeft: '40px', marginTop: '40px' }} />
        <h1 style={{ fontSize: '18px', marginTop: '51px', wordSpacing: '-2%' }}>Los Angeles Convention Center</h1>
      </div>
      <p style={{ marginTop: '100px', width: '120px', marginLeft: '40px', wordSpacing: '-2%' }}>Elapsed time</p>
      <p style={{ fontWeight: '600', width: '120px', marginLeft: '40px', wordSpacing: '-2%' }}>{`${minutes.toString().padStart(2, '0')}min ${seconds.toString().padStart(2, '0')}sec`}</p>
      <h2 style={{ marginTop: '36px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Real-time averages</h2>
      <p style={{ marginTop: '12px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Composite CPR Score: {data.score[data.score.length - 1]}</p>
      <p style={{ marginTop: '10px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Compression Depth: {data.depth}cm</p>
      <p style={{ marginTop: '10px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Compression Cycle: {data.cycle}bpm</p>
      <div style={{ position: 'relative', overflowX: 'scroll' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default App;