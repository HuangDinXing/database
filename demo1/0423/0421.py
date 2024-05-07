import pymysql
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# 连接到数据库
conn = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='12345678',
    database='test',
)
cursor = conn.cursor()

def get_like_count_from_database():
    sql = "SELECT LIKETIME FROM times"
    cursor.execute(sql)
    data = cursor.fetchone()[0]
    return data

# 获取当前点赞状态
def get_like_status_from_database():
    sql = "SELECT LIKED FROM times"
    cursor.execute(sql)
    liked = cursor.fetchone()[0]
    return liked

@app.route('/')
def index():
    # 获取当前点赞数量
    like_count = get_like_count_from_database()
    # 获取当前点赞状态
    liked = get_like_status_from_database()
    return render_template('index.html', like_count=like_count, liked=liked)

# 点赞记录
@app.route('/record_like', methods=['POST'])
def record_like():
    # 获取当前点赞数量
    like_count = get_like_count_from_database()
    # 获取当前点赞状态
    liked = get_like_status_from_database()
    
    if liked:
        # 如果已经点过赞，则取消赞
        like_count -= 1
        liked = False
    else:
        # 如果没有点过赞，则点赞
        like_count += 1
        liked = True
    
    # 更新数据库中的点赞数量和状态
    sql = "UPDATE times SET LIKETIME = %s, LIKED = %s"
    cursor.execute(sql, (like_count, liked))
    conn.commit()
    
    return jsonify({'like_count': like_count, 'liked': liked})

if __name__ == '__main__':
    app.run(debug=True)
