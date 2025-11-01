import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQ.css';

const items = [
  {
    q: 'What is Bloomence and how does it help?',
    a: 'Bloomence helps you track wellbeing with quick assessments, insightful summaries, and timely guidance. It is not a diagnosis and does not replace professional care.'
  },
  {
    q: 'Are my results and data private?',
    a: 'Yes. Your data is stored securely and never shared without your permission. You can request deletion at any time.'
  },
  {
    q: 'How often should I take assessments?',
    a: 'Most people benefit from a brief check-in once or twice per week. You can also take one anytime you want a snapshot.'
  },
  {
    q: 'Why did I receive or not receive an email?',
    a: 'Emails are sent for specific events like weekly summaries, high-score follow-ups, or inactivity reminders. Check Spam/Promotions if you do not see them.'
  },
  {
    q: 'Can Bloomence diagnose or provide therapy?',
    a: 'No. Bloomence provides information and support. For diagnosis or treatment, please contact a qualified professional or local support line.'
  }
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const navigate = useNavigate();
  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {items.map((it, idx) => (
            <div key={idx} className={`faq-item ${open === idx ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpen(open === idx ? -1 : idx)} aria-expanded={open === idx}>
                <span>{it.q}</span>
                <span className="faq-icon">{open === idx ? '−' : '+'}</span>
              </button>
              {open === idx && (
                <div className="faq-answer">
                  <p>{it.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{textAlign:'center', marginTop: 16}}>
          <button onClick={()=>navigate('/faq')} style={{background:'#10b981', color:'#fff', border:'none', padding:'10px 16px', borderRadius:8, cursor:'pointer'}}>View all FAQs</button>
        </div>
      </div>
    </section>
  );
}
