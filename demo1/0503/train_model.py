
import numpy as np

import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing import sequence
from keras.preprocessing.sequence import pad_sequences

from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation,Flatten
from keras.layers import Embedding
from keras.layers import LSTM
from tensorflow.keras.preprocessing.text import Tokenizer

import jieba

#取得停用詞
import os

# 定义处理文本的函数
def process_text(text):
    # 使用tokenizer将文本转换为数字序列
    text_seq = token.texts_to_sequences([text])
    # 使用pad_sequences将数字序列填充到相同长度
    padded_seq = pad_sequences(text_seq, maxlen=50)
    return padded_seq

def load_stopwords():
    # 取得當前執行檔案的絕對路徑
    current_path = os.path.abspath(__file__)
    
    # 獲取所在目錄的路徑
    directory = os.path.dirname(current_path)
    
    # 構建 'wordstop.txt' 檔案的完整路徑
    wordstop_path = os.path.join(directory, 'wordstop.txt')
    
    # 打開 'wordstop.txt' 檔案並讀取停用詞
    with open(wordstop_path, 'r', encoding='utf8') as f:
        stopWords = f.read().split('\n')
        
    stopWords.append('\n')
    
    return stopWords

# 調用函式加載停用詞
stopWords = load_stopwords()


# 讀取文本檔案並存儲為列表
with open("training_data.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()

# 创建一个长度为300的数组，全部初始化为1
array = np.ones(596)

# 将后面的部分置为0
array = np.concatenate([array, np.zeros(527)])
y_train = array

# 將文本和標籤組合成元組
data_tuples = list(zip(lines, y_train))

# 將元組列表打亂
np.random.shuffle(data_tuples)

# 分離打亂後的文本和標籤
shuffled_texts, shuffled_labels = zip(*data_tuples)

# 將文本和標籤轉換為 numpy 陣列
x_train = np.array(shuffled_texts)
y_train = np.array(shuffled_labels)

# 將標籤轉換為整數型別
y_train = y_train.astype(int)




#把標籤設定成固定格式[0,1](這樣是1)，[1,0](這樣是0)
from tensorflow.python.keras.utils import np_utils
y_train = np_utils.to_categorical(y_train, 2)

sentence=[]

#透過jieba分詞工具，把自分成一個一個單字
for content in x_train:
    _sentence=list(jieba.cut(content, cut_all=True))
    sentence.append(_sentence)

remainderWords2 = []

#如果裡面有停用詞，將其移除
for content in sentence:
    remainderWords2.append(list(filter(lambda a: a not in stopWords, content)))

#建立中文字典，把文字轉換成數字(取最常使用到的3000個字)
token = Tokenizer(num_words=3000)
token.fit_on_texts(remainderWords2)

x_train_seq = token.texts_to_sequences(remainderWords2)#把資料轉換成為數字

x_train = sequence.pad_sequences(x_train_seq, maxlen=50)#把每一筆資料轉換長度為50
print(x_train.shape)

model = Sequential()
# 将字典长度改为3000，评论数据长度改为50
model.add(Embedding(output_dim=128,
                    input_dim=3000,  # 修改为3000
                    input_length=50))

model.add(LSTM(units=64))  # 删除activation参数


model.add(Dense(units=128,
                activation='relu'))
model.add(Dropout(0.5))  # Dropout值改为0.5

model.add(Dense(units=2,
                activation='sigmoid'))
model.summary()

model.compile(loss='binary_crossentropy', 
              optimizer='adam', 
              metrics=['accuracy'])

train_history =model.fit(x_train, 
                         y_train,
                         batch_size=128, 
                         epochs=100,
                         verbose=2,
                         
                         validation_split=0.2)

#x_test = x_train[:1]


model.save('my_model1.h5')
