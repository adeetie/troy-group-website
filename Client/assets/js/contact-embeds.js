// ===== Contact Embeds Logic =====
document.addEventListener('DOMContentLoaded', function () {
  // Tabs
  const tabs = document.querySelectorAll('.contact-tabs .ctab');
  const panels = document.querySelectorAll('.contact-panel');
  tabs.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      tabs.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.dataset.panel;
      panels.forEach(p=>p.classList.toggle('d-none', p.id !== id));
    });
  });

  // Listen for Calendly events (postMessage)
  window.addEventListener('message', function(e){
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.event !== 'calendly.event_scheduled') return;

    // Save minimal details for thank-you card (payload varies; keep it defensive)
    const payload = e.data.payload || {};
    // Some installs include invitee event details via a follow-up fetch; here we keep what we can.
    const info = {
      title: 'Scheduled Meeting',
      name: (payload?.invitee?.name || 'Guest'),
      email: (payload?.invitee?.email || ''),
      start: (payload?.event?.start_time || ''), // ISO or empty
      location: 'Web conference details to follow'
    };
    try { localStorage.setItem('troy_last_meeting', JSON.stringify(info)); } catch(_){}

    // Redirect to thank you
    window.location.href = './thankyou.html?from=calendly';
  }, false);
});
document.addEventListener('DOMContentLoaded', function(){
  const params = new URLSearchParams(location.search);
  const from = params.get('from') || '';
  // If we came from Calendly, show the meeting card
  if (from === 'calendly') {
    const card = document.getElementById('tyMeeting');
    if (card) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let data = {};
      try { data = JSON.parse(localStorage.getItem('troy_last_meeting') || '{}'); } catch(_) {}
      // Render safely
      document.getElementById('tmName').textContent = data.name || 'Guest';
      document.getElementById('tmLoc').textContent  = data.location || 'Web conferencing details to follow.';
      document.getElementById('tmTz').textContent   = tz;
      // Format ISO time if present
      const when = data.start ? new Date(data.start) : null;
      document.getElementById('tmWhen').textContent = when
        ? when.toLocaleString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })
        : 'Time confirmed via email.';
      card.style.display = '';
    }
  }
});

