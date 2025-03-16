// Main navigation function
function redirectToExam(examType) {
    localStorage.setItem('currentExamType', examType);
    window.location.href = `${examType}.html`;
}
let socket;
// let hasBeenRedirected = false;
// MCQ exam data
const mcqQuestions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
        ],
        answer: 0
    },
    {
        question: "Which of the following is a JavaScript framework?",
        options: [
            "Django",
            "Flask",
            "React",
            "Laravel"
        ],
        answer: 2
    },
    {
        question: "Which CSS property is used to control the spacing between elements?",
        options: [
            "space",
            "margin",
            "indent",
            "padding"
        ],
        answer: 1
    },
    {
        question: "Which HTTP method is used to update data on a server?",
        options: [
            "GET",
            "POST",
            "PUT",
            "DELETE"
        ],
        answer: 2
    },
    {
        question: "What is the correct syntax for referring to an external script called 'script.js'?",
        options: [
            "<script href='script.js'>",
            "<script name='script.js'>",
            "<script src='script.js'>",
            "<script file='script.js'>"
        ],
        answer: 2
    },
    {
        question: "Which property is used to change the font of an element?",
        options: [
            "font-style",
            "font-weight",
            "font-family",
            "font-size"
        ],
        answer: 2
    },
    {
        question: "Which event occurs when the user clicks on an HTML element?",
        options: [
            "onmouseover",
            "onchange",
            "onclick",
            "onmouseclick"
        ],
        answer: 2
    },
    {
        question: "What is the correct way to write a JavaScript array?",
        options: [
            "var colors = 'red', 'green', 'blue'",
            "var colors = ['red', 'green', 'blue']",
            "var colors = (1:'red', 2:'green', 3:'blue')",
            "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"
        ],
        answer: 1
    },
    {
        question: "Which CSS property controls the text size?",
        options: [
            "text-style",
            "font-size",
            "text-size",
            "font-style"
        ],
        answer: 1
    },
    {
        question: "What does API stand for?",
        options: [
            "Application Programming Interface",
            "Application Process Integration",
            "Automated Programming Interface",
            "Application Protocol Interface"
        ],
        answer: 0
    }
];

// Subjective exam data
const subjectiveQuestions = [
    {
        question: "Explain the concept of responsive web design and its importance."
    },
    {
        question: "Describe the difference between synchronous and asynchronous programming in JavaScript."
    },
    {
        question: "Explain the box model in CSS and how it affects layout."
    },
    {
        question: "What are closures in JavaScript and how are they useful?"
    },
    {
        question: "Describe the difference between == and === operators in JavaScript."
    },
    {
        question: "Explain how event bubbling works in DOM manipulation."
    },
    {
        question: "What is REST architecture and why is it important for web development?"
    },
    {
        question: "Explain the concept of CSS specificity and how it affects styling."
    },
    {
        question: "Describe how local storage and session storage work in web browsers."
    },
    {
        question: "What are promises in JavaScript and how do they help manage asynchronous operations?"
    }
];

// Coding exam data
const codingQuestions = [
    {
        question: "Write a function to find the maximum sum subarray of a given array.",
        starterCode: "function maxSubArraySum(arr) {\n  // Your code here\n\n}"
    },
    {
        question: "Implement a function to check if a string is a palindrome.",
        starterCode: "function isPalindrome(str) {\n  // Your code here\n\n}"
    },
    {
        question: "Write a function to reverse a linked list.",
        starterCode: "function reverseLinkedList(head) {\n  // Your code here\n\n}"
    },
    {
        question: "Create a function to find all pairs in an array that sum up to a given target.",
        starterCode: "function findPairs(arr, target) {\n  // Your code here\n\n}"
    },
    {
        question: "Implement a binary search algorithm.",
        starterCode: "function binarySearch(arr, target) {\n  // Your code here\n\n}"
    },
    {
        question: "Write a function to check if a binary tree is balanced.",
        starterCode: "function isBalanced(root) {\n  // Your code here\n\n}"
    },
    {
        question: "Implement a function to find the longest common subsequence of two strings.",
        starterCode: "function longestCommonSubsequence(str1, str2) {\n  // Your code here\n\n}"
    },
    {
        question: "Create a function to implement a queue using two stacks.",
        starterCode: "class QueueUsingStacks {\n  constructor() {\n    // Your code here\n  }\n\n  enqueue(val) {\n    // Your code here\n  }\n\n  dequeue() {\n    // Your code here\n  }\n}"
    },
    {
        question: "Write a function to find the kth smallest element in a binary search tree.",
        starterCode: "function kthSmallest(root, k) {\n  // Your code here\n\n}"
    },
    {
        question: "Implement a function to detect a cycle in a linked list.",
        starterCode: "function hasCycle(head) {\n  // Your code here\n\n}"
    }
];

