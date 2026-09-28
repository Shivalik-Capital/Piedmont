import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#111110] text-white p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-[#D4AF37] mb-8 border-b border-[#D4AF37]/20 pb-4">Privacy Policy & Terms of Service</h1>
        
        <article className="prose prose-invert prose-gold max-w-none space-y-6 text-[#D4AF37]/80">
          <p className="text-sm uppercase tracking-widest text-[#D4AF37]/50 mb-8">Last Updated: September 2026</p>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Disclaimer of Liability (Not Financial Advice)</h2>
            <p>
              The information provided by Piedmont Terminal ("we," "us," or "our") on our platform is for general informational and educational purposes only. 
              <strong>WE ARE NOT REGISTERED FINANCIAL ADVISORS.</strong> The content, data, charts, and metrics provided on this platform do not constitute financial, investment, or trading advice. 
              All trading and investment decisions involve substantial risk of loss. You are solely responsible for your own investment research and decisions. 
              We assume absolutely no liability for any financial losses or damages incurred as a result of relying on information obtained from this platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Data Accuracy and Delays</h2>
            <p>
              Financial data, including but not limited to stock prices, macroeconomic indicators, and company fundamentals, are sourced from third-party APIs (such as Yahoo Finance, World Bank, and the Reserve Bank of India). 
              While we strive to provide accurate and up-to-date information, we do not warrant or guarantee the accuracy, completeness, or timeliness of the data. 
              Market data may be delayed by 15 minutes or more. You agree that we are not responsible for any inaccuracies, errors, or delays in the data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Collection and Privacy</h2>
            <p>
              We respect your privacy and are committed to protecting your personal data. We collect minimal information required to operate the platform:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Usage Data:</strong> We may collect anonymous usage data (pages visited, time on site) to improve our service.</li>
              <li><strong>Cookies:</strong> We use essential cookies to maintain user sessions and preferences. We do not use third-party tracking cookies for targeted advertising.</li>
              <li><strong>No Third-Party Sharing:</strong> We do not sell, trade, or rent your personal identification information to others under any circumstances.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
            <p>
              The design, layout, look, appearance, and graphics of the Piedmont Terminal are owned by or licensed to us. 
              Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Modifications to the Service</h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, the platform (or any part thereof) with or without notice. 
              We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the service.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
