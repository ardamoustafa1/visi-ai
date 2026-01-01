import Link from 'next/link';

export default function Home() {
    return (
        <div className="landing-page">
            <h1 className="hero-title">
                Welcome to <span className="gradient-text">Visi AI</span>
            </h1>
            <p className="hero-subtitle">
                The future of education is here. Master any subject with your personal AI tutor, powered by advanced intelligence.
            </p>

            <div className="button-group">
                <Link
                    href="/chat"
                    className="btn-primary"
                >
                    Start Learning
                </Link>
                <button className="btn-secondary">
                    Learn More
                </button>
            </div>
        </div>
    );
}
