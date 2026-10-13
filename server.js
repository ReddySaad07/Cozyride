const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();

app.use(express.static("public"));
app.use(express.json());

// Email settings
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Read users
function loadUsers() {
    return JSON.parse(fs.readFileSync("users.json", "utf-8"));
}

// Save users
function saveUsers(users) {
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

// Sign up
app.post("/api/signup", async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email.toLowerCase();
        const password = req.body.password;

        if (!name || !email || !password || password.length < 8) {
            return res.json({
                ok: false,
                message: "Enter all details. Password must be at least 8 characters."
            });
        }

        const users = loadUsers();

        const oldUser = users.find(user => user.email === email);

        if (oldUser) {
            return res.json({
                ok: false,
                message: "That email is already registered."
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // Create a verification token
        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256")
            .update(token).digest("hex");

        users.push({
            name: name,
            email: email,
            passwordHash: passwordHash,
            verified: false,
            tokenHash: tokenHash,
            tokenExpiry: Date.now() + 24 * 60 * 60 * 1000
        });

        saveUsers(users);

        const link = "http://localhost:3000/api/verify?token=" + token;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your Coziryde account",
            text: "Hello " + name +
                ",\n\nClick this link to verify your email:\n" +
                link + "\n\nThis link expires in 24 hours."
        });

        res.json({
            ok: true,
            message: "Account created! Check your email to verify it."
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Could not create account or send email."
        });
    }
});

// Verify email
app.get("/api/verify", (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.send("Invalid verification link.");
    }

    const tokenHash = crypto.createHash("sha256")
        .update(token).digest("hex");

    const users = loadUsers();

    const user = users.find(u => u.tokenHash === tokenHash);

    if (!user || user.tokenExpiry < Date.now()) {
        return res.send("This verification link is invalid or expired.");
    }

    user.verified = true;
    delete user.tokenHash;
    delete user.tokenExpiry;

    saveUsers(users);

    res.send("Email verified successfully! You can now log in.");
});

// Log in
app.post("/api/login", async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const password = req.body.password;

        const users = loadUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.json({
                ok: false,
                message: "Email or password is incorrect."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password, user.passwordHash
        );

        if (!passwordMatches) {
            return res.json({
                ok: false,
                message: "Email or password is incorrect."
            });
        }

        if (!user.verified) {
            return res.json({
                ok: false,
                message: "Please verify your email first."
            });
        }

        res.json({
            ok: true,
            message: "Welcome back, " + user.name + "!"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: "Something went wrong."
        });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
