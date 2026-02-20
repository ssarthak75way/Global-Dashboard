import React from 'react';
import PolicyLayout from '../components/common/PolicyLayout';

const Privacy: React.FC = () => {
    return (
        <PolicyLayout
            title="Privacy Policy"
            description="Your privacy is the bedrock of the D. Connect ecosystem. We are committed to protecting your professional data and providing total transparency."
            lastUpdated="February 20, 2026"
        >
            <section>
                <h2>1. Information We Collect</h2>
                <p>We collect information to provide a better professional experience to all our users. This includes:</p>
                <ul>
                    <li><strong>Account Information:</strong> Name, email, and social credentials when you sign up.</li>
                    <li><strong>Professional Profile:</strong> Experience, skills, and resume data you choose to share.</li>
                    <li><strong>Usage Data:</strong> How you interact with our social feed, boards, and messages.</li>
                </ul>
            </section>

            <section>
                <h2>2. How We Use Information</h2>
                <p>Your data is used exclusively to power the D. Connect features:</p>
                <ul>
                    <li>Personalizing your dashboard and feed content.</li>
                    <li>Facilitating professional connections between users.</li>
                    <li>Improving our platform security and performance.</li>
                </ul>
            </section>

            <section>
                <h2>3. Data Sharing & Security</h2>
                <p>We do not sell your personal data. Sharing only occurs when:</p>
                <ul>
                    <li>You explicitly choose to make your profile public.</li>
                    <li>Legal obligations require us to do so.</li>
                    <li>Service providers need minimal access to maintain platform operations.</li>
                </ul>
                <p>All data is encrypted in transit and at rest using industry-standard protocols.</p>
            </section>

            <section>
                <h2>4. Your Rights</h2>
                <p>You have full control over your data. At any time, you can:</p>
                <ul>
                    <li>Update or delete your professional profile.</li>
                    <li>Export your data in a portable format.</li>
                    <li>Manage your notification and visibility preferences in Settings.</li>
                </ul>
            </section>

            <section>
                <h2>5. Contact Us</h2>
                <p>If you have questions about this policy, reach out to our privacy team at <strong>privacy@dconnect.com</strong>.</p>
            </section>
        </PolicyLayout>
    );
};

export default Privacy;
