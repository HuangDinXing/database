import React, { useState } from "react"; // 確保導入 useState
import './StoreJoinPageStyles.css';
import TW_flag from '../assets/TW_flag.svg'; // 匯入圖片
import food from '../assets/food.avif'; // 匯入圖片
import cakeflower from '../assets/cakeflower.webp'; // 匯入圖片
import pinkpanda from '../assets/pinkpanda.webp'; // 匯入圖片
import cellphone from '../assets/cellphone.avif'; // 匯入圖片
import pandacook from '../assets/pandacook.webp'; // 匯入圖片
import bread from '../assets/bread.avif'; // 匯入圖片
import trapperform from '../assets/trapperform.avif'; // 匯入圖片
import holdburger from '../assets/holdburger.webp'; // 匯入圖片
import pandabag from '../assets/pandabag.jpg'; // 匯入圖片
import "./SignUp.css"; // 確保你的 CSS 文件正確引入
import SignUp from "../components/SignUp"; // 引入 SignUp 組件
import { Link } from "react-router-dom"; // 引入 Link
import Footer from "../components/Footer";

function StoreJoinPage() {
    const [isSignUpOpen, setSignUpOpen] = useState(false); // 狀態管理

    const handleLoginClick = () => {
        setSignUpOpen(true); // 顯示 SignUp 視窗
    };

    const handleClose = () => {
        setSignUpOpen(false); // 隱藏 SignUp 視窗
    };

    return (
        <div className="store-join-page">
            <div className="store-join-top">
                <div className="banner-foodpandalogo">
                    <Link to="/">
                        <img src="https://partner.foodpanda.com.tw/resource/1731061312000/FoodpandaResourceV2/FoodpandaResourceV2/images/new_design/logo.svg" alt="panda" />
                    </Link>                
                </div>
                
                <div className="banner-loginbutton">
                <button type="button" className="submit-button" onClick={handleLoginClick}>                        <p>登錄</p>
                    </button>           
                </div>
                
                <div className="banner-global">
                    <img src="https://partner.foodpanda.com.tw/resource/1731061312000/FoodpandaResourceV2/FoodpandaResourceV2/images/new_design/globe-icon.svg" alt="global" />
                </div>
            </div>                    

            <div className="fillname">
                <div className="fill_intro">
                    <h2 className="section-title">立即成為 foodpanda合作夥伴！</h2>
                    <p className="section-title2">加入 foodpanda 外送平臺提高營收</p>
                </div>
                <div class="section-form">
                    <h2 className="form-title">準備好拓展您的業務了嗎？</h2>
                    <div>
                        <input type="text" id="input1" placeholder="負責人名字(不包含姓氏)" />
                    </div>
                    <div>
                        <input type="text" id="input2" placeholder="負責人姓氏" />
                    </div>
                    <div>
                        <input type="text" id="input3" placeholder="電子郵件" />
                    </div>
                    <div>
                        <select id="dropdown">
                            <option value="" disabled selected>商家種類</option> 
                            <option value="option1">餐廳店家</option>
                            <option value="option2">生鮮雜貨店家</option>
                        </select>
                    </div>
                    <div>
                        <div className="flag">
                            <img src={TW_flag} alt="flag" className="TW_flag" />
                            <p className="phonearea">+886</p>
                            <input type="text" id="input4" placeholder="連絡電話" />
                        </div>
                        
                    </div>
                    <button className="start-button" >
                    開始
                    </button>
                </div>
            </div>

            <div className="makechance">
                <h2>foodpanda為您創造新<span class="color1">機會</span></h2>
                <div className="chanceitem">

                    <div className="newcontact">
                        <div className="food-text">
                        <img src={food} alt="justfood" className="food" />
                        <h2>與新客戶建立聯繫</h2>
                        <p>加入您的商家到平台上可以觸及到更廣泛的客源。</p>

                        </div>
                        
                    </div>

                    <div className="increaseincome">
                        <div className="panda-text">
                        <img src={pinkpanda} alt="justpanda" className="panda" />
                        <h2>增加營收</h2>
                        <p>讓消費者隨時享受您的餐點，並吸引新的消費客群。</p>                    
                        </div>
                    </div>

                    <div className="focusonu">
                        <div className="cake-text">
                        <img src={cakeflower} alt="justcake" className="cake" />
                        <h2>專注於您的業務</h2>
                        <p>我們負責所有款項和支援商家，並由foodpanda 外送夥伴負責送餐。您只需專注製作餐點即可！</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="store-join-video" >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/gttOwv5QSrA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>

            <div className="easy-flow">
                <h2>簡單的<span class="color1">接單流程</span></h2>
                <div className="fourstep">

                    <div className="comsumer">
                        <div className="fcomsumer-text">
                        <img src={cellphone} alt="cellphone1" className="cellphone" />
                        <h2>消費者訂單</h2>
                        <p>消費者通過 foodpanda下單</p>
                        </div>
                    </div>

                    <div className="pandacook">
                        <div className="pandacook-text">
                        <img src={pandacook} alt="pandacook1" className="pandacook" />
                        <h2>您準備</h2>
                        <p>您收到訂單通知後就可以開始準備餐點</p>                    
                        </div>
                    </div>

                    <div className="bread">
                        <div className="bread-text">
                        <img src={bread} alt="bread1" className="bread" />
                        <h2>我們送</h2>
                        <p>foodpanda外送夥伴很快就會來取餐並將其交給消費者</p>
                        </div>
                    </div>

                    <div className="trapperform">
                        <div className="trapperform-text">
                        <img src={trapperform} alt="trapperform1" className="trapperform" />
                        <h2>追蹤商家的收益表現</h2>
                        <p>我們為您提供營運建議，您可以評估的收益和訂單表現</p>                    
                        </div>
                    </div>

                </div>
            </div>

            <div className="fourblock">
                <div className="quadrant top-left">
                    <img src={pandabag} alt="Top Left" className="pandabag" />
                </div>
                <div className="quadrant bottom-left">
                    <h2>Hala Chicken 與 foodpanda 的合作使收入大幅增加，透過平台行銷使訂單量翻倍，即使沒有店內顧客，也確保了穩定的業績。</h2>
               
                </div>
                <div className="quadrant bottom-right">
                    <h2>為顧及老客人想吃現點熱菜的心意，金蓬萊第三代老闆兼主廚陳博璿秉持這份心意加入 foodpanda。</h2>
                </div>
                <div className="quadrant top-right">
                    <img src={holdburger} alt="Top Right" className="holdburger" />
                </div>    
             </div>








             <SignUp isOpen={isSignUpOpen} onClose={handleClose} /> {/* 使用 SignUp 組件 */}


            <Footer />
        </div>
    );
}

export default StoreJoinPage;
