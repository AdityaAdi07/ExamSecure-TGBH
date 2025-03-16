import time
import keyboard
import mouse
import joblib
import numpy as np
import pandas as pd
import psutil
import pygetwindow as gw
from collections import deque
import win32gui
import win32process
from all import alls
from all import ex
iso_forest_mouse = joblib.load("final_isolation_forest_mouse.pkl")
iso_forest_keyboard = joblib.load("final_isolation_forest_keyboard.pkl")

mouse_features = ["mouse_speed", "mouse_jitter", "click_frequency"]
keyboard_features = ["typing_speed", "pause_duration"]


mouse_positions = []
keypress_count = 0
last_keystroke_time = None
start_time = time.time()
typing_speed_window = deque(maxlen=6)




excluded_windows = ["settings", "program manager", "nahimic"]


def on_mouse_move(event):
    if isinstance(event, mouse.MoveEvent):
        mouse_positions.append((event.x, event.y))


def on_key_event(event):
    global keypress_count, last_keystroke_time
    if event.event_type == "down":
        keypress_count += 1
        last_keystroke_time = time.time()

# Register event listeners
keyboard.on_press(on_key_event)
mouse.hook(on_mouse_move)

def calculate_mouse_metrics():
    global mouse_positions
    if len(mouse_positions) < 2:
        return 0, 0
    distances = [
        ((mouse_positions[i][0] - mouse_positions[i - 1][0]) ** 2 +
         (mouse_positions[i][1] - mouse_positions[i - 1][1]) ** 2) ** 0.5
        for i in range(1, len(mouse_positions))
    ]
    mouse_speed = np.mean(distances) if distances else 0
    mouse_jitter = np.std(distances) if distances else 0
    mouse_positions = []
    return mouse_speed, mouse_jitter

def filter_excluded_windows(windows):
    return [w for w in windows if not any(excluded in w for excluded in ex)]
def normalize_score(anomaly_score):
    scaled = (anomaly_score + 2.0) / 4.0
    risk = (scaled ** 3.0) * 50
    return max(0, min(risk, 100))

def is_valid_window(hwnd):
    if not win32gui.IsWindowVisible(hwnd):
        return False
    rect = win32gui.GetWindowRect(hwnd)
    width, height = rect[2] - rect[0], rect[3] - rect[1]
    if width < 100 or height < 50:
        return False
    _, pid = win32process.GetWindowThreadProcessId(hwnd)
    try:
        process = psutil.Process(pid)
        if process.username() == "SYSTEM" or process.status() in ["stopped", "zombie"]:
            return False
        return True
    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
        return False

def get_visible_windows():
    visible_windows = []
    def enum_handler(hwnd, _):
        if is_valid_window(hwnd):
            window_title = win32gui.GetWindowText(hwnd).strip().lower()
            if window_title:
                visible_windows.append(window_title)
    win32gui.EnumWindows(enum_handler, None)
    return filter_excluded_windows(visible_windows)


def compute_window_risk():
    visible_windows = get_visible_windows()
    unnecessary_windows = [w for w in visible_windows if not any(allowed in w for allowed in alls)]
    print(unnecessary_windows)
    if len(unnecessary_windows) == 1:
        return 40
    elif len(unnecessary_windows) >= 2:
        return 70
    return 0


def real_time_monitoring_with_windows():
    global keypress_count, last_keystroke_time, start_time, typing_speed_window
    print("\n📌 Monitoring Started - Press Ctrl + C to stop.\n")
    try:
        while True:
            elapsed_time = time.time() - start_time
            mouse_speed, mouse_jitter = calculate_mouse_metrics()
            click_frequency = min(10, len(mouse_positions))
            typing_speed = (keypress_count / elapsed_time) * 60 if elapsed_time >= 60 else 0
            typing_speed_window.append(typing_speed)
            avg_typing_speed = np.mean(typing_speed_window) if typing_speed_window else 0
            pause_duration = time.time() - last_keystroke_time if last_keystroke_time else 0

            mouse_data = pd.DataFrame([[mouse_speed, mouse_jitter, click_frequency]], columns=mouse_features)
            keyboard_data = pd.DataFrame([[avg_typing_speed, pause_duration]], columns=keyboard_features)

            risk_score_mouse = normalize_score(iso_forest_mouse.decision_function(mouse_data)[0])
            risk_score_keyboard = normalize_score(iso_forest_keyboard.decision_function(keyboard_data)[0])
            risk_score_app = compute_window_risk()

            if mouse_speed > 10.0:
                risk_score_mouse *= 1.7
            if avg_typing_speed > 150:
                risk_score_keyboard *= 2.0

            final_risk_score = (risk_score_mouse ** 1.5) * 0.5 + (risk_score_keyboard ** 1.6) * 0.6 + risk_score_app

            print(f"🚨 Mouse Risk: {risk_score_mouse:.2f}%, Keyboard Risk: {risk_score_keyboard:.2f}%, App Risk: {risk_score_app}%")
            print(f"🔥 Final Risk Score: {final_risk_score:.2f}%\n")
            time.sleep(10)
    except KeyboardInterrupt:
        print("\n⏹ Monitoring stopped by user.\n")


real_time_monitoring_with_windows()



