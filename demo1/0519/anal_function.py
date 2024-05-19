from grab_sql2 import process_text
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import jieba
from token_help import test
# 使用情感分析功能
# 加载模型
model = load_model('my_model1.h5')
max_length = 50

# 創建一個 Tokenizer 對象
tokenizer = test()
# 定义处理文本的函数
def analyze_sentence(message):
    # 分詞處理
    processed_text = jieba.lcut(message)
    #print(processed_text)
    # 將文本轉換為數字序列
    processed_input = tokenizer.texts_to_sequences([processed_text])
    #print(processed_input)
    # 填充序列至固定長度
    processed_input = pad_sequences(processed_input, maxlen=max_length)

# 定义情感分析函数
    # 將使用者輸入的文本進行預處理
    processed_input = process_text(message)

    # 使用模型進行預測
    prediction = model.predict(processed_input)
    
    # 根据模型输出确定情感
    if prediction[0][1] > prediction[0][0]:
        print(prediction[0][1])
        print("正面")
        return 1  # 正面情感
        
    elif prediction[0][1] < prediction[0][0]:
        print(prediction[0][0])
        print("負面")
        return 0  # 负面情感
    else:
        return -1  # 无法确定情感