// Initialization for MCQ exam page
///////////////////////////////////////////////////////////////
// script.js
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
// script.js - Consolidated and Clean Version
///////////////////////////////////////////////////////////////

////////////////////////////
// Full-Screen Functions  //
////////////////////////////

///////////////////////////////////////////////////////////////
// script.js
///////////////////////////////////////////////////////////////

// ===================== Fullscreen + Tab Detection ====================
document.addEventListener("DOMContentLoaded", () => {
    // Check if we just redirected due to a ban
    if (sessionStorage.getItem('redirectedFromBan') === 'true') {
        console.log("Page loaded after ban redirect - not reconnecting Socket.IO");
       // Clear the flag
        return; // Skip Socket.IO connection
    }
    
    // Connect to Socket.IO
    socket = io("http://localhost:5000");
    
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("❌ No userId found!");
        return;
    }
    
    // Join with user ID
    socket.emit("join", { userId });
    
    // Handle ban event
    socket.on("banUser", () => {
        console.log("🚫 Ban event received!");
        console.log("Current URL:", window.location.href);
        console.log("Redirecting to mains.html");
        
        if (document.fullscreenElement) {
            console.log("Exiting fullscreen mode");
            exitFullScreen();
        }
        
        // Set a flag to prevent reconnection loops
        sessionStorage.setItem('redirectedFromBan', 'true');
        
        // Use absolute path for redirection
        window.location.href = "/mains.html";
    });
    
    // Handle warning event
    socket.on("warnUser", () => {
        console.log("⚠️ Warning event received!");
        alert("⚠️ Warning: Risk score is high!");
    });
});

function enterFullScreen() {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
  }
  
  // Add this to your script.js for testing
