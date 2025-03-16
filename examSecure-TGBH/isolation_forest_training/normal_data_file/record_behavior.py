import time
import csv
import keyboard
import mouse
from threading import Thread, Event

# Global variables
is_recording = Event()
data = []

# Function to record mouse movements
def record_mouse():
    while is_recording.is_set():
        x, y = mouse.get_position()
        data.append({
            "timestamp": time.time(),
            "event_type": "mouse",
            "x": x,
            "y": y
        })
        time.sleep(0.1)  # Record every 100ms

# Function to record keyboard events
def record_keyboard():
    def on_key_event(e):
        if is_recording.is_set():
            data.append({
                "timestamp": time.time(),
                "event_type": "keyboard",
                "key": e.name,
                "event": e.event_type  # 'down' or 'up'
            })

    keyboard.hook(on_key_event)
    while is_recording.is_set():
        time.sleep(0.1)  # Keep the hook active

# Function to save data to CSV
def save_to_csv(filename="behavior_data.csv"):
    # Define CSV fields based on event type
    fields = ["timestamp", "event_type", "x", "y", "key", "event"]
    
    with open(filename, mode="w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fields)
        writer.writeheader()
        
        # Write rows, ensuring all fields are present
        for row in data:
            # Add missing fields for mouse events
            if row["event_type"] == "mouse":
                row["key"] = ""
                row["event"] = ""
            # Add missing fields for keyboard events
            elif row["event_type"] == "keyboard":
                row["x"] = ""
                row["y"] = ""
            
            writer.writerow(row)
    
    print(f"Data saved to {filename}")

# Main function
def main():
    global is_recording, data

    print("Type 'start' to begin recording and 'end' to stop.")

    while True:
        command = input("> ").strip().lower()

        if command == "start":
            if not is_recording.is_set():
                is_recording.set()
                data = []  # Reset data
                print("Recording started...")

                # Start mouse and keyboard recording threads
                mouse_thread = Thread(target=record_mouse)
                keyboard_thread = Thread(target=record_keyboard)

                mouse_thread.start()
                keyboard_thread.start()

        elif command == "end":
            if is_recording.is_set():
                is_recording.clear()
                print("Recording stopped.")
                save_to_csv()
                break

        else:
            print("Invalid command. Type 'start' to begin or 'end' to stop.")

if __name__ == "__main__":
    main()