import pymysql

def count_comment_function():
    def count_comment():
        # 连接到数据库
        conn = pymysql.connect(
            host='127.0.0.1',
            user='root',
            password='12345678',
            database='alcohol',
        )
        cursor = conn.cursor()
    
        try:
            # 查询每个 ID of Cocktail 出现的次数
            sql = """
            SELECT `ID of Cocktail`, COUNT(*) as like_count
            FROM `favorite cocktail`
            GROUP BY `ID of Cocktail`
            """
            cursor.execute(sql)
            results = cursor.fetchall()
    
            likes_data = {row[0]: row[1] for row in results}
    
            return likes_data
        except Exception as e:
            print(f"Error: {str(e)}")
            return {}
        finally:
            cursor.close()
            conn.close()
    
    # 测试函数
    if __name__ == '__main__':
        likes_data = count_comment()
        for cocktail_id, count in likes_data.items():
            print(f"Cocktail ID: {cocktail_id}, Likes: {count}")
