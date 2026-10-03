import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FileText,
    ArrowRight,
    Lock,
    Mail,
    User,
} from "lucide-react";
import api from "./api";
import RibbonGlow from "./RibbonGlow";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Lock page scrolling while Register is open
    useEffect(() => {
        const originalBodyOverflow =
            document.body.style.overflow;

        const originalHtmlOverflow =
            document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow =
            "hidden";

        return () => {
            document.body.style.overflow =
                originalBodyOverflow;

            document.documentElement.style.overflow =
                originalHtmlOverflow;
        };
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !name.trim() ||
            !email.trim() ||
            !password.trim()
        ) {
            setError(
                "Please fill in all fields."
            );
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        try {
            setLoading(true);

            await api.post(
                "/auth/register",
                {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                }
            );

            navigate("/");
        } catch (error) {
            console.error(
                "Registration failed:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100dvh",
                overflow: "hidden",

                background: "#0B0A10",

                fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

                boxSizing: "border-box",
            }}
        >
            {/* =====================================================
                RIBBON GLOW BACKGROUND
            ===================================================== */}

            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                }}
            >
                <RibbonGlow
                    background="#0B0A10"
                    color1="#2FD3F2"
                    color2="#7B61FF"
                    speed={35}
                    size={100}
                    angle={-180}
                    hover={100}
                    reach={240}
                    style={{
                        width: "100%",
                        height: "100%",
                        minWidth: 0,
                        minHeight: 0,
                    }}
                />
            </div>

            {/* Dark cinematic overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,

                    background:
                        "radial-gradient(circle at center, rgba(11,10,16,0.05) 0%, rgba(11,10,16,0.48) 100%)",

                    pointerEvents: "none",
                }}
            />

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <div
                style={{
                    position: "relative",
                    zIndex: 2,

                    width: "100%",
                    height: "100%",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    padding: "24px",
                    boxSizing: "border-box",

                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "430px",
                    }}
                >
                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "2px",
                        }}
                    >
                        <div
                            style={{
                                width: "52px",
                                height: "52px",

                                margin:
                                    "0 auto 12px",

                                borderRadius: "14px",

                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",

                                background:
                                    "linear-gradient(145deg, rgba(20,25,38,0.92), rgba(10,12,22,0.78))",

                                border:
                                    "1px solid rgba(47,211,242,0.28)",

                                boxShadow:
                                    "0 0 28px rgba(47,211,242,0.12), 0 0 45px rgba(123,97,255,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
                            }}
                        >
                            <FileText
                                size={25}
                                color="#2FD3F2"
                            />
                        </div>

                        <h1
                            style={{
                                margin: 0,

                                fontSize: "30px",
                                fontWeight: 700,
                                letterSpacing:
                                    "-0.8px",

                                color: "#ffffff",

                                textShadow:
                                    "0 0 25px rgba(47,211,242,0.12)",
                            }}
                        >
                            CollabDocs
                        </h1>

                        <p
                            style={{
                                marginTop: "7px",
                                marginBottom: 0,

                                color:
                                    "rgba(226,232,240,0.68)",

                                fontSize: "15px",
                            }}
                        >
                            Your workspace for
                            collaborative documents
                        </p>
                    </div>

                    {/* =================================================
                        REGISTER CARD
                    ================================================= */}

                    <div
                        style={{
                            background:
                                "linear-gradient(145deg, rgba(17,20,31,0.88), rgba(10,12,21,0.78))",

                            border:
                                "1px solid rgba(255,255,255,0.10)",

                            borderRadius: "20px",

                            padding: "32px",

                            boxShadow:
                                "0 30px 80px rgba(0,0,0,0.42), 0 0 45px rgba(47,211,242,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",

                            backdropFilter:
                                "blur(24px)",

                            WebkitBackdropFilter:
                                "blur(24px)",
                        }}
                    >
                        {/* Heading */}
                        <div
                            style={{
                                marginBottom:
                                    "26px",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,

                                    fontSize: "22px",
                                    fontWeight: 650,

                                    color: "#ffffff",

                                    letterSpacing:
                                        "-0.3px",
                                }}
                            >
                                Create your account
                            </h2>

                            <p
                                style={{
                                    marginTop:
                                        "7px",
                                    marginBottom: 0,

                                    fontSize:
                                        "14px",

                                    color:
                                        "rgba(203,213,225,0.62)",
                                }}
                            >
                                Get started with
                                your collaborative
                                workspace.
                            </p>
                        </div>

                        <form
                            onSubmit={
                                handleRegister
                            }
                        >
                            {/* =================================================
                                NAME
                            ================================================= */}

                            <div
                                style={{
                                    marginBottom:
                                        "18px",
                                }}
                            >
                                <label
                                    style={{
                                        display:
                                            "block",

                                        marginBottom:
                                            "8px",

                                        fontSize:
                                            "13px",

                                        fontWeight: 600,

                                        color:
                                            "#cbd5e1",
                                    }}
                                >
                                    Full name
                                </label>

                                <div
                                    style={{
                                        position:
                                            "relative",
                                    }}
                                >
                                    <User
                                        size={17}
                                        style={{
                                            position:
                                                "absolute",

                                            left: "13px",
                                            top: "50%",

                                            transform:
                                                "translateY(-50%)",

                                            color:
                                                "#64748b",

                                            pointerEvents:
                                                "none",
                                        }}
                                    />

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(
                                            e
                                        ) =>
                                            setName(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Your name"
                                        required
                                        autoComplete="name"
                                        style={{
                                            width:
                                                "100%",

                                            boxSizing:
                                                "border-box",

                                            height:
                                                "46px",

                                            padding:
                                                "0 14px 0 40px",

                                            border:
                                                "1px solid rgba(148,163,184,0.20)",

                                            borderRadius:
                                                "11px",

                                            outline:
                                                "none",

                                            fontSize:
                                                "14px",

                                            color:
                                                "#f8fafc",

                                            background:
                                                "rgba(255,255,255,0.045)",

                                            transition:
                                                "all 0.2s ease",

                                            caretColor:
                                                "#2FD3F2",
                                        }}
                                        onFocus={(
                                            e
                                        ) => {
                                            e.currentTarget.style.border =
                                                "1px solid rgba(47,211,242,0.55)";
                                            e.currentTarget.style.boxShadow =
                                                "0 0 0 3px rgba(47,211,242,0.08), 0 0 20px rgba(47,211,242,0.08)";
                                        }}
                                        onBlur={(
                                            e
                                        ) => {
                                            e.currentTarget.style.border =
                                                "1px solid rgba(148,163,184,0.20)";
                                            e.currentTarget.style.boxShadow =
                                                "none";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* =================================================
                                EMAIL
                            ================================================= */}

                            <div
                                style={{
                                    marginBottom:
                                        "18px",
                                }}
                            >
                                <label
                                    style={{
                                        display:
                                            "block",

                                        marginBottom:
                                            "8px",

                                        fontSize:
                                            "13px",

                                        fontWeight: 600,

                                        color:
                                            "#cbd5e1",
                                    }}
                                >
                                    Email address
                                </label>

                                <div
                                    style={{
                                        position:
                                            "relative",
                                    }}
                                >
                                    <Mail
                                        size={17}
                                        style={{
                                            position:
                                                "absolute",

                                            left: "13px",
                                            top: "50%",

                                            transform:
                                                "translateY(-50%)",

                                            color:
                                                "#64748b",

                                            pointerEvents:
                                                "none",
                                        }}
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(
                                            e
                                        ) =>
                                            setEmail(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="you@example.com"
                                        required
                                        autoComplete="email"
                                        style={{
                                            width:
                                                "100%",

                                            boxSizing:
                                                "border-box",

                                            height:
                                                "46px",

                                            padding:
                                                "0 14px 0 40px",

                                            border:
                                                "1px solid rgba(148,163,184,0.20)",

                                            borderRadius:
                                                "11px",

                                            outline:
                                                "none",

                                            fontSize:
                                                "14px",

                                            color:
                                                "#f8fafc",

                                            background:
                                                "rgba(255,255,255,0.045)",

                                            transition:
                                                "all 0.2s ease",

                                            caretColor:
                                                "#2FD3F2",
                                        }}
                                        onFocus={(
                                            e
                                        ) => {
                                            e.currentTarget.style.border =
                                                "1px solid rgba(47,211,242,0.55)";
                                            e.currentTarget.style.boxShadow =
                                                "0 0 0 3px rgba(47,211,242,0.08), 0 0 20px rgba(47,211,242,0.08)";
                                        }}
                                        onBlur={(
                                            e
                                        ) => {
                                            e.currentTarget.style.border =
                                                "1px solid rgba(148,163,184,0.20)";
                                            e.currentTarget.style.boxShadow =
                                                "none";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* =================================================
                                PASSWORD
                            ================================================= */}

                            <div
                                style={{
                                    marginBottom:
                                        "20px",
                                }}
                            >
                                <label
                                    style={{
                                        display:
                                            "block",

                                        marginBottom:
                                            "8px",

                                        fontSize:
                                            "13px",

                                        fontWeight: 600,

                                        color:
                                            "#cbd5e1",
                                    }}
                                >
                                    Password
                                </label>

                                <div
                                    style={{
                                        position:
                                            "relative",
                                    }}
                                >
                                    <Lock
                                        size={17}
                                        style={{
                                            position:
                                                "absolute",

                                            left: "13px",
                                            top: "50%",

                                            transform:
                                                "translateY(-50%)",

                                            color:
                                                "#64748b",

                                            pointerEvents:
                                                "none",
                                        }}
                                    />

                                    <input
                                        type="password"
                                        value={
                                            password
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setPassword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Minimum 6 characters"
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        style={{
                                            width:
                                                "100%",

                                            boxSizing:
                                                "border-box",

                                            height:
                                                "46px",

                                            padding:
                                                "0 14px 0 40px",

                                            border:
                                                "1px solid rgba(148,163,184,0.20)",

                                            borderRadius:
                                                "11px",

                                            outline:
                                                "none",

                                            fontSize:
                                                "14px",

                                            color:
                                                "#f8fafc",

                                            background:
                                                "rgba(255,255,255,0.045)",

                                            transition:
                                                "all 0.2s ease",

                                            caretColor:
                                                "#2FD3F2",
                                        }}
                                        onFocus={(
                                            e
                                        ) => {
                                            e.currentTarget.style.border =
                                                "1px solid rgba(123,97,255,0.65)";
                                            e.currentTarget.style.boxShadow =
                                                "0 0 0 3px rgba(123,97,255,0.08), 0 0 20px rgba(123,97,255,0.08)";
                                        }}
                                        onBlur={(
                                            e
                                        ) => {
                                            e.currentTarget.style.border =
                                                "1px solid rgba(148,163,184,0.20)";
                                            e.currentTarget.style.boxShadow =
                                                "none";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* =================================================
                                ERROR
                            ================================================= */}

                            {error && (
                                <div
                                    style={{
                                        marginBottom:
                                            "18px",

                                        padding:
                                            "11px 13px",

                                        borderRadius:
                                            "10px",

                                        background:
                                            "rgba(239,68,68,0.09)",

                                        border:
                                            "1px solid rgba(248,113,113,0.22)",

                                        color:
                                            "#fca5a5",

                                        fontSize:
                                            "13px",
                                    }}
                                >
                                    {error}
                                </div>
                            )}

                            {/* =================================================
                                SUBMIT
                            ================================================= */}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    height: "46px",

                                    border:
                                        "1px solid rgba(47,211,242,0.28)",

                                    borderRadius:
                                        "11px",

                                    background:
                                        loading
                                            ? "rgba(100,116,139,0.55)"
                                            : "linear-gradient(100deg, rgba(47,211,242,0.16), rgba(123,97,255,0.20))",

                                    color:
                                        "#ffffff",

                                    fontSize:
                                        "14px",

                                    fontWeight: 600,

                                    cursor: loading
                                        ? "not-allowed"
                                        : "pointer",

                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",

                                    gap: "8px",

                                    boxShadow:
                                        loading
                                            ? "none"
                                            : "0 0 24px rgba(47,211,242,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",

                                    transition:
                                        "all 0.2s ease",
                                }}
                                onMouseEnter={(
                                    e
                                ) => {
                                    if (!loading) {
                                        e.currentTarget.style.border =
                                            "1px solid rgba(47,211,242,0.60)";
                                        e.currentTarget.style.boxShadow =
                                            "0 0 28px rgba(47,211,242,0.15), 0 0 45px rgba(123,97,255,0.08), inset 0 1px 0 rgba(255,255,255,0.10)";
                                    }
                                }}
                                onMouseLeave={(
                                    e
                                ) => {
                                    if (!loading) {
                                        e.currentTarget.style.border =
                                            "1px solid rgba(47,211,242,0.28)";
                                        e.currentTarget.style.boxShadow =
                                            "0 0 24px rgba(47,211,242,0.08), inset 0 1px 0 rgba(255,255,255,0.08)";
                                    }
                                }}
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create account"}

                                {!loading && (
                                    <ArrowRight
                                        size={17}
                                    />
                                )}
                            </button>
                        </form>

                        {/* =================================================
                            LOGIN LINK
                        ================================================= */}

                        <div
                            style={{
                                marginTop: "24px",
                                paddingTop: "22px",

                                borderTop:
                                    "1px solid rgba(148,163,184,0.12)",

                                textAlign: "center",

                                fontSize: "14px",

                                color:
                                    "rgba(203,213,225,0.58)",
                            }}
                        >
                            Already have an
                            account?{" "}
                            <Link
                                to="/"
                                style={{
                                    color:
                                        "#2FD3F2",

                                    fontWeight: 600,

                                    textDecoration:
                                        "none",

                                    textShadow:
                                        "0 0 15px rgba(47,211,242,0.18)",
                                }}
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>

                    {/* Footer */}
                    <p
                        style={{
                            textAlign: "center",

                            marginTop: "20px",

                            fontSize: "12px",

                            color:
                                "rgba(203,213,225,0.42)",
                        }}
                    >
                        Secure collaborative workspace
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;