# ExamSecure- Risk-Based Proctoring System For Online Assessments

**ExamSecure** is a smart, real-time project that can detect whether user is conducting a malpractice without use of camera and mic feed i.e privacy of user is maintained. We proctore the assessment by monitoring the keystroke, mouse and background apps. We do not store any user log data or monitor what user is doing in background apps, thus maintaing the privacy. We use dynamic Risk-Score which is updated every 10-sec.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Future Scope](#future-scope)
- [License](#license)

## Features
- **User-SDk**:
  it is any PyQt(python) application, that runs in background when user takes online assessment, SDK basically logs user keystroke and mouse movements. And monitor the apps opened in background. This all takes less than 0.2-0.3% CPU usage (smooth flow on low end PC's too). It is connected with pre-trained Anamoly Model (Isolation Forest) which calculates Risk-Score every 10-sec. And this can be shipped via .exe file easily.
![Screenshot 2025-03-18 124148](https://github.com/user-attachments/assets/7c36293b-4cca-4639-adf9-9122b47f9416)

- **Anomaly-Model (Isolation-Forest)**:
  it is an pre-trained model, that is trained on "normal_behaviour.csv" by a back logging python application, then this csv is used to generate "anomaly.json" which contains the anomaly scores of abnormal/malpractice. Then the user logs from SDK is compared with this json file and dynamic Risk-Scores are updated every 10-sec.
![Screenshot 2025-03-18 125053](https://github.com/user-attachments/assets/09d67a18-3cb8-4400-b47f-d7e4d97c0f95)
![image](https://github.com/user-attachments/assets/3c1b7eae-82be-4c9a-ae82-3aba88742ac5)

- **User-Panel**:
  User-Panel is a simple frontend for user to use that ensures that user knows his/her live risk-Score (same what admin see) and warning pop-up when the admin sends. user panel runs as soon as SDk opens and updates every 10-sec. It is conncted to mongo-DB database from which Risk-Score is updated.
![Screenshot 2025-03-05 220005](https://github.com/user-attachments/assets/5885ac76-2458-4c21-a6f8-eefa50341902)


## Tech Stack
- **Machine Learning**: TensorFlow for CNN model implementation
- **Backend**: Flask for handling HTTP requests and serving the model
- **Frontend**: HTML, CSS, and JavaScript for a responsive web application

## Installation

### Prerequisites
- Python 3.7 or later
- `pip` (Python package manager)
## Set Up Model and Data
Ensure the trained CNN model and class indices JSON file are located in the `models/` directory. Optionally, add a `data/` directory for storing any additional images used for testing or demonstration.

## Running the Application
1. Open your terminal or command prompt.
2. Navigate to the project directory if you haven't already:
    ```bash
    cd path/to/krishaka-kavacham
    ```
3. Run the application:
    ```bash
    python app.py
    ```
4. Access the app locally at [http://127.0.0.1:5000](http://127.0.0.1:5000).
## Images

![Screenshot 2024-11-15 020500](https://github.com/user-attachments/assets/5c346b5f-8bcf-419d-82ec-fcd759375cee)


## Usage
1. Open the web app in your browser.
2. Upload an image of a plant leaf.
3. Click "Diagnose Now" to get the disease classification and severity level.

## Future Scope
- Expand the dataset to include more plant species and disease types.
- Make the app mobile-friendly and accessible to a broader audience.
- Use data augmentation techniques for improved robustness and accuracy.

## License
This project is licensed under the MIT License. See the LICENSE file for details.


### Clone Repository
```bash
git clone https://github.com/Raged-Pineapple/krishaka-kavacham.git
cd krishaka-kavacham
