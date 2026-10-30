import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        Intern<span>Connect</span>
      </Link>

      <nav>
        <Link to="/">Internships</Link>
      </nav>
    </header>
  );
}

function Home() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInternships() {
      try {
        const response = await fetch(`${API_URL}/internships`);

        if (!response.ok) {
          throw new Error("Unable to load internships.");
        }

        const data = await response.json();
        setInternships(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInternships();
  }, []);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">YOUR CAREER STARTS HERE</p>
        <h1>Find your next internship.</h1>
        <p>
          Discover opportunities, build real-world skills, and take
          the first step toward your dream career.
        </p>
        <a href="#internships" className="primary-btn">
          Explore Internships
        </a>
      </section>

      <main className="container" id="internships">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OPPORTUNITIES</p>
            <h2>Available Internships</h2>
          </div>

          <span className="count">
            {internships.length} opportunities
          </span>
        </div>

        {loading && <p className="notice">Loading internships...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && internships.length === 0 && (
          <p>No internships are available right now.</p>
        )}

        <div className="internship-grid">
          {internships.map((internship) => (
            <article className="card" key={internship.id}>
              <div className="card-icon">
                {internship.title.startsWith("Data") ? "📊" : "💻"}
              </div>

              <p className="company">{internship.company}</p>
              <h3>{internship.title}</h3>

              <div className="tags">
                <span>{internship.location}</span>
                <span>{internship.duration}</span>
              </div>

              <p className="description">
                {internship.description}
              </p>

              <div className="card-footer">
                <strong>{internship.stipend}</strong>

                <Link
                  className="text-link"
                  to={`/internship/${internship.id}`}
                >
                  View Details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchDetails() {
      try {
        const response = await fetch(`${API_URL}/internships/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Internship not found.");
        }

        if (active) {
          setInternship(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchDetails();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <main className="container notice">Loading details...</main>;
  }

  if (error) {
    return (
      <main className="container">
        <p className="error">{error}</p>
        <Link to="/" className="text-link">← Back to internships</Link>
      </main>
    );
  }

  return (
    <main className="container detail-container">
      <Link to="/" className="text-link">
        ← All Internships
      </Link>

      <article className="detail-card">
        <div className="card-icon">💼</div>
        <p className="company">{internship.company}</p>
        <h1>{internship.title}</h1>

        <div className="tags">
          <span>{internship.location}</span>
          <span>{internship.duration}</span>
          <span>{internship.stipend}</span>
        </div>

        <h3>About this internship</h3>
        <p className="description">{internship.description}</p>

        <h3>What you should know</h3>
        <p>
          Students should be interested in learning, problem-solving,
          and working on practical projects.
        </p>

        <button
          className="primary-btn"
          onClick={() => navigate(`/apply/${internship.id}`)}
        >
          Apply for this Internship
        </button>
      </article>
    </main>
  );
}

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadInternship() {
      try {
        const response = await fetch(`${API_URL}/internships/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Internship not found.");
        }

        if (active) {
          setInternship(data);
        }
      } catch (error) {
        if (active) {
          setMessage(error.message);
          setMessageType("error");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInternship();

    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (
      !studentName.trim() ||
      !email.trim() ||
      !rollNumber.trim()
    ) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      return;
    }

    if (studentName.trim().length < 2) {
      setMessage("Name must contain at least 2 characters.");
      setMessageType("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    if (rollNumber.trim().length > 30) {
      setMessage("Roll number cannot exceed 30 characters.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentName: studentName.trim(),
          email: email.trim(),
          rollNumber: rollNumber.trim(),
          internshipId: id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Application failed.");
      }

      setMessage(data.message || "Application submitted successfully!");
      setMessageType("success");

      setStudentName("");
      setEmail("");
      setRollNumber("");
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the server. Please try again."
          : error.message
      );

      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="container notice">Loading form...</main>;
  }

  if (!internship) {
    return (
      <main className="container">
        <p className="error">{message || "Internship not found."}</p>
        <Link to="/" className="text-link">Back to internships</Link>
      </main>
    );
  }

  return (
    <main className="container form-container">
      <Link to={`/internship/${id}`} className="text-link">
        ← Back to details
      </Link>

      <section className="form-card">
        <p className="eyebrow">TAKE THE NEXT STEP</p>
        <h1>Apply for Internship</h1>

        <p className="form-subtitle">
          Applying for: <strong>{internship.title}</strong>
        </p>

        {message && (
          <div
            className={messageType === "success" ? "success" : "error"}
            role="status"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="studentName">Student Name *</label>
            <input
              id="studentName"
              type="text"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              minLength={2}
              maxLength={100}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email ID *</label>
            <input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="rollNumber">Roll Number *</label>
            <input
              id="rollNumber"
              type="text"
              placeholder="Enter your roll number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              maxLength={30}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="internship">Selected Internship</label>
            <input
              id="internship"
              type="text"
              value={internship.title}
              readOnly
            />
          </div>

          <button
            className="primary-btn submit-btn"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </section>
    </main>
  );
}

function NotFound() {
  return (
    <main className="container not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="primary-btn">Back to Home</Link>
    </main>
  );
}

export default function App() {
  return (
    <div className="app">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/internship/:id"
          element={<InternshipDetails />}
        />
        <Route path="/apply/:id" element={<ApplicationForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="footer">
        <p>© 2026 InternConnect | Student Internship Portal</p>
      </footer>
    </div>
  );
}