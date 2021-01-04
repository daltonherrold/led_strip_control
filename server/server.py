from flask import Flask, jsonify, request
from flask_cors import CORS
from threading import Thread
from led_strip import LedStrip

app = Flask(__name__)
CORS(app)
strip = None
thread = None
settings = None


@app.route('/get_lights', methods=['GET'])
def get_lights():
    return jsonify(settings)


@app.route('/change_lights', methods=['POST'])
def change_lights():
    global strip
    global thread
    global settings

    content = request.get_json()

    if 'style' in content and 'kwargs' in content:
        style = content.get('style')
        kwargs = content.get('kwargs')
        fn = getattr(strip, style, None)
        if fn is not None:
            strip.kill_thread()
            thread.join()
            thread = Thread(target = fn, kwargs = kwargs)
            thread.start()
            settings = {"style": style, "kwargs": kwargs}
            return settings
        else:
            return "fn doesn't exist"
    else:
        return "Malformed Request"


if __name__ == '__main__':
    strip = LedStrip(18, 158, 255)
    kwargs = {
        'red': 255,
        'blue': 20,
        'green': 30,
        'brightness': 1,
        'speed': 30,
        'reverse': False,
        'animation': 'instant',
        'animation_speed': 10,
        'step': 1,
    }
    thread = Thread(target = strip.staticColor, kwargs = kwargs)
    settings = {"style": "staticColor", "kwargs": kwargs}
    thread.start()
    app.run(host='0.0.0.0')
    strip.clear()
