import React from 'react';
import PolicyLayout from '../components/common/PolicyLayout';

const Security: React.FC = () => {
    return (
        <PolicyLayout
            title="Security Overview"
            description="How we protect the integrity and confidentiality of the D. Connect ecosystem."
            lastUpdated="February 20, 2026"
        >
            <section>
                <h2>1. Infrastructure Security</h2>
                <p>D. Connect is built on a high-availability infrastructure with multi-layered security protocols.</p>
                <ul>
                    <li><strong>Data Encryption:</strong> All data is encrypted using AES-256 for storage and TLS 1.3 for transit.</li>
                    <li><strong>Isolation:</strong> Each user's database footprint is logically isolated to prevent cross-contamination.</li>
                    <li><strong>Monitoring:</strong> 24/7 automated monitoring for intrusion detection and anomalous behavior.</li>
                </ul>
            </section>

            <section>
                <h2>2. Authentication</h2>
                <p>We use industry-leading authentication standards to verify identity.</p>
                <ul>
                    <li>Secure OTP verification for sensitive actions.</li>
                    <li>JWT (JSON Web Tokens) with short-lived access and secure refresh mechanisms.</li>
                    <li>Rate limiting to prevent brute-force attacks.</li>
                </ul>
            </section>

            <section>
                <h2>3. Secure Communication</h2>
                <p>Messages and collaborative boards use secure socket layers (WebSockets over WSS) to ensure your professional discussions remain private.</p>
            </section>

            <section>
                <h2>4. Compliance & Audits</h2>
                <p>We regularly conduct internal security audits and follow best practices outlined by OWASP and SOC 2 standards.</p>
            </section>

            <section>
                <h2>5. Reporting Vulnerabilities</h2>
                <p>Found a potential security issue? We value your contribution to our ecosystem's safety. Contact <strong>security@dconnect.com</strong>.</p>
            </section>
        </PolicyLayout>
    );
};

export default Security;
