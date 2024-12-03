from flask import Flask, request, jsonify
import pymysql
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许所有来源的跨域请求

class MySQLDatabase:
    def __init__(self, host, user, password, database):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None

    def connect(self):
        self.connection = pymysql.connect(host=self.host,
                                          user=self.user,
                                          password=self.password,
                                          database=self.database,
                                          charset='utf8mb4',
                                          cursorclass=pymysql.cursors.DictCursor,
                                          autocommit=True)

    def disconnect(self):
        if self.connection:
            self.connection.close()

    def execute_update(self, query, params=None):
        if not self.connection:
            self.connect()
        with self.connection.cursor() as cursor:
            cursor.execute(query, params)
            self.connection.commit()

# 配置数据库连接
db = MySQLDatabase(host='127.0.0.1', user='root', password='12345678', database='kungfupanda')

@app.route('/submit', methods=['POST'])
def submit_data1():
    try:
        data = request.json
        # 检查必要字段
        required_fields = [ 'deliveryManFirstName', 'deliveryManLastName', 'deliveryManPhoneNumber', 'deliveryManMail', 'deliveryManIDCard', 'cityID','18years','transportation']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400
        
        # 插入数据到数据库
        query = """
            INSERT INTO deliveryman 
            (deliveryManFirstName, deliveryManLastName, deliveryManPhoneNumber, 
             deliveryManMail, deliveryManIDCard, cityID, 18years, transportation) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            data['deliveryManFirstName'], 
            data['deliveryManLastName'], 
            data['deliveryManPhoneNumber'], 
            data['deliveryManMail'], 
            data['deliveryManIDCard'], 
            data['cityID'], 
            data['18years'], 
            data['transportation'], 

        )
        db.execute_update(query, params)
        return jsonify({'message': '資料提交成功！'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/submit2', methods=['POST'])
def submit_data2():
    try:
        data2 = request.json
        # 检查必要字段
        required_fields = [ 'managerFirstName', 'managerLastName', 'managerMail', 'storetype', 'managerPhoneNumber']
        missing_fields = [field for field in required_fields if field not in data2 or not data2[field]]
        if missing_fields:
            return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400
        
        # 插入数据到数据库
        query = """
            INSERT INTO storemanager 
            (managerFirstName, managerLastName, managerMail, 
             storetype, managerPhoneNumber) 
            VALUES (%s, %s, %s, %s, %s)
        """
        params = (
            data2['managerFirstName'], 
            data2['managerLastName'], 
            data2['managerMail'], 
            data2['storetype'], 
            data2['managerPhoneNumber'], 
        )
        db.execute_update(query, params)
        return jsonify({'message': '資料提交成功！'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False)
