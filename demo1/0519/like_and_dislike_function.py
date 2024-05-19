import pymysql
from flask import Flask, render_template, request, jsonify
def like_and_dislike_function():
    app = Flask(__name__)
    
    # 连接到数据库
    conn = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='12345678',
        database='alcohol',
    )
    
    # 设置用于接收点赞操作的路由
    @app.route('/like_cocktail', methods=['POST'])
    def like_cocktail():
        cursor = conn.cursor()
    
        try:
            # 检查数据库中是否已存在点赞记录
            sql_check_like = """
            SELECT * 
            FROM `favorite cocktail` 
            WHERE `ID of Cocktail` = 'C300' AND `ID of Account` = 'I100'
            """
            cursor.execute(sql_check_like)
            existing_like = cursor.fetchone()
    
            if existing_like:
                # 如果已存在点赞记录，则删除该记录
                sql_delete_like = """
                DELETE FROM `favorite cocktail` 
                WHERE `ID of Cocktail` = 'C300' AND `ID of Account` = 'I100'
                """
                cursor.execute(sql_delete_like)
                conn.commit()
                message = "取消点赞"
            else:
                # 如果不存在点赞记录，则新增点赞记录
                sql_insert_like = """
                INSERT INTO `favorite cocktail` (`ID of Cocktail`, `ID of Account`) 
                VALUES ('C300', 'I100')
                """
                cursor.execute(sql_insert_like)
                conn.commit()
                message = "点赞成功"
    
            return jsonify({'success': True, 'message': message})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)})
        finally:
            cursor.close()
    
    @app.route('/')
    def index():
        return render_template('index.html')
    
    if __name__ == '__main__':
        app.run(debug=True)
