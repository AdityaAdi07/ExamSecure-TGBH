import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split


normal_dataset_path = "high_quality_normal_behavior.csv"
cheating_dataset_path = "cheating_behavior_dataset.csv"

df_normal = pd.read_csv(normal_dataset_path)
df_cheating = pd.read_csv(cheating_dataset_path)

X_train = df_normal.drop(columns=["label"], errors="ignore")


X_test = df_cheating.drop(columns=["label"], errors="ignore")


iso_forest_mouse = IsolationForest(contamination=0.2, random_state=42)
iso_forest_mouse.fit(X_train[["mouse_speed", "mouse_jitter", "click_frequency"]])

iso_forest_keyboard = IsolationForest(contamination=0.2, random_state=42)
iso_forest_keyboard.fit(X_train[["typing_speed", "pause_duration"]])


joblib.dump(iso_forest_mouse, "final_isolation_forest_mouse.pkl")
joblib.dump(iso_forest_keyboard, "final_isolation_forest_keyboard.pkl")

print("✅ Model trained")
