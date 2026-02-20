import React from 'react';
import PolicyLayout from '../components/common/PolicyLayout';

const Terms: React.FC = () => {
    return (
        <PolicyLayout
            title="Terms of Service"
            description="Guidelines for participating in the D. Connect professional ecosystem. By using our platform, you agree to these terms."
            lastUpdated="February 20, 2026"
        >
            <section>
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing D. Connect, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
            </section>

            <section>
                <h2>2. User Content</h2>
                <p>You retain ownership of the content you post. However, you grant D. Connect a worldwide license to host, store, and display your content to facilitate platform features.</p>
                <ul>
                    <li>You are responsible for the legality of your content.</li>
                    <li>No harassment, hate speech, or illegal activities are tolerated.</li>
                    <li>We reserve the right to remove content that violates our standards.</li>
                </ul>
            </section>

            <section>
                <h2>3. Professional Conduct</h2>
                <p>D. Connect is a high-end professional ecosystem. Users are expected to maintain professional integrity when interacting with others on the feed, boards, and messages.</p>
            </section>

            <section>
                <h2>4. Intellectual Property</h2>
                <p>The D. Connect logo, code, and brand identity are the exclusive property of Antigrav Labs. Unauthorized use is strictly prohibited.</p>
            </section>

            <section>
                <h2>5. Limitation of Liability</h2>
                <p>D. Connect provides tools for growth but does not guarantee specific career outcomes. We are not liable for any professional disputes or data loss occurring through platform usage.</p>
            </section>

            <section>
                <h2>6. Termination</h2>
                <p>We reserve the right to suspend accounts that violate our community guidelines or terms of service without prior notice.</p>
            </section>
        </PolicyLayout>
    );
};

export default Terms;
