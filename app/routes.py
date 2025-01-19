from flask import Blueprint, jsonify
from app.utils.system_info import get_system_info

main = Blueprint('main', __name__)

@main.route('/api/system_info', methods=['GET'])
def system_info():
    data = get_system_info()
    return jsonify(data)