window.triggerBan = function() {
    if (socket && socket.connected) {
        console.log("Manually triggering ban event");
        socket.emit("triggerBan"); // Add this handler on server
        // Or directly call the handler
        alert("🚨 You have been banned! Redirecting...");
        if (document.fullscreenElement) {
            exitFullScreen();
        }
        window.location.href = "mains.html";
        return "Ban event triggered";
    } else {
        return "Socket not connected!";
    }
};
  function exitFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  
  // If user exits fullscreen OR page is hidden => force end exam
  function handleFullScreenOrTabChange() {
    if (!document.fullscreenElement || document.hidden) {
      alert("You have exited full screen or switched tabs. The exam is now over.");
      exitFullScreen();
      window.location.href = "mains.html";
    }
  }
  
  // ===================== Main Navigation ====================
  
  function redirectToExam(examType) {
    localStorage.setItem('currentExamType', examType);
    window.location.href = `${examType}.html`; // e.g. mcq.html, coding.html, etc.
  }
  
  // If user manually ends exam
  function submitExam() {
    exitFullScreen();
    window.location.href = 'submitted.html';
  }
  
  // =========== MCQ / Subjective / Coding Data & Functions ==========
  // (Your question arrays go here: mcqQuestions, subjectiveQuestions, codingQuestions)
  
  // *** MCQ Example ***
  function initMCQExam() {
    // Force full screen + detect tab switch
    enterFullScreen();
    document.addEventListener('fullscreenchange', handleFullScreenOrTabChange);
    document.addEventListener('visibilitychange', handleFullScreenOrTabChange);
  
    let currentQuestion = 0;
    const answers = new Array(mcqQuestions.length).fill(-1);
  
    function loadQuestion(index) {
      const questionElement = document.getElementById('question-text');
      const optionsContainer = document.getElementById('options-container');
      const questionCountElement = document.getElementById('question-count');
  
      questionElement.textContent = mcqQuestions[index].question;
      questionCountElement.textContent = `Question ${index+1} of ${mcqQuestions.length}`;
      
      optionsContainer.innerHTML = '';
      
      mcqQuestions[index].options.forEach((option, i) => {
        const optDiv = document.createElement('div');
        optDiv.className = `option ${answers[index] === i ? 'selected' : ''}`;
        optDiv.textContent = option;
        optDiv.onclick = () => {
          document.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
          optDiv.classList.add('selected');
          answers[index] = i;
        };
        optionsContainer.appendChild(optDiv);
      });
  
      document.getElementById('prev-btn').disabled = (index === 0);
  
      if (index === mcqQuestions.length - 1) {
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'block';
      } else {
        document.getElementById('next-btn').style.display = 'block';
        document.getElementById('submit-btn').style.display = 'none';
      }
    }
  
    document.getElementById('prev-btn').addEventListener('click', () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion(currentQuestion);
      }
    });
  
    document.getElementById('next-btn').addEventListener('click', () => {
      if (currentQuestion < mcqQuestions.length - 1) {
        currentQuestion++;
        loadQuestion(currentQuestion);
      }
    });
  
    document.getElementById('submit-btn').addEventListener('click', () => {
      localStorage.setItem('mcqAnswers', JSON.stringify(answers));
      exitFullScreen();
      window.location.href = 'submitted.html';
    });
  
    // Timer (30 min)
    let timeLeft = 30 * 60;
    const timerElement = document.getElementById('timer');
    const timerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerElement.textContent = `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
  
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("Time is up! Submitting your answers...");
        exitFullScreen();
        localStorage.setItem('mcqAnswers', JSON.stringify(answers));
        window.location.href = 'submitted.html';
      }
      timeLeft--;
    }, 1000);
  
    // Load the first question
    loadQuestion(currentQuestion);
  }
  
  // *** Subjective Example ***
  function initSubjectiveExam() {
    enterFullScreen();
    document.addEventListener('fullscreenchange', handleFullScreenOrTabChange);
    document.addEventListener('visibilitychange', handleFullScreenOrTabChange);
  
    let currentQuestion = 0;
    const answers = new Array(subjectiveQuestions.length).fill('');
  
    function loadQuestion(index) {
      const questionElement = document.getElementById('question-text');
      const answerTextarea = document.getElementById('answer-textarea');
      const questionCountElement = document.getElementById('question-count');
  
      questionElement.textContent = subjectiveQuestions[index].question;
      questionCountElement.textContent = `Question ${index+1} of ${subjectiveQuestions.length}`;
      answerTextarea.value = answers[index];
  
      document.getElementById('prev-btn').disabled = (index === 0);
  
      if (index === subjectiveQuestions.length - 1) {
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'block';
      } else {
        document.getElementById('next-btn').style.display = 'block';
        document.getElementById('submit-btn').style.display = 'none';
      }
    }
  
    function saveCurrentAnswer() {
      const answerTextarea = document.getElementById('answer-textarea');
      answers[currentQuestion] = answerTextarea.value;
    }
  
    document.getElementById('prev-btn').addEventListener('click', () => {
      if (currentQuestion > 0) {
        saveCurrentAnswer();
        currentQuestion--;
        loadQuestion(currentQuestion);
      }
    });
  
    document.getElementById('next-btn').addEventListener('click', () => {
      if (currentQuestion < subjectiveQuestions.length - 1) {
        saveCurrentAnswer();
        currentQuestion++;
        loadQuestion(currentQuestion);
      }
    });
  
    document.getElementById('submit-btn').addEventListener('click', () => {
      saveCurrentAnswer();
      localStorage.setItem('subjectiveAnswers', JSON.stringify(answers));
      exitFullScreen();
      window.location.href = 'submitted.html';
    });
  
    // Timer (60 min)
    let timeLeft = 60 * 60;
    const timerElement = document.getElementById('timer');
    const timerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerElement.textContent = `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
  
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("Time's up! Submitting your answers...");
        saveCurrentAnswer();
        exitFullScreen();
        localStorage.setItem('subjectiveAnswers', JSON.stringify(answers));
        window.location.href = 'submitted.html';
      }
      timeLeft--;
    }, 1000);
  
    loadQuestion(currentQuestion);
  }
  
  // *** Coding Example ***
  function initCodingExam() {
    enterFullScreen();
    document.addEventListener('fullscreenchange', handleFullScreenOrTabChange);
    document.addEventListener('visibilitychange', handleFullScreenOrTabChange);
  
    let currentQuestion = 0;
    const answers = new Array(codingQuestions.length).fill('');
  
    function loadQuestion(index) {
      const questionElement = document.getElementById('question-text');
      const codeTextarea = document.getElementById('code-area');
      const questionCountElement = document.getElementById('question-count');
  
      questionElement.textContent = codingQuestions[index].question;
      questionCountElement.textContent = `Question ${index+1} of ${codingQuestions.length}`;
      
      // Load existing or starter code
      codeTextarea.value = answers[index] || codingQuestions[index].starterCode;
  
      document.getElementById('prev-btn').disabled = (index === 0);
  
      if (index === codingQuestions.length - 1) {
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'block';
      } else {
        document.getElementById('next-btn').style.display = 'block';
        document.getElementById('submit-btn').style.display = 'none';
      }
    }
  
    function saveCurrentAnswer() {
      const codeTextarea = document.getElementById('code-area');
      answers[currentQuestion] = codeTextarea.value;
    }
  
    document.getElementById('prev-btn').addEventListener('click', () => {
      if (currentQuestion > 0) {
        saveCurrentAnswer();
        currentQuestion--;
        loadQuestion(currentQuestion);
      }
    });
  
    document.getElementById('next-btn').addEventListener('click', () => {
      if (currentQuestion < codingQuestions.length - 1) {
        saveCurrentAnswer();
        currentQuestion++;
        loadQuestion(currentQuestion);
      }
    });
  
    document.getElementById('submit-btn').addEventListener('click', () => {
      saveCurrentAnswer();
      localStorage.setItem('codingAnswers', JSON.stringify(answers));
      exitFullScreen();
      window.location.href = 'submitted.html';
    });
  
    // Timer (90 min)
    let timeLeft = 90 * 60;
    const timerElement = document.getElementById('timer');
    const timerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerElement.textContent = `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
  
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("Time is up! Submitting your code...");
        saveCurrentAnswer();
        exitFullScreen();
        localStorage.setItem('codingAnswers', JSON.stringify(answers));
        window.location.href = 'submitted.html';
      }
      timeLeft--;
    }, 1000);
  
    loadQuestion(currentQuestion);
  }
  
  // ========== Page-Specific Initialization ==========
  
  document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname.toLowerCase();
  
    if (currentPath.includes('mcq.html')) {
      initMCQExam();
    } else if (currentPath.includes('subjective.html')) {
      initSubjectiveExam();
    } else if (currentPath.includes('coding.html')) {
      initCodingExam();
    }
  });
  
  // ========== Socket.IO + Ban + Monitoring ==========
  
//   document.addEventListener('DOMContentLoaded', () => {
//     // Connect to Socket.IO for ban + examType logic
//     window.socket = io("http://localhost:5000");
  
//     const userId = localStorage.getItem("userId") || "dummyBrowserUserId";
//     socket.emit("join", { userId, clientType: "browser" });
    
//     // Listen for ban
//     socket.on("banUser", data => {
//       alert("You have been banned. Redirecting to home page...");
//       stopMonitoring(() => {
//         exitFullScreen();
//         window.location.href = "mains.html";
//       });
//     });
  



    // If mains.html (previously index.html), do handshake
    if (isCurrentPage("mains.html") || window.location.pathname === "/") {
      startHandshake();
    }
    
    // If on exam, set exam type
    // if (isCurrentPage("mcq.html")) {
    //   socket.emit("setExamType", { examType: "mcq" });
    // } else if (isCurrentPage("subjective.html")) {
    //   socket.emit("setExamType", { examType: "subjective" });
    // } else if (isCurrentPage("coding.html")) {
    //   socket.emit("setExamType", { examType: "coding" });
    // }
    
    // If submitted, auto-redirect home after 3s
    if (isCurrentPage("submitted.html")) {
      let countdown = 3;
      const cdEl = document.getElementById("countdown");
      const timer = setInterval(() => {
        countdown--;
        if (cdEl) cdEl.textContent = countdown;
        if (countdown <= 0) {
          clearInterval(timer);
          window.location.href = "mains.html";
        }
      }, 1000);
  
      stopMonitoring();
    }
  
  
  // Helper to detect page
  function isCurrentPage(filename) {
    return window.location.pathname.toLowerCase().endsWith(filename);
  }
  
  // Handshake
  function startHandshake() {
    fetch("http://localhost:4567/handshake", { mode: "cors" })
      .then(res => res.json())
      .then(data => {
        if (data.handshake === "ok") {
          console.log("✅ Handshake successful! Monitoring started.");
        } else {
          console.log("❌ Handshake failed or app not running.");
        }
      })
      .catch(err => {
        console.error("Handshake error:", err);
      });
  }
  
  // Stop monitoring (calls the Python endpoint)
  function stopMonitoring(cb) {
    fetch("http://localhost:4567/stopMonitoring")
      .then(() => {
        console.log("✅ Monitoring stopped (Python side).");
        if (cb) cb();
      })
      .catch(err => {
        console.error("Error stopping monitoring:", err);
        if (cb) cb();
      });
  }
  