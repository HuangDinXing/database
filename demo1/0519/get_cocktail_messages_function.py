import pymysql
def get_cocktail_messages_function():
    def get_cocktail_messages(db_config):
        """
        获取每个调酒的留言。
    
        参数:
        db_config (dict): 数据库配置，包括host, user, password, database。
    
        返回:
        dict: 每个调酒的ID和对应的留言列表。
        """
        conn = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            database=db_config['database'],
        )
        cursor = conn.cursor()
    
        try:
            sql = """
            SELECT `ID of Cocktail`, `Message`
            FROM `cocktail of message`
            """
            cursor.execute(sql)
            results = cursor.fetchall()
    
            messages_data = {}
            for row in results:
                cocktail_id = row[0]
                message = row[1]
                if cocktail_id not in messages_data:
                    messages_data[cocktail_id] = []
                messages_data[cocktail_id].append(message)
    
            return messages_data
        except Exception as e:
            print(f"Error: {str(e)}")
            return {}
        finally:
            cursor.close()
            conn.close()
    
    # 测试函数
    if __name__ == '__main__':
        db_config = {
            'host': '127.0.0.1',
            'user': 'root',
            'password': '12345678',
            'database': 'alcohol',
        }
        messages_data = get_cocktail_messages(db_config)
        for cocktail_id, messages in messages_data.items():
            print(f"Cocktail ID: {cocktail_id}")
            for message in messages:
                print(f"Message: {message}")
            print()
