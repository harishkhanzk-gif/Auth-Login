// import { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// export default function Login() {
//     const [form, setForm] = useState({ email: "", password: "" });
//     const [error, setError] = useState("");
//     const navigate = useNavigate();

//     const handleChange = (e) =>
//         setForm({ ...form, [e.target.name]: e.target.value });
//         setError("");

//     const handleSubmit = async () => {
//         try {
//             const response = await fetch("http://localhost:5000/api/auth/login", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 credentials: "include",   // important for CORS if using cookies
//                 body: JSON.stringify(form)
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 navigate("/dashboard");
//             } else {
//                 setError(data.message || "Something went wrong");
//             }
//         } catch (error) {
//              setError("Signup error. Please try again.");
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <h2>Login</h2>
//             {error && <p style={styles.error}>{error}</p>}
//             <input name="email" placeholder="Email" onChange={handleChange} />
//             <input name="password" type="password" placeholder="Password" onChange={handleChange} />
//             <button onClick={handleSubmit}>Login</button>
//             <p>Don't have an account? <Link to="/signup">Signup</Link></p>
//         </div>
//     );
// }

// const styles = {
//     container: { width: 300, margin: "100px auto", display: "flex", flexDirection: "column", gap: 10 },
//     error: { color: "red", fontSize: 14 }
// };


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    
    const navigate = useNavigate();

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            setEmailError("Invalid email format");
        } else if (!value.endsWith("@gmail.com")) {
            setEmailError("Email must end with @gmail.com");
        } else {
            setEmailError(""); // valid
        }
    };

      const validatePassword = (value) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

        if (!passwordRegex.test(value)) {
            setPasswordError(
                "Password must have uppercase, number & special character"
            );
        } else {
            setPasswordError(""); // valid
        }
    };

   
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({ ...form, [name]: value });
        setError(""); // clear backend errors
        
        if (name === "email") validateEmail(value);
        if (name === "password") validatePassword(value);
    };

    const handleSubmit = async () => {
        if (emailError || passwordError) {
            return setError("Fix all errors before login");
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/dashboard");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (error) {
            setError("Server error. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>

            {error && <p style={styles.error}>{error}</p>}

            {/* EMAIL INPUT */}
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

            {/* PASSWORD INPUT */}
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
            {passwordError && <p style={styles.error}>{passwordError}</p>}

            <button onClick={handleSubmit}>Login</button>

            <p>
                Don't have an account? <Link to="/signup">Signup</Link>
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
        gap: 10,
    },
    error: { color: "red", fontSize: 14, margin: 0 }
};
