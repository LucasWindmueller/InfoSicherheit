(function(){
  'use strict';

  const VALID_USER = 'Admin';
  const VALID_PASS = 'Admin123';
  const VALID_2FA = '1234';

  const els = {
    loginScreen: document.getElementById('login-screen'),
    twofaScreen: document.getElementById('twofa-screen'),
    dbScreen: document.getElementById('db-screen'),
    form: document.getElementById('login-form'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    togglePw: document.getElementById('toggle-password'),
    error: document.getElementById('login-error'),
    // 2FA
    twofaForm: document.getElementById('twofa-form'),
    twofaCode: document.getElementById('twofa-code'),
    twofaError: document.getElementById('twofa-error'),
    twofaCancel: document.getElementById('twofa-cancel'),
    // DB
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

  function formatAmount(n){
    try { return new Intl.NumberFormat('de-DE', { style:'currency', currency:'EUR' }).format(n); }
    catch(_) { return `${n.toFixed(2)} €`; }
  }

  function rowToArray(r){
    return [r.id, r.name, r.email, r.phone, r.ship, r.imo, r.order, formatAmount(r.amount), r.iban];
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
    const header = ['Kundennr','Name','E-Mail','Telefon','Schiff','IMO','Auftragsnr','Betrag','IBAN'];
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

  function show(view){
    els.loginScreen.hidden = view !== 'login';
    els.twofaScreen.hidden = view !== '2fa';
    els.dbScreen.hidden = view !== 'db';
  }

  function setLoggedIn(on){
    sessionStorage.setItem('demo_logged_in', on ? '1' : '0');
    if(on){
      show('db');
      renderTable(demoData);
    } else {
      show('login');
    }
  }

  // Event wiring
  // 1) Login -> 2FA Bildschirm
  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = els.username.value.trim();
    const p = els.password.value;
    if(u === VALID_USER && p === VALID_PASS){
      els.error.hidden = true;
      show('2fa');
      els.twofaCode.value = '';
      els.twofaError.hidden = true;
      setTimeout(() => els.twofaCode.focus(), 0);
    } else {
      els.error.hidden = false;
    }
  });

  // 2) 2FA prüfen -> DB
  els.twofaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = els.twofaCode.value.trim();
    if(code === VALID_2FA){
      els.twofaError.hidden = true;
      setLoggedIn(true);
      els.filter.value = '';
      setTimeout(() => els.filter.focus(), 0);
    } else {
      els.twofaError.hidden = false;
    }
  });

  // 3) 2FA abbrechen -> zurück zum Login
  els.twofaCancel.addEventListener('click', () => {
    show('login');
    els.password.value = '';
    els.twofaCode.value = '';
    els.twofaError.hidden = true;
    setTimeout(() => els.username.focus(), 0);
  });

  // Passwort anzeigen/ausblenden
  els.togglePw.addEventListener('click', () => {
    const showPw = els.password.type === 'password';
    els.password.type = showPw ? 'text' : 'password';
    els.togglePw.setAttribute('aria-pressed', String(showPw));
  });

  // Abmelden
  els.logout.addEventListener('click', () => {
    setLoggedIn(false);
    els.form.reset();
    els.twofaForm.reset();
    els.error.hidden = true;
  });

  // Filter
  els.filter.addEventListener('input', () => filterTable(els.filter.value));

  // CSV Export
  els.exportCsv.addEventListener('click', () => {
    const q = els.filter.value.trim().toLowerCase();
    const rows = q ? demoData.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q))) : demoData;
    download('kundendaten_demo.csv', toCsv(rows));
  });

  // Init
  const wasLogged = sessionStorage.getItem('demo_logged_in') === '1';
  if(wasLogged){
    setLoggedIn(true);
  } else {
    show('login');
    setTimeout(() => els.username && els.username.focus(), 0);
  }
})();
