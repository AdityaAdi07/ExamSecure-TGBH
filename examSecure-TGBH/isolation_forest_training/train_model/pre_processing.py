import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import OneHotEncoder
import json

# Load data
df = pd.read_csv(r'C:\RVCE(2023-27)\4th sem\TGBH\user-sdk\tests\train_model\behavior_data.csv')

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

# Generate anomaly scores
def generate_scores(key_model, mouse_model, encoder):
    results = []
    
    for _, row in df.iterrows():
        entry = {
            "timestamp": row['timestamp'],
            "event_type": row['event_type'],
            "anomaly_score": None
        }
        
        if row['event_type'] == 'keyboard':
            # Keyboard scoring (0-1)
            features, _ = preprocess_keyboard(pd.DataFrame([row]), encoder)
            score = key_model.decision_function(features)[0]
            entry['key'] = row['key']
            entry['anomaly_score'] = (score + 0.5)  # Scale to 0-1
            
        elif row['event_type'] == 'mouse':
            # Mouse scoring (-1-0)
            features = preprocess_mouse(pd.DataFrame([row]))
            score = mouse_model.decision_function(features)[0]
            entry['x'] = row['x']
            entry['y'] = row['y']
            entry['anomaly_score'] = -abs(score)  # Scale to -1-0
            
        results.append(entry)
    
    return results

# Main execution
if __name__ == "__main__":
    key_model, mouse_model, encoder = train_models()
    anomaly_scores = generate_scores(key_model, mouse_model, encoder)
    
    # Save to JSON
    with open('anomaly_scores.json', 'w') as f:
        json.dump(anomaly_scores, f, indent=2)