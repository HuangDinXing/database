# -*- coding: utf-8 -*-
"""
Created on Wed Nov 13 15:59:43 2024

@author: LiFish
"""

from flask import Flask

app = Flask(__name__,static_folder='frontend/build',static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file("index.html")
@app.route('/restaurant')
def index():
    return "hello"

if __name__ == "__main__":
    app.run("0.0.0.0",port=5000)
