import React, { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, Tooltip } from 'recharts';
import Pusher from 'pusher-js';
import logo from './logo.png';
import icon from './location.png';
import text_logo from './text_logo.png';
import './App.css';

function MobilePage() {
  const [data, setData] = useState({ score: [], depth: 0, pressure: 0, cycle: 0, elapsed_time: 0 });
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
      }));
    });

    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

  useEffect(() => {
    // Scroll to the start of the div whenever data.score changes
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data.score]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={icon} alt="icon" style={{ height: '29.07px', width: '25px', marginRight: '10px', marginLeft: '40px', marginTop: '40px' }} />
        <h1 style={{ fontSize: '20px', marginTop: '55px', wordSpacing: '-2%' }}>Los Angeles Convention Center</h1>
      </div>
      <p style={{ marginTop: '100px', width: '120px', marginLeft: '40px', wordSpacing: '-2%' }}>Elapsed time</p>
      <p style={{ fontWeight: '600', width: '120px', marginLeft: '40px', wordSpacing: '-2%' }}>{`${minutes.toString().padStart(2, '0')}min ${seconds.toString().padStart(2, '0')}sec`}</p>
      <h2 style={{ marginTop: '36px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Real-time averages</h2>
      <p style={{ marginTop: '12px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Composite CPR Score: {data.score[data.score.length - 1]}</p>
      <p style={{ marginTop: '10px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Compression Depth: {data.depth}cm</p>
      <p style={{ marginTop: '10px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Compression Cycle: {data.cycle}bpm</p>
      <div style={{ position: 'relative', overflowX: 'scroll' }} ref={scrollRef}> {/* Change scrollRefq to scrollRef */}
        <AreaChart
          width={Math.max(window.innerWidth, data.score.length * 100)} // Set the width dynamically based on the number of data points
          height={340}
          data={data.score.map((score, index) => ({ time: index + 1, score }))}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <Tooltip />
          <Area type="monotone" dataKey="score" stroke="#8884d8" fill="#8884d8" isAnimationActive={false} />
        </AreaChart>
        <img src={text_logo} alt="text_logo" style={{ position: 'fixed', top: '88%', left: '58%', height: '2em', width: '6.5em' }} />
        <q style={{ position: 'fixed', top: '60%', left: '25%', fontSize: '1em', color: '#FFFFFF', opacity: '50%' }}>Score change trend graph</q>
      </div>
    </div>
  );
}

export default MobilePage; 