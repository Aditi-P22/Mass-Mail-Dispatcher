// Dark Mode
var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

var themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

// Scroll to top button with scroll progress
let calcScrollValue = () => {
  let scrollProgress = document.getElementById("progress");
  let progressValue = document.getElementById("progress-value");
  let pos = document.documentElement.scrollTop;
  let calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrollValue = Math.round((pos * 100) / calcHeight);
  if (pos > 100) {
    scrollProgress.style.display = "grid";
  } else {
    scrollProgress.style.display = "none";
  }
  scrollProgress.addEventListener("click", () => {
    document.documentElement.scrollTop = 0;
  });
  scrollProgress.style.background = `conic-gradient( #57A5FD ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;

// Drag and Drop file
const dragDropArea = document.querySelector(".border-dashed");

dragDropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dragDropArea.classList.add("border-blue-500");
});

dragDropArea.addEventListener("dragleave", () => {
  dragDropArea.classList.remove("border-blue-500");
});

dragDropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dragDropArea.classList.remove("border-blue-500");

  const files = e.dataTransfer.files;
  document.getElementById("csvFile").files = files; // Set selected file for input

  readCSVFile(document.getElementById("csvFile"));
});

// Function to read and process a CSV file input
function readCSVFile(input) {
  // Arrays to store valid and invalid email addresses
  var validEmails = [];
  var invalidEmails = [];

  // Read contents of CSV file
  var file = input.files[0];
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function (event) {
    var csv = event.target.result;
    var lines = csv.split("\n");
    for (var i = 0; i < lines.length; i++) {
      var email = lines[i].trim();
      var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
      if (emailRegex.test(email)) {
        validEmails.push(email);
      } else {
        invalidEmails.push(email);
      }
    }

    // Sort the valid and invalid email arrays
    validEmails.sort();
    invalidEmails.sort();

    // Display the valid and invalid email lists
    displayEmailList("validEmails", validEmails);
    displayEmailList("invalidEmails", invalidEmails);

    // Update the count of valid and invalid emails
    document.getElementById("validEmailCount").innerText =
      "(" + validEmails.length + ")";
    document.getElementById("invalidEmailCount").innerText =
      "(" + invalidEmails.length + ")";
  };
}

// Function to display a list of emails in an HTML element
function displayEmailList(listId, emails) {
  var emailList = document.getElementById(listId);
  emailList.innerHTML = emails
    .map(function (email) {
      return "<li>" + email + "</li>";
    })
    .join("");
}

// Function to validate the form before sending
function validateForm() {
  // Get the values from the form fields
  var name = document.forms["myForm"]["subject"].value;
  var email = document.forms["myForm"]["senderEmail"].value;

  // Check if email is empty
  if (email === "") {
    alert("Name must be filled out");
    return false;
  }

  // Check if name is empty
  if (name === "") {
    alert("Subject must be filled out");
    return false;
  }
  return true;
}

// Initialize emailjs with user ID
(function () {
  emailjs.init("Qai0kl5zLMdd0GRtH"); // Replace with your actual user ID
})();

// Function to send emails
function sendEmails() {
  // Check if form is validated
  if (validateForm()) {
    // Get values from input fields
    var senderEmail = document.getElementById("senderEmail").value;
    var message = document.getElementById("message").value;
    var subject = document.getElementById("subject").value;

    var validEmails = [];
    var invalidEmails = [];

    // Read contents of CSV file
    var file = document.getElementById("csvFile").files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
      var csv = event.target.result;
      var lines = csv.split("\n");
      // Loop through each line in the CSV
      for (var i = 0; i < lines.length; i++) {
        var email = lines[i].trim();
        var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
        // Test if the email matches the regex pattern
        if (emailRegex.test(email)) {
          validEmails.push(email);
        } else {
          invalidEmails.push(email);
        }
      }

      // Log the number of valid emails
      console.log(validEmails.length);

      // Send email to valid email addresses
      for (var j = 0; j < validEmails.length; j++) {
        var templateParams = {
          to_name: validEmails[j],
          from_name: senderEmail,
          message_html: message,
          subject_html: subject,
        };

        // Send email using emailjs library
        emailjs
          .send("service_0yvkjov", "template_yz514be", templateParams)
          .then(
            function (response) {
              console.log("SUCCESS", response);
            },
            function (error) {
              console.log("FAILED", error);
            }
          );
      }

      // Display alert after sending emails
      alert("Emails sent to valid email addresses.");
    };
  }
}

// Text rotation function for dynamic text display
var TxtRotate = function (el, toRotate, period) {
  // Initialization of properties
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 1) || 1000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

// Function to rotate and display text
TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  // Display the text
  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  // Schedule the next tick
  setTimeout(function () {
    that.tick();
  }, delta);
};

// Function to initialize text rotation on window load
window.onload = function () {
  var elements = document.getElementsByClassName("txt-rotate");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-rotate");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }

  // INJECT CSS for text rotation
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};

// Function to handle CSV file change
document.getElementById("csvFile").addEventListener("change", function () {
  var validEmails = [];
  var invalidEmails = [];

  // Read contents of CSV file
  var file = document.getElementById("csvFile").files[0];
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function (event) {
    var csv = event.target.result;
    var lines = csv.split("\n");
    // Loop through each line in the CSV
    for (var i = 0; i < lines.length; i++) {
      var email = lines[i].trim();
      var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
      // Test if the email matches the regex pattern
      if (emailRegex.test(email)) {
        validEmails.push(email);
      } else {
        invalidEmails.push(email);
      }
    }

    // Display valid and invalid emails
    document.getElementById("validEmails").innerHTML =
      validEmails.join("<br><br>");
    document.getElementById("invalidEmails").innerHTML =
      invalidEmails.join("<br><br>");
    document.getElementById("validEmailCount").innerText =
      "(" + validEmails.length + ")";
    document.getElementById("invalidEmailCount").innerText =
      "(" + invalidEmails.length + ")";
  };
});

// Clear Button Functionality
var clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", function () {
  var messageTextarea = document.getElementById("message");
  messageTextarea.value = ""; // Clear the content of the textarea
});
