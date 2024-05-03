# 導入 Tokenizer 模塊

from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import pymysql
import jieba
from token_help import test
# 定義預處理函式
def process_text(text):
    # 分詞處理
    processed_text = jieba.lcut(text)
    #print(processed_text)
    # 將文本轉換為數字序列
    processed_input = tokenizer.texts_to_sequences([processed_text])
    #print(processed_input)
    # 填充序列至固定長度
    processed_input = pad_sequences(processed_input, maxlen=max_length)
    return processed_input
# 加載模型
model = load_model('my_model1.h5')
max_length = 50

# 創建一個 Tokenizer 對象
tokenizer = test()

# 連接到數據庫
conn = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='12345678',
    database='alcohol',
    cursorclass=pymysql.cursors.DictCursor
)

# 查詢留言數據
try:
    with conn.cursor() as cursor:
        sql = "SELECT Message FROM `cocktail of message`"
        cursor.execute(sql)
        result = cursor.fetchall()
        
        # 遍歷每條留言
        for row in result:
            message = row['Message']
           
            # 讓使用者輸入文本
            user_input = message

            # 將使用者輸入的文本進行預處理
            processed_input = process_text(user_input)

            # 使用模型進行預測
            prediction = model.predict(processed_input)
            # 根據模型輸出確定情感，這裡假設模型輸出第一維度大於0.5為正面情感
            
            if prediction[0][1] > prediction[0][0]:
                sentiment = "Positive" 
            elif prediction[0][1] < prediction[0][0]:
                sentiment ="Negative"
            else:sentiment='none'
            # 打印留言及其情感
            print("Message:", message)
            print("Sentiment:", sentiment)
            print("------------------------------")

finally:
    conn.close()
