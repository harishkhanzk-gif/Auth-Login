import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    // field level errors
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();

       const validateName = (value) => {
        if (value.trim().length < 3) {
            setNameError("Name must be at least 3 characters");
        } else {
            setNameError("");
        }
    };

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            setEmailError("Invalid email format");
        } else if (!value.endsWith("@gmail.com")) {
            setEmailError("Email must end with @gmail.com");
        } else {
            setEmailError("");
        }
    };

    const validatePassword = (value) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

        if (!passwordRegex.test(value)) {
            setPasswordError(
                "Password must include uppercase, number & special character"
            );
        } else {
            setPasswordError("");
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({ ...form, [name]: value });
        setError(""); // clear backend error

        if (name === "name") validateName(value);
        if (name === "email") validateEmail(value);
        if (name === "password") validatePassword(value);
    };

    const handleSubmit = async () => {
        
        if (nameError || emailError || passwordError) {
            return setError("Please fix all errors before submitting.");
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/singup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/");
            } else {
                setError(data.message || "Signup failed");
            }

        } catch (error) {
            setError("Signup error. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Sign Up</h2>

            {error && <p style={styles.error}>{error}</p>}

            {/* NAME FIELD */}
            <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                style={{
                    border: nameError
                        ? "2px solid red"
                        : form.name
                        ? "2px solid green"
                        : ""
                }}
            />
            {nameError && <p style={styles.error}>{nameError}</p>}

            {/* EMAIL FIELD */}
            <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                style={{
                    border: emailError
                        ? "2px solid red"
                        : form.email
                        ? "2px solid green"
                        : ""
                }}
            />
            {emailError && <p style={styles.error}>{emailError}</p>}

            {/* PASSWORD FIELD */}
            <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                style={{
                    border: passwordError
                        ? "2px solid red"
                        : form.password
                        ? "2px solid green"
                        : ""
                }}
            />
            {passwordError && (
                <p style={styles.error}>{passwordError}</p>
            )}

            <button onClick={handleSubmit}>Sign Up</button>

            <p>
                Already have an account? <Link to="/">Login</Link>
            </p>
        </div>
    );
}

const styles = {
    container: {
        width: 300,
        margin: "100px auto",
        display: "flex",
        flexDirection: "column",
        gap: 10
    },
    error: {
        color: "red",
        fontSize: 14,
        margin: 0
    }
};
