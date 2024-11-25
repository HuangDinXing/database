import React from 'react';
import './ApplyPageStyles.css';
import foodpandaLogo from '../assets/foodpanda_logo.jfif';
import foodpandaad from '../assets/foodpanda_ad.jpg_31-10-2024-07_09_58'
const ApplyPage = () => {
  const handleButtonClick = () => {
    // 在這裡添加按鈕點擊的功能
    console.log('Button clicked!');
  };

  return (
    <div>
      <div className="apply-page">
        <img src={foodpandaLogo} alt="Food Panda Logo" className="logo" />
        <button className="apply-button" onClick={handleButtonClick}>
          ZH
        </button>
      </div>
      <div className="new-section">
        <div className="section-title">與foodpanda合作外送</div>
        <div className="section-content">
          <img src={foodpandaad} alt="foodpandaad" className="section-image" />
          <div className="section-form">
            <h2 className="form-title">填寫您的個人資訊</h2>
            <div className="form-group">
              <select id="position" name="position">
              <option value="">選擇您的城市</option>
              <option value="Taipei City">台北市</option>
              <option value="New Taipei City">新北市</option>
              <option value="Taoyuan City">桃園市</option>
              <option value="Taichung City">台中市</option>
              <option value="Tainan City">台南市</option>
              <option value="Kaohsiung City">高雄市</option>
              <option value="Keelung City">基隆市</option>
              <option value="Hsinchu City">新竹市</option>
              <option value="Chiayi City">嘉義市</option>
              <option value="Hsinchu County">新竹縣</option>
              <option value="Miaoli County">苗栗縣</option>
              <option value="Changhua County">彰化縣</option>
              <option value="Nantou County">南投縣</option>
              <option value="Yunlin County">雲林縣</option>
              <option value="Chiayi County">嘉義縣</option>
              <option value="Pingtung County">屏東縣</option>
              <option value="Yilan County">宜蘭縣</option>
              <option value="Hualien County">花蓮縣</option>
              <option value="Taitung County">台東縣</option>
              <option value="Penghu County">澎湖縣</option>
              <option value="Kinmen County">金門縣</option>
              <option value="Lienchiang County">連江縣</option>
              </select>
            </div>
            <div className="form-group">
              <select id="location" name="location">
                <option value="">選擇您的交通工具</option>
                <option value="motorcycle">機車</option>
                <option value="electric motorcycle">電動機車</option>
              </select>
            </div>
            <button type="submit" className="submit-button">
              提交
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
