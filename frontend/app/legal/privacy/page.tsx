import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-8 md:p-16 selection:bg-[#479ffa]/30 selection:text-white">
      <div className="max-w-4xl mx-auto mt-24">
        <h1 className="text-[42px] font-bold text-white tracking-[-0.05em] mb-8 border-b border-[#333333] pb-6">Legal & Privacy</h1>
        
        <article className="max-w-none space-y-10 text-[#868f97] text-[16px] leading-[1.6]">
          <p className="text-[12px] uppercase tracking-widest text-[#525252] font-semibold mb-8">Last Updated: September 2026</p>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4 tracking-[-0.03em]">1. Disclaimer of Liability (Not SEBI Registered)</h2>
            <p>
              The information provided by Piedmont Terminal ("we," "us," or "our") on our platform is for general informational and educational purposes only. 
              <strong className="text-white"> WE ARE NOT SEBI-REGISTERED FINANCIAL ADVISORS, RESEARCH ANALYSTS, OR BROKERS.</strong> The content, data, charts, and metrics provided on this platform do not constitute financial, investment, trading advice, or a recommendation to buy or sell any securities. 
              All trading and investment decisions involve substantial risk of loss. You are solely responsible for your own investment research and decisions. 
              We assume absolutely no liability for any financial losses or damages incurred as a result of relying on information obtained from this platform.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4 tracking-[-0.03em]">2. Data Accuracy and Delays</h2>
            <p>
              Financial data, including but not limited to stock prices, macroeconomic indicators, FII/DII flows, and company fundamentals, are sourced from third-party APIs (such as NSE, BSE, Yahoo Finance, and the Reserve Bank of India). 
              While we strive to provide accurate and up-to-date information, we do not warrant or guarantee the accuracy, completeness, or timeliness of the data. 
              Market data may be delayed. You agree that we are not responsible for any inaccuracies, errors, or delays in the data.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4 tracking-[-0.03em]">3. Data Collection and Privacy</h2>
            <p>
              We respect your privacy and are committed to protecting your personal data. We collect minimal information required to operate the platform:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-[#cccccc]">
              <li><strong className="text-white">Usage Data:</strong> We may collect anonymous usage data to improve our service.</li>
              <li><strong className="text-white">Cookies:</strong> We use essential cookies to maintain user sessions and preferences. We do not use third-party tracking cookies for targeted advertising.</li>
              <li><strong className="text-white">No Third-Party Sharing:</strong> We do not sell, trade, or rent your personal identification information to others under any circumstances.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4 tracking-[-0.03em]">4. Intellectual Property</h2>
            <p>
              The design, layout, look, appearance, and graphics of the Piedmont Terminal are owned by or licensed to us. 
              Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
