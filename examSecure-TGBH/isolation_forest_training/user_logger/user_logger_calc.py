import json
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import OneHotEncoder

# Preprocessing functions
def preprocess_keyboard(df_key, encoder=None, fit=False):
    if encoder is None:
        encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    if fit:
        encoded = encoder.fit_transform(df_key[['key', 'event']])
    else:
        encoded = encoder.transform(df_key[['key', 'event']])
    return encoded, encoder

def preprocess_mouse(df_mouse):
    return df_mouse[['x', 'y']].values

# Train models
def train_models():
    # Keyboard model
    keyboard_data = df[df['event_type'] == 'keyboard']
    X_keyboard, encoder = preprocess_keyboard(keyboard_data, fit=True)
    key_model = IsolationForest(contamination=0.1, random_state=42)
    key_model.fit(X_keyboard)
    
    # Mouse model
    mouse_data = df[df['event_type'] == 'mouse']
    X_mouse = preprocess_mouse(mouse_data)
    mouse_model = IsolationForest(contamination=0.1, random_state=42)
    mouse_model.fit(X_mouse)
    
    return key_model, mouse_model, encoder

# Load precomputed anomaly scores
def load_anomaly_scores(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

# Load user logger data
def load_user_logger(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

# Preprocess user logger data
def preprocess_user_data(user_data, encoder):
    keyboard_data = [event for event in user_data if event['event_type'] == 'keyboard']
    mouse_data = [event for event in user_data if event['event_type'] == 'mouse']
    
    # Preprocess keyboard data
    if keyboard_data:
        keyboard_df = pd.DataFrame(keyboard_data)
        keyboard_features, _ = preprocess_keyboard(keyboard_df, encoder)
    else:
        keyboard_features = np.array([])
    
    # Preprocess mouse data
    if mouse_data:
        mouse_df = pd.DataFrame(mouse_data)
        mouse_features = preprocess_mouse(mouse_df)
    else:
        mouse_features = np.array([])
    
    return keyboard_features, mouse_features, keyboard_data, mouse_data

# Calculate anomaly scores for user data
def calculate_user_anomaly_scores(key_model, mouse_model, keyboard_features, mouse_features):
    user_scores = []
    
    if keyboard_features.size > 0:
        key_scores = key_model.decision_function(keyboard_features)
        key_scores = (key_scores + 0.5)  # Scale to 0-1
        user_scores.extend(key_scores.tolist())
    
    if mouse_features.size > 0:
        mouse_scores = mouse_model.decision_function(mouse_features)
        mouse_scores = -abs(mouse_scores)  # Scale to -1-0
        user_scores.extend(mouse_scores.tolist())
    
    return user_scores

# Compare user scores with baseline
def compare_scores(user_scores, baseline_scores):
    user_mean = np.mean(user_scores)
    baseline_mean = np.mean([score['anomaly_score'] for score in baseline_scores])
    
    # Calculate deviation
    deviation = user_mean - baseline_mean
    return deviation

# Main function
def main(user_logger_path, anomaly_scores_path):
    # Load precomputed anomaly scores
    baseline_scores = load_anomaly_scores(anomaly_scores_path)
    
    # Load user logger data
    user_data = load_user_logger(user_logger_path)
    
    # Preprocess user data
    keyboard_features, mouse_features, keyboard_data, mouse_data = preprocess_user_data(user_data, encoder)
    
    # Calculate anomaly scores for user data
    user_scores = calculate_user_anomaly_scores(key_model, mouse_model, keyboard_features, mouse_features)
    
    # Compare with baseline
    deviation = compare_scores(user_scores, baseline_scores)
    
    # Output results
    print(f"User Anomaly Scores: {user_scores}")
    print(f"Deviation from Baseline: {deviation}")
    
    if deviation > 0.1:  # Threshold for anomaly
        print("ALERT: User behavior is anomalous!")
    else:
        print("User behavior is normal.")

# Load data
df = pd.read_csv(r'C:\RVCE(2023-27)\4th sem\TGBH\user-sdk\tests\train_model\behavior_data.csv')

# Train models and get encoder
key_model, mouse_model, encoder = train_models()

# Example usage
user_logger_path = r"C:\RVCE(2023-27)\4th sem\TGBH\user-sdk\tests\user_logger\616886efee6c9ae6a763ec3ed71d8103854de9c723d48b26f0437d8cd69a1430.json"  # Path to user-provided JSON
anomaly_scores_path = r"C:\RVCE(2023-27)\4th sem\TGBH\user-sdk\tests\user_logger\anomaly_scores.json"  # Path to precomputed anomaly scores
main(user_logger_path, anomaly_scores_path)