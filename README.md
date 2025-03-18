# ExamSecure- Risk-Based Proctoring System For Online Assessments

**ExamSecure** is a smart, real-time project that can detect whether user is conducting a malpractice without use of camera and mic feed i.e privacy of user is maintained. We proctore the assessment by monitoring the keystroke, mouse and background apps 

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Future Scope](#future-scope)
- [License](#license)

## Features
- **Plant Disease Classification**: The model identifies diseases from 38 classes, including Apple Scab, Grape Black Rot, Corn Leaf Spot, and others.
- **Severity Estimation**: Predicts the level of disease severity, advising users if treatment is needed.
- **User-Friendly Web Interface**: A simple interface for uploading images and receiving diagnostic results in real-time.

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
