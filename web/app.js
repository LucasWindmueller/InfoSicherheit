(function(){
  'use strict';

  const VALID_USER = 'Admin';
  const VALID_PASS = 'Admin123';

  const els = {
    loginScreen: document.getElementById('login-screen'),
    dbScreen: document.getElementById('db-screen'),
    form: document.getElementById('login-form'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    togglePw: document.getElementById('toggle-password'),
    error: document.getElementById('login-error'),
    logout: document.getElementById('logout'),
    filter: document.getElementById('filter'),
    exportCsv: document.getElementById('exportCsv'),
    tableBody: document.querySelector('#customers tbody'),
  };

  // Demo-Daten (rein fiktiv)
  const demoData = [
    { id: 'C-10041', name: 'Marta Seidel', email: 'marta.seidel@example.com', phone: '+49 40 123 4567', ship: 'MS Albatros', imo: '9384756', order: 'WO-241103-01', amount: 128450.75, iban: 'DE44500105175407324931' },
    { id: 'C-10058', name: 'Jörg Becker', email: 'joerg.becker@example.com', phone: '+49 471 55 90 120', ship: 'MV Nordstern', imo: '9135791', order: 'WO-241029-14', amount: 7850.00, iban: 'DE24500500001234567890' },
    { id: 'C-10063', name: 'Elena Kraus', email: 'elena.kraus@example.com', phone: '+49 521 90 12 33', ship: 'SS Hanseatic', imo: '9512044', order: 'WO-241022-03', amount: 56120.40, iban: 'DE27500604000000012345' },
    { id: 'C-10072', name: 'Tom Richter', email: 'tom.richter@example.com', phone: '+49 30 8899 1020', ship: 'MS Seegold', imo: '9723112', order: 'WO-241001-07', amount: 9120.00, iban: 'DE37500921001234567892' },
    { id: 'C-10077', name: 'Fatma Aydin', email: 'f.aydin@example.com', phone: '+49 40 6655 7788', ship: 'MV Baltic Pearl', imo: '9477120', order: 'WO-240918-11', amount: 222340.10, iban: 'DE16501204000000020000' },
    { id: 'C-10081', name: 'Henrik Wolf', email: 'h.wolf@example.com', phone: '+49 451 3110 221', ship: 'MS Elbwelle', imo: '9256071', order: 'WO-240906-02', amount: 15400.00, iban: 'DE33500700123456789012' },
    { id: 'C-10084', name: 'Svenja Krüger', email: 'svenja.krueger@example.com', phone: '+49 431 77 66 55', ship: 'MS Polarstern II', imo: '9900123', order: 'WO-240830-19', amount: 4870.99, iban: 'DE21500698761234567890' },
    { id: 'C-10090', name: 'Arne Hoffmann', email: 'arne.hoffmann@example.com', phone: '+49 4721 334455', ship: 'MV Seelachs', imo: '9321100', order: 'WO-240812-05', amount: 76300.00, iban: 'DE88500105170648489890' },
    { id: 'C-10092', name: 'Lea Brandt', email: 'lea.brandt@example.com', phone: '+49 211 230 4455', ship: 'SS Poseidon', imo: '9753129', order: 'WO-240802-04', amount: 30500.50, iban: 'DE09500800000000012345' },
    { id: 'C-10095', name: 'Yusuf Demir', email: 'yusuf.demir@example.com', phone: '+49 40 4010 3030', ship: 'MS Jadewind', imo: '9411570', order: 'WO-240729-01', amount: 18990.00, iban: 'DE12501234567890123456' },
  ];

  function maskIban(iban){
    if(!iban) return '';
    const keep = 4;
    const clean = String(iban).replace(/\s+/g,'');
    const start = clean.slice(0,2);
    const end = clean.slice(-keep);
    const hidden = clean.slice(2, -keep).replace(/./g, '•');
    return [start, hidden, end].join('');
  }

  function formatAmount(n){
    try { return new Intl.NumberFormat('de-DE', { style:'currency', currency:'EUR' }).format(n); }
    catch(_) { return `${n.toFixed(2)} €`; }
  }

  function rowToArray(r){
    return [r.id, r.name, r.email, r.phone, r.ship, r.imo, r.order, formatAmount(r.amount), maskIban(r.iban)];
  }

  function renderTable(rows){
    const frag = document.createDocumentFragment();
    for(const r of rows){
      const tr = document.createElement('tr');
      for(const cell of rowToArray(r)){
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      }
      frag.appendChild(tr);
    }
    els.tableBody.innerHTML = '';
    els.tableBody.appendChild(frag);
  }

  function filterTable(q){
    const query = q.trim().toLowerCase();
    if(!query){ renderTable(demoData); return; }
    const filtered = demoData.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(query)));
    renderTable(filtered);
  }

  function toCsv(rows){
    const header = ['Kundennr','Name','E-Mail','Telefon','Schiff','IMO','Auftragsnr','Betrag','IBAN(maskiert)'];
    const lines = [header.map(s => '"'+s.replace(/"/g,'""')+'"').join(',')];
    for(const r of rows){
      const cells = rowToArray(r).map(s => '"'+String(s).replace(/"/g,'""')+'"');
      lines.push(cells.join(','));
    }
    return lines.join('\n');
  }

  function download(filename, text){
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8;' }));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  function setLoggedIn(on){
    els.loginScreen.hidden = !!on;
    els.dbScreen.hidden = !on;
    if(on){ renderTable(demoData); }
  }

  // Event wiring
  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = els.username.value.trim();
    const p = els.password.value;
    if(u === VALID_USER && p === VALID_PASS){
      els.error.hidden = true;
      sessionStorage.setItem('demo_logged_in', '1');
      setLoggedIn(true);
      els.filter.focus();
    } else {
      els.error.hidden = false;
    }
  });

  els.togglePw.addEventListener('click', () => {
    const show = els.password.type === 'password';
    els.password.type = show ? 'text' : 'password';
    els.togglePw.setAttribute('aria-pressed', String(show));
  });

  els.logout.addEventListener('click', () => {
    sessionStorage.removeItem('demo_logged_in');
    els.form.reset();
    setLoggedIn(false);
    els.username.focus();
  });

  els.filter.addEventListener('input', () => filterTable(els.filter.value));

  els.exportCsv.addEventListener('click', () => {
    const q = els.filter.value.trim().toLowerCase();
    const rows = q ? demoData.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q))) : demoData;
    const csv = toCsv(rows);
    download('kundendaten_demo.csv', csv);
  });

  // Init on load
  const wasLogged = sessionStorage.getItem('demo_logged_in') === '1';
  setLoggedIn(wasLogged);
})();

