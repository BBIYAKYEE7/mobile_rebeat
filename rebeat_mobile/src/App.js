import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import Pusher from 'pusher-js';
import logo from './logo.png';
import icon from './location.png';
import './App.css';

function MobilePage() {
  const [data, setData] = useState({ score: [], depth_g: [], depth: 0, pressure: 0, cycle: 0, elapsed_time: 0 });
  const minutes = Math.floor(data.elapsed_time / 60);
  const seconds = data.elapsed_time % 60;

  const scrollRef = useRef();

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
        depth_g: [...prevData.depth_g, newData.depth_g],
      }));
    });

    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Time : ${label}`}</p>
          <p className="intro">{`Score : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    // Scroll to the start of the div whenever data.score changes
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data.score]);

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
      <div style={{ position: 'relative', overflowX: 'scroll' }} ref={scrollRef}> {/* Change scrollRefq to scrollRef */}
        <LineChart
          width={Math.max(window.innerWidth, data.score.length * 100)} // Set the width dynamically based on the number of data points
          height={360}
          data={data.score.map((score, index) => ({ time: index + 1, score, depth: data.depth_g[index] }))}
          margin={{
            top: 10,
            right: 0,
            left: -30,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[10, 0]} yAxisId="left" />
          <YAxis domain={[0, 10]} yAxisId="right" orientation="right" />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#8884d8" strokeDasharray="5 5" animationDuration={1} yAxisId="left" />
          <Line type="monotone" dataKey="depth" stroke="#82ca9d" strokeDasharray="5 5" animationDuration={1} yAxisId="right" />
        </LineChart>
      </div>
    </div >
  );
}

export default MobilePage;