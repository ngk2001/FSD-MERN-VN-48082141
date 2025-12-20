import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                    background: 'var(--background)'
                }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text)', marginBottom: '1rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        We're sorry for the inconvenience. Please try refreshing the page.
                    </p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn btn-primary"
                    >
                        Refresh Page
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <details style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px' }}>
                            <summary style={{ cursor: 'pointer', color: 'var(--primary)' }}>
                                Error Details (Development Only)
                            </summary>
                            <pre style={{ 
                                marginTop: '1rem', 
                                padding: '1rem', 
                                background: '#f5f5f5', 
                                borderRadius: '0.5rem',
                                overflow: 'auto',
                                fontSize: '0.875rem'
                            }}>
                                {this.state.error && this.state.error.toString()}
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
