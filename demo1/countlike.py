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
    return render_template('index.html', data=data)

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

if __name__ == '__main__':
    app.run(debug=True)
