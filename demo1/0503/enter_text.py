from keras.models import load_model
import jieba
from tensorflow.keras.preprocessing.sequence import pad_sequences
from token_help import test

# 定義預處理函式
def process_text(text):
    # 分詞處理
    processed_text = jieba.lcut(text)
    print(processed_text)
    # 將文本轉換為數字序列
    processed_input = tokenizer.texts_to_sequences([processed_text])
    print(processed_input)
    # 填充序列至固定長度
    processed_input = pad_sequences(processed_input, maxlen=max_length)
    return processed_input

# 假設你有一個 tokenizer 和 max_length
tokenizer = test()
max_length = 50

# 載入模型
model = load_model("my_model.h5")

# 讓使用者輸入文本
user_input = input("请输入文本：")

# 將使用者輸入的文本進行預處理
processed_input = process_text(user_input)

# 使用模型進行預測
prediction = model.predict(processed_input)

# 打印預測結果
print("正面情感機率：", prediction[0][1])
print("負面情感機率：", prediction[0][0])
if(prediction[0][1]>prediction[0][0]):
    print("1:判斷為正面")
else:
    print("0:判斷為負面")
