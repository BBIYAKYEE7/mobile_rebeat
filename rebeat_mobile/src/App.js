import React, { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, Tooltip, LineChart, Line } from 'recharts';
import Pusher from 'pusher-js';
import logo from './logo.png';
import icon from './location.png';
import text_logo from './text_logo.png';
import './App.css';

const CustomLabel = ({ x, y, value }) => {
  return (
    <g>
      <polygon points={`${x},${y} ${x + 10},${y - 10} ${x + 70},${y - 10} ${x + 70},${y + 10} ${x + 10},${y + 10}`} fill="#6B62F1" />
      <text x={x + 15} y={y} fill="#fff" textAnchor="middle" dominantBaseline="middle">
        {value}
      </text>
    </g>
  );
};

function MobilePage() {
  const [data, setData] = useState({ score: [], depth: [], pressure: 0, cycle: 0, elapsed_time: 0 });
  const hours = Math.floor(data.elapsed_time / 3600);
  const minutes = Math.floor((data.elapsed_time % 3600) / 60);
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
        depth: [...prevData.depth, newData.depth],
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
  }, [data.score], [data.depth]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={icon} alt="icon" style={{ height: '44.72px', marginLeft:'10%', marginTop: '40px' }} />
        <h1 style={{ fontSize: '22.01px', marginTop: '51px', wordSpacing: '-2%', fontWeight: '600'}}>Los Angeles Convention Center</h1>
      </div>
      <p style={{ fontSize: '22.26px', marginTop: '15%', width: '200px', marginLeft: '40px', wordSpacing: '-2%' }}>Elapsed time</p>
      <p style={{ fontSize: '22.26px', fontWeight: '900', width: '200px', marginTop: '-20px', marginLeft: '40px', wordSpacing: '-2%' }}>{`${minutes.toString().padStart(2, '0')}min ${seconds.toString().padStart(2, '0')}sec`}</p>
      <h2 style={{ fontSize: '22.89px', marginTop: '34px', width: '350px', marginLeft: '40px', wordSpacing: '-2%' }}>Real-time averages</h2>
      <p style={{ fontSize: '22.26px', marginTop: '-2px', width: '350px', marginLeft: '40px', wordSpacing: '-2%' }}>Composite CPR Score: {Math.round(data.score[data.score.length - 1])}</p>
      <p style={{ fontSize: '22.26px', marginTop: '-2px', width: '350px', marginLeft: '40px', wordSpacing: '-2%' }}>Compression Depth: {(data.depth[data.depth.length - 1])}cm</p>
      <p style={{ fontSize: '22.26px', marginTop: '-2px', width: '350px', marginLeft: '40px', wordSpacing: '-2%' }}>Compression Cycle: {data.cycle}bpm</p>
      <div style={{ position: 'relative', overflowX: 'scroll' }} ref={scrollRef}> {/* Change scrollRefq to scrollRef */}
        <AreaChart
          width={Math.max(window.innerWidth, data.depth.length * 100)} // Set the width dynamically based on the number of data points
          height={400}
          data={data.depth.map((depth, index) => ({ time: index + 1, depth }))}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CustomTooltip />
          <Tooltip />
          <Area type="monotone" dataKey="depth" stroke="#6B62F1" fill="#6962e9" isAnimationActive={false} label={true} />
        </AreaChart>
        <img src={text_logo} alt="text_logo" style={{ position: 'fixed', top: '95%', left: '73%', height: '1.5em', width: '4.8em' }} />
        <q style={{ position: 'fixed', top: '78%', left: '14%', fontSize: '1em', color: '#FFFFFF', opacity: '50%' }}>CPR Compression Depth trend graph</q>
      </div>
    </div>
  );
}

export default MobilePage;