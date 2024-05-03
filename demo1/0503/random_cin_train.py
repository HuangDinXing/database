import random
from keras.models import load_model
import jieba
from tensorflow.keras.preprocessing.sequence import pad_sequences
from token_help import test  # 这里导入你的 test 模块

# 定义预处理函数
def process_text(text):
    # 分词处理
    processed_text = jieba.lcut(text)
    # 将文本转换为数字序列
    processed_input = tokenizer.texts_to_sequences([processed_text])
    # 填充序列至固定长度
    processed_input = pad_sequences(processed_input, maxlen=max_length)
    return processed_input

# 假设你有一个 tokenizer 和 max_length
tokenizer = test()
max_length = 50

# 载入模型
model = load_model("my_model.h5")

# 读取 training_data.txt 文件并将其存储为列表
with open("training_data.txt", "r", encoding="utf-8") as file:
    training_data = file.readlines()

# 从训练数据中随机选择 50 个样本
random_samples = random.sample(training_data, 50)

# 循环处理和预测每个样本
for sample in random_samples:
    # 预处理文本
    processed_input = process_text(sample)
    
    # 使用模型进行预测
    prediction = model.predict(processed_input)
    
    # 打印预测结果
    #print("正面情感概率：", prediction[0][1])
    #print("负面情感概率：", prediction[0][0])
    print(sample)
    if prediction[0][1] > prediction[0][0]:
        print("判定结果：正面")
        
    else:
        print("判定结果：负面")
