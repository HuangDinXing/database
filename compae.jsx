import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Topbar from '../component/Topbar';
import { useCourse } from '../component/Context';
import SkeletonFeedback from '../component/SkeletonFeedback';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot} from 'recharts';
//16:47

const useStyles = makeStyles({
  root: {
    width: '500px',
    cursor: 'pointer',
    marginTop: 12
  },
});

function ProgressWithSeek({ totalFrames, frameIndex, onSeek }) {
  const classes = useStyles();
  const progressRef = useRef(null);

  const handleClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const targetFrame = Math.round(percent * (totalFrames - 1));
    onSeek(targetFrame);  // 即時跳轉
  };

  const progressValue = totalFrames > 0 ? (frameIndex / (totalFrames - 1)) * 100 : 0;

  return (
    <div className={classes.root} ref={progressRef} onClick={handleClick}>
      <LinearProgress variant="determinate" value={progressValue} />
    </div>
  );
}

const POSE_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [12, 14], [14, 16], [16, 18],
  [12, 24], [11, 23], [23, 24], [23, 25], [25, 27], [27, 29], [29, 31],
  [24, 26], [26, 28], [28, 30], [30, 32], [27, 31], [28, 32]
];

export default function SkeletonViewer() {
  const mountRef = useRef(null);
  const navigate = useNavigate();
  const { courseData } = useCourse();
  const { mergedFolder, mergedCSV, courseName } = courseData;
  const [currentFrameData, setCurrentFrameData] = useState(null);

  const teacherVideoRef = useRef(null);
  const studentVideoRef = useRef(null);

  const [frameIndex, setFrameIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(30);
  const [currentStats, setCurrentStats] = useState({ close: 0, far: 0, percent: 0 });
  const [totalStats, setTotalStats] = useState({ close: 0, far: 0, percent: 0 });
  const [farSegments, setFarSegments] = useState([]);
  const [totalFrames, setTotalFrames] = useState(0);
  const [accuracyHistory, setAccuracyHistory] = useState([]);

  const framesRef = useRef({});
  const frameNumbersRef = useRef([]);
  const isPausedRef = useRef(isPaused);
  const speedRef = useRef(animationSpeed);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);

  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const group1Ref = useRef();
  const group2Ref = useRef();

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  //useEffect(() => { speedRef.current = animationSpeed; }, [animationSpeed]);
  useEffect(() => {
    const teacherVid = teacherVideoRef.current;
    const studentVid = studentVideoRef.current;
  
    if (teacherVid && studentVid) {
      const handleEnded = () => {
        setIsPaused(true);  // 自動設為 Pause
      };
  
      teacherVid.addEventListener('ended', handleEnded);
      studentVid.addEventListener('ended', handleEnded);  // 可視需求，也可只監聽一個
  
      return () => {
        teacherVid.removeEventListener('ended', handleEnded);
        studentVid.removeEventListener('ended', handleEnded);
      };
    }
  }, []);
  
  

  // const parseCSV = (text) => {
  //   const lines = text.trim().split('\n');
  //   const header = lines[0].split(',');
  //   // find the index of proximity_status and skeleton_id dynamically:
  //   const iFrame    = header.indexOf('frame');
  //   const iIndex    = header.indexOf('landmark_index');
  //   const iX        = header.indexOf('x');
  //   const iY        = header.indexOf('y');
  //   const iZ        = header.indexOf('z');
  //   const iStatus   = header.indexOf('proximity_status');
  //   const iSkeleton = header.indexOf('skeleton_id');
  
  //   const out = {};
  //   for (let i = 1; i < lines.length; i++) {
  //     const cols = lines[i].split(',');
  //     if (cols.length !== header.length) continue;
  //     const f      = +cols[iFrame];
  //     const idx    = +cols[iIndex];
  //     const x      = +cols[iX];
  //     const y      = -+cols[iY];
  //     const z      = -+cols[iZ];
  //     const status = cols[iStatus];           // 'close' or 'far'
  //     const sid    = +cols[iSkeleton];
  
  //     out[f] = out[f] || [];
  //     out[f].push({ x, y, z, skeletonId: sid, landmarkIndex: idx, proximity: status });
  //   }
  //   return out;
  // };
  
  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    const header = lines[0].trim().split(',').map(h => h.trim());
  
    const iFrame    = header.indexOf('frame');
    const iIndex    = header.indexOf('landmark_index');
    const iX        = header.indexOf('x');
    const iY        = header.indexOf('y');
    const iZ        = header.indexOf('z');
    const iStatus   = header.indexOf('proximity_status');
    const iSkeleton = header.indexOf('skeleton_id');
  
    if ([iFrame,iIndex,iX,iY,iZ,iStatus,iSkeleton].some(i => i < 0)) {
      console.error('CSV missing headers:', header);
      return {};
    }
  
    const out = {};
    for (const line of lines.slice(1)) {
      if (!line.trim()) continue;
      const cols = line.trim().split(',').map(c => c.trim());
      if (cols.length !== header.length) continue;
  
      const f      = +cols[iFrame];
      const idx    = +cols[iIndex];
      const x      = +cols[iX];
      const y      = -+cols[iY];
      const z      = -+cols[iZ];
      const status = cols[iStatus];           // 'close' or 'far'
      const sid    = +cols[iSkeleton];
  
      out[f] = out[f] || [];
      out[f].push({ x, y, z, skeletonId: sid, landmarkIndex: idx, proximity: status });
    }
  
    return out;
  };
  

  // 1) detectFarSegments: builds your far‐segment list purely from p.proximity
  const detectFarSegments = (allFrames) => {
    const segs = [];
    let seg = null;
    // assume allFrames is { frameIndex: [ …points… ], … }
    const keys = Object.keys(allFrames)
      .map(n => +n)
      .sort((a, b) => a - b);

    keys.forEach(k => {
      const frameData = allFrames[k];
      // any teacher point marked 'far'?
      const hasFar = frameData.some(
        p => p.skeletonId === 1 && p.proximity === 'far'
      );

      if (hasFar) {
        if (!seg) seg = { start: k, end: k };
        else seg.end = k;
      } else if (seg) {
        segs.push(seg);
        seg = null;
      }
    });

    if (seg) segs.push(seg);
    setFarSegments(segs);
  };


  const calculateTotalStats = (parsed) => {
    let totalClose = 0;
    let totalCount = 0;
    const newAccuracy = [];
  
    frameNumbersRef.current.forEach((frameIndex, i) => {
      const frameData = parsed[frameIndex];
  
      // count teacher points
      const teacherPoints = frameData.filter(p => p.skeletonId === 1);
      const closePoints   = teacherPoints.filter(p => p.proximity === 'close').length;
      const frameTotal    = teacherPoints.length;
  
      totalClose += closePoints;
      totalCount += frameTotal;
  
      // per-frame accuracy for the line chart
      newAccuracy.push({
        frame: i,
        accuracy: frameTotal > 0
          ? Number(((closePoints / frameTotal) * 100).toFixed(1))
          : 0
      });
    });
  
    setTotalStats({
      close: totalClose,
      far:   totalCount - totalClose,
      percent: totalCount > 0
        ? Number(((totalClose / totalCount) * 100).toFixed(1))
        : 0
    });
  
    setAccuracyHistory(newAccuracy);
  };
  
  

  // 自動載入 CSV
  useEffect(() => {
    if (mergedFolder && mergedCSV) {
      fetch(`/backend/analyze/${mergedFolder}/${mergedCSV}`)
        .then(res => res.text())
        .then(csvText => {
          const parsed = parseCSV(csvText);
          framesRef.current = parsed;
          frameNumbersRef.current = Object.keys(parsed).map(n => +n).sort((a, b) => a - b);
          setTotalFrames(frameNumbersRef.current.length);
          frameRef.current = 0;
          setFrameIndex(0);
          calculateTotalStats(parsed);
          detectFarSegments(parsed);
        })
        .catch(err => console.error('Failed to load CSV:', err));
    }
  }, [mergedFolder, mergedCSV]);

  useEffect(() => {
    if (mountRef.current) {
      mountRef.current.innerHTML = ''; // 清掉舊畫布
    }
  
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#eaeaea');
  
    const grid = new THREE.GridHelper(2, 20);
    grid.position.set(0.5, -1, 0);
    scene.add(grid);
    sceneRef.current = scene;
  
    const light = new THREE.AmbientLight(0x404040, 3);
    scene.add(light);
  
    const g1 = new THREE.Group(), g2 = new THREE.Group();
    group1Ref.current = g1;
    group2Ref.current = g2;
    scene.add(g1);
    scene.add(g2);
  
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 0, -3);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
  
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
  
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;
    controls.target.set(0.5, 0, 0);
    controls.update();
  
    const loop = (time) => {
      requestAnimationFrame(loop);
    
      const teacherVid = teacherVideoRef.current;
      const studentVid = studentVideoRef.current;
    
      if (teacherVid && studentVid && !isPausedRef.current && frameNumbersRef.current.length) {
        const currentTime = teacherVid.currentTime; // 假設兩影片時間同步
        const targetFrame = Math.floor(currentTime * 30); // 30 FPS 假設
    
        if (targetFrame >= 0 && targetFrame < frameNumbersRef.current.length) {
          const frameNum = frameNumbersRef.current[targetFrame];
          drawFrame(framesRef.current[frameNum]);
          setFrameIndex(targetFrame);
        }
      }
    
      controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };    
    loop(0);
  
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);
  
    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
      scene.clear();
    };
  }, []);
  

  // 2) drawFrame: colors each landmark/ bone by p.proximity
  const drawFrame = (data) => {
    if (!data) return;

    // build a Set of all 'far' landmarkIndex for teacher (id=1)
    const farPoints = new Set(
      data
        .filter(p => p.skeletonId === 1 && p.proximity === 'far')
        .map(p => p.landmarkIndex)
    );

    // clear previous
    const g1 = group1Ref.current, g2 = group2Ref.current;
    g1.clear(); g2.clear();

    // build maps of teacher vs student vectors
    const m1 = new Map(), m2 = new Map();
    data.forEach(p => {
      const v = new THREE.Vector3(p.x, p.y, p.z);
      if (p.skeletonId === 1) m1.set(p.landmarkIndex, v);
      else m2.set(p.landmarkIndex, v);
    });

    // draw spheres
    const sphereGeo = new THREE.SphereGeometry(0.01, 4, 4);
    data.forEach(p => {
      const map = p.skeletonId === 1 ? m1 : m2;
      if (!map.has(p.landmarkIndex)) return;

      const isFar = farPoints.has(p.landmarkIndex);
      const color = isFar
        ? 0xff0000
        : (p.skeletonId === 1 ? 0x0000ff : 0x00ff00);

      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.copy(map.get(p.landmarkIndex));
      (p.skeletonId === 1 ? g1 : g2).add(mesh);
    });

    // draw bones
    POSE_CONNECTIONS.forEach(([s, e]) => {
      if (m1.has(s) && m1.has(e)) {
        const isFarBone = farPoints.has(s) || farPoints.has(e);
        const lineMat = new THREE.LineBasicMaterial({
          color: isFarBone ? 0xff0000 : 0x0000ff,
          linewidth: 1
        });
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          m1.get(s), m1.get(e)
        ]);
        g1.add(new THREE.Line(lineGeo, lineMat));
      }
      if (m2.has(s) && m2.has(e)) {
        const isFarBone = farPoints.has(s) || farPoints.has(e);
        const lineMat = new THREE.LineBasicMaterial({
          color: isFarBone ? 0xff0000 : 0x00ff00,
          linewidth: 1
        });
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          m2.get(s), m2.get(e)
        ]);
        g2.add(new THREE.Line(lineGeo, lineMat));
      }
    });

    //for feedback
    setCurrentFrameData(data);

    // update stats UI if you need
    const closeCount = data.filter(p =>
      p.skeletonId === 1 && p.proximity === 'close'
    ).length;
    const totalCount = data.filter(p => p.skeletonId === 1).length;
    setCurrentStats({
      close: closeCount,
      far: totalCount - closeCount,
      percent: totalCount > 0 ? ((closeCount/totalCount)*100).toFixed(1) : 0
    });
  };

  

  return (
    <div className="compare-page">
      {/* Three.js 畫布 */}
      <div ref={mountRef} style={{
        position: 'absolute',
        bottom: 250,
        right: 250,
        width: '600px',
        height: '400px',
        zIndex: 0
      }} />

      <Topbar />
      <div className="compare-title">
        <div className="compare-title-word">Motion Review 動作分析</div>
      </div>

      <div className="compare-control-panel">
        <label className="compare-word">播放速度 Slow </label>
        <input
          type="range"
          min="1"
          max="60"
          value={animationSpeed}
          onChange={e => {
            const newSpeed = +e.target.value;
            setAnimationSpeed(newSpeed);

            const teacherVid = teacherVideoRef.current;
            const studentVid = studentVideoRef.current;

            if (teacherVid && studentVid) {
              teacherVid.playbackRate = newSpeed / 30;
              studentVid.playbackRate = newSpeed / 30;
            }
          }}
        />
        <label className="compare-word"> Fast</label>
        {/* <span>{animationSpeed}Fast</span> */}

        <button onClick={() => {
        setIsPaused(prev => {
          const newPaused = !prev;
          const teacherVid = teacherVideoRef.current;
          const studentVid = studentVideoRef.current;
          if (teacherVid && studentVid) {
            if (newPaused) {
              teacherVid.pause();
              studentVid.pause();
            } else {
              teacherVid.play();
              studentVid.play();
            }
          }
          return newPaused;
        });
      }} style={{ marginLeft: 12, padding: '4px 10px' }}>
        {isPaused ? 'Play' : 'Pause'}
      </button>

        {/* Far Segments */}
        <div style={{ marginTop: 12 }}>
          <b>Movements to Improve:</b><br />
          {farSegments.map((s, i) => (
          <button key={i} onClick={() => {
            const targetFrame = Math.max(0, frameNumbersRef.current.indexOf(s.start) - 20);
            frameRef.current = targetFrame;
            setFrameIndex(targetFrame);
            const frameNum = frameNumbersRef.current[targetFrame];
            drawFrame(framesRef.current[frameNum]);

            // 同步影片時間
            const teacherVid = teacherVideoRef.current;
            const studentVid = studentVideoRef.current;

            if (teacherVid && studentVid) {
              // 假設每 frame 為 1/30 秒
              const timeInSeconds = targetFrame / 30;
              teacherVid.currentTime = timeInSeconds;
              studentVid.currentTime = timeInSeconds;

              // 若正在播放，影片繼續播放
              if (!isPausedRef.current) {
                teacherVid.play();
                studentVid.play();
              }
            }
          }} style={{ marginRight: 6, marginTop: 4 }}>
            {i + 1}
          </button>
        ))}
        </div>
      </div>

      <div className="compare-score-box">
      <div>Your Score: {totalStats.percent}</div>
      {/* 折線圖區塊：固定高度、100% 寬度 */}
      <div style={{
        width: '100%',
        height: '120px',
        marginTop: '12px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '10px',
      }}>
    <h4 style={{ margin: 0 }}>Accuracy Over Time</h4>
    <ResponsiveContainer width="100%" height="85%">
      <LineChart
        data={accuracyHistory}
        onClick={(e) => {
          if (e && e.activeLabel != null) {
            const targetFrame = e.activeLabel;
            frameRef.current = targetFrame;
            setFrameIndex(targetFrame);
            const frameNum = frameNumbersRef.current[targetFrame];
            drawFrame(framesRef.current[frameNum]);

            const teacherVid = teacherVideoRef.current;
            const studentVid = studentVideoRef.current;
            if (teacherVid && studentVid) {
              const time = targetFrame / 30;
              teacherVid.currentTime = time;
              studentVid.currentTime = time;
            }
          }
        }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis dataKey="frame" />
        <YAxis domain={[0, 100]} tickFormatter={(t) => `${t}%`} />
        <Tooltip formatter={(v) => `${v}%`} />
        <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" dot={false} />
        {accuracyHistory.length > frameIndex && (
          <ReferenceDot
            x={accuracyHistory[frameIndex].frame}
            y={accuracyHistory[frameIndex].accuracy}
            r={6}
            fill="#e8ccce"
            stroke="black"
            isFront={true}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
      </div>
        <SkeletonFeedback currentFrameData={currentFrameData} />
      </div>

      <div className="compare-progress-bar">
        <ProgressWithSeek
          totalFrames={totalFrames}
          frameIndex={frameIndex}
          onSeek={(targetFrame) => {
            frameRef.current = targetFrame;
            setFrameIndex(targetFrame);
            const frameNum = frameNumbersRef.current[targetFrame];
            drawFrame(framesRef.current[frameNum]);
          }}
        />
      </div>
      {/* 左下角影片同步顯示 */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        display: 'flex',
        gap: '20px',
        zIndex: 10
      }}>
        {/* 老師影片 */}
        <div>
          <h4 style={{ margin: '0 0 4px 0' }}>Teacher</h4>
          <video ref={teacherVideoRef} src={courseData.syncVideoUrl} controls width="320" height="240" />
        </div>
        {/* 學生影片 */}
        <div>
          <h4 style={{ margin: '0 0 4px 0' }}>Student</h4>
          <video ref={studentVideoRef} src={`/student/${courseData.courseName}/${courseData.studentVideo}`} controls width="320" height="240" />
        </div>
      </div>
    </div>
  );
}
