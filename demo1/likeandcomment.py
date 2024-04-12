import pymysql
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def get_like_count_from_database():
    # 连接到数据库
    conn = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='12345678',
        database='test',
    )
    cursor = conn.cursor()

    sql = """
    SELECT LIKETIME 
    FROM times
    """
    
    cursor.execute(sql)
    data = cursor.fetchone()[0]
    
    # 关闭游标和连接
    cursor.close()
    conn.close()
    
    return data

@app.route('/')
def index():
    data = get_like_count_from_database()
    return render_template('index.html', like_count=data)

@app.route('/record_like', methods=['POST'])
def record_like():
    data = get_like_count_from_database()
    
    # 增加点赞次数
    data += 1
    
    # 更新数据库中的点赞次数
    conn = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='12345678',
        database='test',
    )
    cursor = conn.cursor()
    
    sql = """
    UPDATE times 
    SET LIKETIME = %s
    """
    
    cursor.execute(sql, (data,))
    conn.commit()
    
    # 关闭游标和连接
    cursor.close()
    conn.close()
    
    # 将点赞次数作为 JSON 响应发送回客户端
    return jsonify({'like_count': data})

@app.route('/save_comment', methods=['POST'])
def save_comment():
    comment = request.json.get('comment')
    
    # 连接到数据库
    conn = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='12345678',
        database='test',
    )
    cursor = conn.cursor()

    # 插入留言到数据库
    sql = """
    INSERT INTO COMMENT (COMMENT) 
    VALUES (%s)
    """
    cursor.execute(sql, (comment,))
    conn.commit()
    
    # 关闭游标和连接
    cursor.close()
    conn.close()
    
    # 返回成功的响应
    return jsonify({'success': True})

@app.route('/get_like_count', methods=['GET'])
def get_like_count():
    # 获取点赞次数
    like_count = get_like_count_from_database()
    # 将点赞次数作为 JSON 响应发送给客户端
    return jsonify({'like_count': like_count})

if __name__ == '__main__':
    app.run(debug=True)
