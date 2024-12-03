import React, { useState } from 'react';
import './ApplyPageStyles.css';
import foodpandaLogo from '../assets/foodpanda_logo.jfif';
import foodpandaad from '../assets/foodpanda_ad.jpg_31-10-2024-07_09_58';
import foodpandaFeature from '../assets/motrobikeman.jpg_27-11-2023-08_03_23';
import foodpandaFeature2 from '../assets/motowomen.jpg_27-11-2023-08_03_23';
import cash from '../assets/cash.svg_21-06-2021-09_52_43';
import firstaidkit from '../assets/firstaidkit.svg_21-06-2021-09_52_43';
import balloon from '../assets/balloon.svg_21-06-2021-09_52_43';
import mrslin from '../assets/mrslin.jpg_01-07-2021-09_05_19';
import mrlin from '../assets/mrlin.jpg_01-07-2021-09_05_32';
import footpic from '../assets/footpic.jpg_27-11-2023-08_03_22';
import footerpic from '../assets/footerpic.png';

const ApplyPage = () => {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('');
  const [formData, setFormData] = useState({
    deliveryManFirstName: '',
    deliveryManLastName: '',
    deliveryManPhoneNumber: '',
    deliveryManMail: '',
    deliveryManIDCard: '',
    age: '',
    privacyPolicy: false,
  });

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    checkShowAdditionalFields(event.target.value, selectedTransport);
  };

  const handleTransportChange = (event) => {
    setSelectedTransport(event.target.value);
    checkShowAdditionalFields(selectedCity, event.target.value);
  };

  const checkShowAdditionalFields = (city, transport) => {
    if (city && transport) {
      setShowAdditionalFields(true);
    } else {
      setShowAdditionalFields(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || '1', // 使用預設值 '1'
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // 添加非空检查
    const cityIDElement = document.querySelector('#cityID');
    const transportationElement = document.querySelector('#transportation');
    const ageElement = document.querySelector('input[name="18years"]:checked');

    if (!cityIDElement || !transportationElement || !ageElement) {
        alert('请检查所有必填项是否选择完整');
        return;
    }

    const formData = {
      cityID: cityIDElement.value,
      transportation: transportationElement.value,
      deliveryManFirstName: document.querySelector('input[name="deliveryManFirstName"]').value,
      deliveryManLastName: document.querySelector('input[name="deliveryManLastName"]').value,
      deliveryManPhoneNumber: document.querySelector('input[name="deliveryManPhoneNumber"]').value,
      deliveryManMail: document.querySelector('input[name="deliveryManMail"]').value || null,
      deliveryManIDCard: document.querySelector('input[name="deliveryManIDCard"]').value || null,
      '18years': ageElement.value, // 保持与数据库字段一致
    };
  
    try {
        const response = await fetch('http://127.0.0.1:5000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
  
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};

  return (
    <div>
      <div className="apply-page">
        <img src={foodpandaLogo} alt="Food Panda Logo" className="logo" />
        <button className="apply-button">ZH</button>
      </div>

      <div className="new-section">
        <div className="section-title1">與foodpanda合作外送</div>
        <div className="section-content">
          <img src={foodpandaad} alt="foodpandaad" className="section-image" />
          <form className="section-form123" onSubmit={handleSubmit}>
            <h2 className="form-title123">填寫您的個人資訊</h2>
            <div className="form-group">
              <select id="cityID" name="city" onChange={handleCityChange}>
                <option value="">選擇您的城市</option>
                <option value="E01">台北市</option>
                <option value="E02">新北市</option>
                <option value="E03">桃園市</option>
                <option value="E07">台中市</option>
                <option value="E13">台南市</option>
                <option value="E14">高雄市</option>
                <option value="Keelung City">基隆市</option>
                <option value="E04">新竹市</option>
                <option value="E11">嘉義市</option>
                <option value="E05">新竹縣</option>
                <option value="E06">苗栗縣</option>
                <option value="E08">彰化縣</option>
                <option value="E09">南投縣</option>
                <option value="E10">雲林縣</option>
                <option value="E12">嘉義縣</option>
                <option value="E15">屏東縣</option>
                <option value="E16">宜蘭縣</option>
                <option value="E17">花蓮縣</option>
                <option value="E18">台東縣</option>
                <option value="E19">澎湖縣</option>
                <option value="E20">金門縣</option>
                <option value="E21">連江縣</option>
              </select>
            </div>
            <div className="form-group">
              <select id="transportation" name="transport" onChange={handleTransportChange}>
                <option value="">選擇您的交通工具</option>
                <option value="motorcycle">機車</option>
                <option value="electric motorcycle">電動機車</option>
              </select>
            </div>

            {showAdditionalFields && (
              <div className="additional-fields">
                <div className="form-group">
                  <input
                    type="text"
                    name="deliveryManFirstName"
                    placeholder="姓氏"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="deliveryManLastName"
                    placeholder="名字"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="deliveryManPhoneNumber"
                    placeholder="手機號碼"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="deliveryManMail"
                    placeholder="信箱"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="deliveryManIDCard"
                    placeholder="身分證字號"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            <div className="form-group-age">
              <label>您是否已年滿 18 歲？</label>
              <div className="age-options">
                <label>
                  <input
                    type="radio"
                    name="18years"
                    value="1"
                    onChange={handleInputChange}
                    required
                  />
                  是
                </label>
                <label>
                  <input
                    type="radio"
                    name="18years"
                    value="0"
                    onChange={handleInputChange}
                    required
                  />
                  否
                </label>
              </div>
            </div>
            <div className="form-group-agree">
              <div className="agree-options">
                <label>
                  <input
                    type="checkbox"
                    name="privacyPolicy"
                    onChange={(e) => setFormData({ ...formData, privacyPolicy: e.target.checked })}
                    required
                  />
                  我同意以上隱私權政策，並同意foodpanda針對個人資料的蒐集、處理和使用我所提供資訊。我已閱讀並理解隱私權政策
                </label>
              </div>
            </div>
            <button type="submit" className="submit-button">
              <p>提交</p>
            </button>
          </form>
        </div>
      </div>

      <div className="new-section1">
        <div className="section-text1">
          <h2>探索城市</h2>
          <p>探索城市的每個街道巷弄，享受自由的旅程。</p>
        </div>
        <img src={foodpandaFeature} alt="foodpanda Feature" className="section-image1" />

        <div className="section-text2">
          <h2>荷包的深度自己掌握</h2>
          <p>做越多賺越多，這筆額外收入將直接進您的口袋！</p>
        </div>
        <img src={foodpandaFeature2} alt="foodpanda Feature2" className="section-image2" />
      </div>

      <div className="othergood">
        <h2>其他好康:</h2>
        <div className="gooditems">
          <div className="cash">
            <div className="cash-text">
              <img src={cash} alt="cash" />
              <p>享有精選多元夥伴特約，包含購車、電信、餐飲優惠折扣</p>
            </div>
          </div>

          <div className="firstaidkit">
            <div className="firstaidkit-text">
              <img src={firstaidkit} alt="firstaidkit" />
              <p>享有團險保障(實支實付傷害醫療、意外住院日額、意外事故身故/失能)</p>
            </div>
          </div>

          <div className="balloon">
            <div className="balloon-text">
              <img src={balloon} alt="balloon" />
              <p>企業CSR活動和外送夥伴專屬活動</p>
            </div>
          </div>
        </div>
      </div>

      <div className="applyfoot">
        <h2>申請條件簡單快速，foodpanda 成為你的新支柱！</h2>
        <ul>
          <li>年滿18歲，具備台灣身分證</li>
          <li>本人之「台幣」帳戶（可擇一使用中國信託銀行、國泰世華銀行、玉山商業銀行、台新國際商業銀行、中華郵政、台灣銀行）</li>
          <li>機車、機車駕照、機車強制險卡</li>
          <li>含網路的智慧型手機</li>
          <li>警察刑事紀錄證明（良民證）</li>
        </ul>
      </div>

      <div className="deliveryparners">
        <h2>外送夥伴故事</h2>
        <div className="parners">
          <div className="mrslin">
            <div className="mrslin-text">
              <img src={mrslin} alt="mrslin_img" className="mrslinpic" />
              <h2>外送夥伴林小姐</h2>
              <p>支持她擁抱斜槓人生的，正是foodpanda的外送工作! 除了外送員的身分，我同時也是一名藝術工作者，平時會接一些視覺設計、影像攝影的案子。自由彈性的工作特性，讓我能夠做自己喜歡的事。剛開始幾乎天天上線，一天大概跑8小時。雖然有點辛苦但遇過很多消費者會送水或飲料。這些鼓勵都讓我更有動力堅持下去。外送的報酬讓我不必再擔心生活，更可以專注地投入創作。</p>
            </div>
          </div>

          <div className="mrlin">
            <div className="mrlin-text">
              <img src={mrlin} alt="mrlin_img" className="mrlinpic" />
              <h2>外送夥伴林先生</h2>
              <p>可以自由地騎車又可以存錢，沒有比這更開心的事了! 每天開工前，我會做好萬全的準備，像是把油加滿、零錢備妥。跑過其他外送平台，最後選擇留在foodpanda服務，主因是合作的餐廳較多、不需跨區外送，尤其是「選擇時段上線」的制度，讓外送員可以維持一定的單量，不會互相搶單，單量與報酬都更穩定、更有保障。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footpng">
        <img src={footpic} alt="footpic_img" className="footpic" />
        <h2>實踐自由的人生，就選 foodpanda 外送工作！</h2>
      </div>

      <div className="footerpng">
        <div className="footerleft">
          <img src={footerpic} alt="footpic_img" className="footerpic" />
        </div>
        <div className="footerright">
          <h2>了解更多</h2>
          <p>開通懶人包</p>
          <p>申請開通助手 官方</p>
          <p>LINE</p>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
