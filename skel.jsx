import React, { useState } from 'react';

// Skeleton parts (細部區域) 對應 Landmark index
const SKELETON_PARTS = {
    // 頭部
    'Head': [0, 1, 2, 3, 4, 7, 8, 9, 10], // 頭頂、眼睛、耳朵、嘴巴、鼻子
  
    // 左右肩膀
    'Left Shoulder': [11],
    'Right Shoulder': [12],
  
    // 左右手臂（含手肘）
    'Left Upper Arm': [11, 13],   // 左上臂
    'Right Upper Arm': [12, 14],  // 右上臂
  
    // 左右前臂（手肘到手腕）
    'Left Forearm': [13, 15],
    'Right Forearm': [14, 16],
  
    // 左右手掌（手腕到手）
    'Left Hand': [15, 17, 19, 21],   // 左手腕 + 左手指（拇指）
    'Right Hand': [16, 18, 20, 22],  // 右手腕 + 右手指（拇指）
  
    // 上半身軀幹
    'Upper Body': [11, 12, 23, 24], // 雙肩+雙髖
  
    // 下背部（腰）
    'Lower Back': [23, 24],
  
    // 左右臀部（髖關節）
    'Left Hip': [23],
    'Right Hip': [24],
  
    // 左右大腿
    'Left Thigh': [23, 25],
    'Right Thigh': [24, 26],
  
    // 左右膝蓋
    'Left Knee': [25],
    'Right Knee': [26],
  
    // 左右小腿（膝到腳踝）
    'Left Calf': [25, 27],
    'Right Calf': [26, 28],
  
    // 左右腳踝
    'Left Ankle': [27],
    'Right Ankle': [28],
  
    // 左右腳掌（腳踝到腳趾）
    'Left Foot': [27, 29, 31], // 左腳跟、左腳拇趾
    'Right Foot': [28, 30, 32], // 右腳跟、右腳拇趾
  };  

// 每個小部位對應到一個大範圍 group
const BODY_GROUP = {
    'Head': 'Head',
  
    'Left Shoulder': 'Left Arm',
    'Left Upper Arm': 'Left Arm',
    'Left Forearm': 'Left Arm',
    'Left Hand': 'Left Arm',
  
    'Right Shoulder': 'Right Arm',
    'Right Upper Arm': 'Right Arm',
    'Right Forearm': 'Right Arm',
    'Right Hand': 'Right Arm',
  
    'Upper Body': 'Torso',
    'Lower Back': 'Torso',
    'Spine': 'Torso',
  
    'Left Hip': 'Left Leg',
    'Left Thigh': 'Left Leg',
    'Left Knee': 'Left Leg',
    'Left Calf': 'Left Leg',
    'Left Ankle': 'Left Leg',
    'Left Foot': 'Left Leg',
  
    'Right Hip': 'Right Leg',
    'Right Thigh': 'Right Leg',
    'Right Knee': 'Right Leg',
    'Right Calf': 'Right Leg',
    'Right Ankle': 'Right Leg',
    'Right Foot': 'Right Leg',
  };
  

// 偏差等級與顏色
const classifyDeviation = (distance) => {
  if (distance >= 0.3) return { level: 'Severe', color: '#6C216D' };
  if (distance >= 0.2) return { level: 'Moderate', color: '#E8373D' };
  if (distance >= 0.1) return { level: 'Mild', color: '#ff5900' };
  return { level: 'Normal', color: '#00ff00' };
};

export default function SkeletonFeedback({ currentFrameData, threshold = 0.1 }) {
  const [gptText, setGptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!currentFrameData) return null;

  const m1 = new Map(), m2 = new Map();
  currentFrameData.forEach(p => {
    const v = { x: p.x, y: p.y, z: p.z };
    if (p.skeletonId === 1) m1.set(p.landmarkIndex, v);
    else m2.set(p.landmarkIndex, v);
  });

  const feedbackDetails = [];

  Object.entries(SKELETON_PARTS).forEach(([partName, indices]) => {
    let totalDist = 0, count = 0;
    indices.forEach(i => {
      if (m1.has(i) && m2.has(i)) {
        const v1 = m1.get(i), v2 = m2.get(i);
        const dist = Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2 + (v1.z - v2.z) ** 2);
        totalDist += dist;
        count++;
      }
    });
    if (count > 0) {
      const avgDist = totalDist / count;
      const { level, color } = classifyDeviation(avgDist);
      if (level !== 'Normal') {
        feedbackDetails.push({ part: partName, group: BODY_GROUP[partName], level, color });
      }
    }
  });

  const groupedByLevel = feedbackDetails.reduce((acc, { group, level, color }) => {
    if (!acc[level]) acc[level] = { color, groups: new Set() };
    acc[level].groups.add(group);
    return acc;
  }, {});

  const sendToGPT = async () => {
    setIsLoading(true);
    setGptText("正在分析整體建議...");
    try {
      const res = await fetch('/api/gpt-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackDetails })
      });
      const data = await res.json();
      if (data.feedback) {
        setGptText(data.feedback);
      } else {
        setGptText("⚠️ GPT 回傳格式錯誤");
      }
    } catch (err) {
      console.error("GPT 回饋錯誤:", err);
      setGptText("❌ 無法取得 GPT 回饋");
    }
    setIsLoading(false);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '-10px',
      right: '-730px',
      background: '#f9f9f9',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 0 5px rgba(0,0,0,0.1)',
      fontSize: '0.8rem',
      zIndex: 30,
      maxWidth: '340px'
    }}>
      <b style={{ fontSize: '1rem' }}>Movement Feedback:</b><br />
      {Object.keys(groupedByLevel).length > 0 ? (
        <div style={{ marginTop: '8px' }}>
          {Object.entries(groupedByLevel).map(([level, { color, groups }], i) => (
            <div key={i} style={{ marginBottom: '6px', color }}>
              <b>{level}</b> deviation: {Array.from(groups).map((g, idx) => (
                <span key={idx}><b>{g}</b>{idx < groups.size - 1 ? '、' : ''} </span>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: '6px', color: '#00aa00' }}>Great posture! Keep it up!</div>
      )}

      <button onClick={sendToGPT} disabled={isLoading} style={{
        marginTop: '12px',
        padding: '6px 12px',
        borderRadius: '4px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
      }}>
        
        {isLoading ? '分析中...' : '分析整體建議'}
      </button>

      {gptText && (
        <div style={{
          marginTop: '10px',
          background: '#fffde7',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          fontStyle: 'italic',
          whiteSpace: 'pre-wrap',
          maxHeight: 'none' ,// 不限制高度
          overflow: 'visible' // 不限制溢出

        }}>
          總結：{gptText}
        </div>
      )}
    </div>
  );
}
