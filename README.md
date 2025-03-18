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
1. **User-SDk**:
- it is any PyQt(python) application, that runs in background when user takes online assessment, SDK basically logs user keystroke and mouse movements.
- And monitor the apps opened in background. This all takes less than 0.2-0.3% CPU usage (smooth flow on low end PC's too).
-  It is connected with pre-trained Anamoly Model (Isolation Forest) which calculates Risk-Score every 10-sec. And this can be shipped via .exe file easily.
![Screenshot 2025-03-18 124148](https://github.com/user-attachments/assets/7c36293b-4cca-4639-adf9-9122b47f9416)

2. **Anomaly-Model (Isolation-Forest)**:
- it is an pre-trained model, that is trained on "normal_behaviour.csv" by a back logging python application, then this csv is used to generate "anomaly.json" which contains the anomaly scores of abnormal/malpractice.
- Then the user logs from SDK is compared with this json file and dynamic Risk-Scores are updated every 10-sec.
![Screenshot 2025-03-18 125053](https://github.com/user-attachments/assets/09d67a18-3cb8-4400-b47f-d7e4d97c0f95)
![image](https://github.com/user-attachments/assets/3c1b7eae-82be-4c9a-ae82-3aba88742ac5)

3. **User-Panel**:
- User-Panel is a simple frontend for user to use that ensures that user knows his/her live risk-Score (same what admin see) and warning pop-up when the admin sends.
- user panel runs as soon as SDk opens and updates every 10-sec. It is conncted to mongo-DB database from which Risk-Score is updated.
![Screenshot 2025-03-05 220005](https://github.com/user-attachments/assets/5885ac76-2458-4c21-a6f8-eefa50341902)
![image](https://github.com/user-attachments/assets/ab5e1dfd-62b6-4301-a814-4f922d726f15)



3. **Exam-Panel**:
- A exam-page that is divied into coding-type, subjective-type and objective-type
- Each type of exam has unique isolation anomaly-score json data, for eg; coding-type allows erattic keyboard movement (coding uses more symbols), where as objective allow more mouse movement but keep heavy tab on keyboard.
![Screenshot 2025-03-18 161249](https://github.com/user-attachments/assets/6e4405be-2a79-4d80-8246-ae0f5eb062d7)

4. **Admin-Panel**
- A dynamic-website, that is refreshed every 10-sec according to latest Risk Scores of the user, it displays Username, Risk-Score, Mouse & Keyboard Risk-Score, Latest used app, and Current system condition.
- It allows admin to select a user and send warning message, ban or un-ban them on insaant. This log is also stored in mongo DB so for further reference if ever decision is challenged.
- Also there is graphical representaion of the the risk score for admin to easily see through multiple users.
![image](https://github.com/user-attachments/assets/71cafb07-fd23-4db8-9fb8-0e2c76fca5db)
![image](https://github.com/user-attachments/assets/5b6aea89-8418-4f32-99f4-55bf22310e2e)
![image](https://github.com/user-attachments/assets/4200fbc0-dd76-40c0-bb8d-987ea1f2b586)



## Tech Stack
1. **Machine Learning**: isolation forest
2. **Backend**: 
- express JS for server setup
- Flask-python for device fingerprint
- PyQt for user-SDK, monitoring app
- stream.io for easier web-socket connection 
3. **Frontend**: 
- React for user and admin panel
- HTML-JS for exam portal
4. Database: MongoDB

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
    cd path/to/Exam-Secure
    ```
3. Navigate to admin-panel:
    ```bash
    cd path/to/Exam-Secure/admin-panel
    ```
4. Run the application (after downloading dependencies via npm install):
    ```bash
    npm start
    ```
5. Navigate to user-panel:
    ```bash
    cd path/to/Exam-Secure/user-panel
    ```
6. Run the application (after downloading dependencies via npm install):
    ```bash
    npm start
    ```
7. Run the user-SDK application by navigation to user-sdk:
    ```bash
    cd path/to/Exam-Secure/user-sdk
    python main.py
    ```



### Clone Repository
```bash
git clone https://github.com/Raged-Pineapple/krishaka-kavacham.git
cd krishaka-kavacham
