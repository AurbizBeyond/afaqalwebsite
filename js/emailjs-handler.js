/**
 * ============================================================
 *  EMAILJS SETUP INSTRUCTIONS
 * ============================================================
 *
 *  STEP 1 — Create a free EmailJS account
 *    → https://www.emailjs.com  (free plan: 200 emails/month)
 *
 *  STEP 2 — Add an Email Service
 *    Dashboard → Email Services → Add New Service
 *    Choose Gmail → connect acounts.afaqalhind@gmail.com
 *    Copy the SERVICE ID (e.g. "service_xxxxxxx")
 *    → Paste it as EMAILJS_SERVICE_ID below
 *
 *  STEP 3 — Create an Email Template
 *    Dashboard → Email Templates → Create New Template
 *
 *    Set "To Email" to:  acounts.afaqalhind@gmail.com
 *    Set "Subject" to:   New Enquiry — {{service}} (from {{from_name}})
 *
 *    Paste this in the Template Body:
 *    ─────────────────────────────────────────────────────
 *    New enquiry received from your website.
 *
 *    Name:        {{from_name}}
 *    Phone:       {{phone}}
 *    Email:       {{reply_to}}
 *    Nationality: {{nationality}}
 *    Service:     {{service}}
 *    Contact Via: {{contact_method}}
 *
 *    Message:
 *    {{message}}
 *
 *    ─────────────────────────────────────────────────────
 *    Copy the TEMPLATE ID (e.g. "template_xxxxxxx")
 *    → Paste it as EMAILJS_TEMPLATE_ID below
 *
 *  STEP 4 — Get your Public Key
 *    Dashboard → Account → General → Public Key
 *    → Paste it as EMAILJS_PUBLIC_KEY below
 *
 * ============================================================
 */
 
const EMAILJS_SERVICE_ID  = 'service_txtodoq';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_af14vyb';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'gv2ACy8xhgwnGfR_P';   // e.g. 'AbCdEfGhIjKlMnOp'
 
// ============================================================
//  FORM HANDLER — works for both home page & contact page
// ============================================================
function initEmailJS() {
  // Load EmailJS SDK dynamically
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    bindForms();
  };
  document.head.appendChild(script);
}
 
function bindForms() {
  document.querySelectorAll('.enquiry-form').forEach(form => {
    form.addEventListener('submit', handleSubmit);
  });
}
 
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('[type="submit"]');
 
  // Collect all field values
  const fields = {
    from_name:      getVal(form, '[name="from_name"], input[placeholder*="full name"], input[placeholder*="name"]'),
    phone:          getVal(form, '[name="phone"], input[type="tel"]'),
    reply_to:       getVal(form, '[name="reply_to"], input[type="email"]') || 'Not provided',
    nationality:    getVal(form, '[name="nationality"], input[placeholder*="nationality"]') || 'Not provided',
    service:        getVal(form, '[name="service"]') || 'Not specified',
    contact_method: getVal(form, '[name="contact_method"]') || 'Not specified',
    message:        getVal(form, '[name="message"], textarea') || 'No message provided',
  };
 
  // Validate required fields
  if (!fields.from_name || !fields.phone || !fields.service || fields.service === '— Select a service —') {
    showError(form, 'Please fill in all required fields.');
    return;
  }
 
  // UI — loading state
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="spinner"></span> Sending...';
  btn.disabled = true;
  btn.style.opacity = '0.8';
  clearError(form);
 
  // Send via EmailJS
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, fields)
    .then(() => {
      // SUCCESS
      const wrapper = form.closest('.contact-form, .contact-form-card');
      const successEl = wrapper ? wrapper.querySelector('.form-success') : null;
 
      if (successEl) {
        form.style.display = 'none';
        successEl.style.display = 'block';
      } else {
        // Fallback inline success for home quick-enquiry
        btn.innerHTML = '✅ Sent Successfully!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        btn.style.opacity = '1';
        setTimeout(() => {
          form.reset();
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
          btn.style.opacity = '';
        }, 4000);
      }
    })
    .catch((error) => {
      // FAILURE
      console.error('EmailJS error:', error);
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.opacity = '';
      showError(form, '⚠️ Failed to send. Please try again or contact us via WhatsApp.');
    });
}
 
// Helper — get value from a field using multiple selector fallbacks
function getVal(form, selectors) {
  const el = form.querySelector(selectors);
  return el ? el.value.trim() : '';
}
 
// Show inline error message
function showError(form, msg) {
  clearError(form);
  const err = document.createElement('p');
  err.className = 'form-error-msg';
  err.textContent = msg;
  err.style.cssText = 'color:#e53e3e;font-size:13px;margin-bottom:12px;padding:10px 14px;background:#fff5f5;border-radius:6px;border-left:3px solid #e53e3e;';
  form.insertBefore(err, form.querySelector('[type="submit"]'));
}
 
function clearError(form) {
  const existing = form.querySelector('.form-error-msg');
  if (existing) existing.remove();
}
 
// Spinner CSS injected once
(function addSpinnerCSS() {
  const s = document.createElement('style');
  s.textContent = `
    .spinner {
      display: inline-block;
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      vertical-align: middle;
      margin-right: 6px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(s);
})();
 
// Init on DOM ready
document.addEventListener('DOMContentLoaded', initEmailJS);