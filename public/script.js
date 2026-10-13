
// Signup
document.getElementById("signupForm").onsubmit = function(event) {

    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Check whether an account already exists
    let oldUser = JSON.parse(localStorage.getItem("user"));

    if (oldUser && oldUser.email === email) {
        document.getElementById("message").innerText =
            "Account already exists. Please log in.";
        return;
    }

    // Save signup details
    let user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem("user", JSON.stringify(user));

    document.getElementById("message").innerText =
        "Signup successful!";

    showHome();
};


// Login
document.getElementById("loginForm").onsubmit = function(event) {

    event.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email &&
        user.password === password) {

        document.getElementById("loginMessage").innerText =
            "Login successful!";

        showHome();

    } else {

        document.getElementById("loginMessage").innerText =
            "Invalid email or password!";
    }
};


// Show home screen
function showHome() {

    document.getElementById("authSection").style.display = "none";

    document.getElementById("home").style.display = "block";

    document.getElementById("choice").innerText = "";
}


// Be a Rider
function beRider() {

    document.getElementById("choice").innerText =
        "You selected Be a Rider!";
}


// Provide a Ride
function provideRide() {

    document.getElementById("choice").innerText =
        "You selected Provide a Ride!";
}


// Logout
function logout() {

    document.getElementById("authSection").style.display = "flex";

    document.getElementById("home").style.display = "none";

    document.getElementById("loginForm").reset();

    document.getElementById("loginMessage").innerText = "";
}

// Show rider form
function showRider() {
    document.getElementById("home").style.display = "none";
    document.getElementById("riderForm").style.display = "block";
    document.getElementById("providerForm").style.display = "none";
}


// Show provider form
function showProvider() {
    document.getElementById("home").style.display = "none";
    document.getElementById("providerForm").style.display = "block";
    document.getElementById("riderForm").style.display = "none";
}


// Return to home screen
function goHome() {
    document.getElementById("home").style.display = "block";
    document.getElementById("riderForm").style.display = "none";
    document.getElementById("providerForm").style.display = "none";
}


// Set the minimum travel date to today
let today = new Date().toLocaleDateString("en-CA");

document.getElementById("riderDate").min = today;
document.getElementById("providerDate").min = today;


// Rider form
document.getElementById("findRideForm").onsubmit = function(event) {
    event.preventDefault();

    let from = document.getElementById("riderFrom").value;
    let to = document.getElementById("riderTo").value;
    let date = document.getElementById("riderDate").value;
    let members = document.getElementById("members").value;
    let time = document.getElementById("riderTime").value;

    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
        alert("Starting location and destination must be different.");
        return;
    }

    document.getElementById("rideResult").innerText =
        "Ride search details: " + from + " to " + to +
        " | Date: " + date +
        " | Passengers: " + members +
        " | Time: " + time +
        ". Ride matching will be added next.";
};



// Provider form
document.getElementById("provideRideForm").onsubmit = function(event) {
    event.preventDefault();

    let from = document.getElementById("providerFrom").value;
    let to = document.getElementById("providerTo").value;
    let date = document.getElementById("providerDate").value;
    let car = document.getElementById("carName").value;
    let capacity = Number(document.getElementById("capacity").value);
    let seats = Number(document.getElementById("seats").value);
    let start = document.getElementById("startTime").value;
    let end = document.getElementById("endTime").value;

    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
        alert("Starting location and destination must be different.");
        return;
    }

    if (seats > capacity) {
        alert("Available seats cannot exceed total passenger capacity.");
        return;
    }

    if (start >= end) {
        alert("Arrival time must be later than departure time.");
        return;
    }

    document.getElementById("providerResult").innerText =
        "Ride details entered: " + car +
        " | " + from + " to " + to +
        " | Date: " + date +
        " | Seats: " + seats +
        " | " + start + " to " + end +
        ". Ride details are ready!";
};

