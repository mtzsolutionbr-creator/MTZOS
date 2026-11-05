const EMPRESA = {
  nome: "MTZ SoluÃ§Ãµes em Tecnologia",
  tecnico: "Emerson Martinez",
  telefone: "(11) 94978-9772",
  endereco: "TV Papa Paulo I, 41 â€“ Vila Anita Costa, Jandira - SP",
  cnpj: ""
};

let db = null;
let ordens = [];
let clientes = [];
let editingId = null;
let unsubOrdens = null, unsubClientes = null, unsubPresetServicos = null, unsubPresetPecas = null, unsubPresetEquip = null, unsubConfig = null, unsubEmpresa = null;
let downloadsCap = null;
let configCampos = {cepObrigatorio:false, documentoObrigatorio:false};

const PRESETS_SERVICOS_PADRAO = [
 {
  "descricao": "DiagnÃ³stico tÃ©cnico completo",
  "valor": 60
 },
 {
  "descricao": "FormataÃ§Ã£o e reinstalaÃ§Ã£o do sistema operacional (com drivers)",
  "valor": 120
 },
 {
  "descricao": "FormataÃ§Ã£o com backup prÃ©vio dos dados",
  "valor": 160
 },
 {
  "descricao": "InstalaÃ§Ã£o e configuraÃ§Ã£o de programas",
  "valor": 50
 },
 {
  "descricao": "RemoÃ§Ã£o de vÃ­rus e malwares",
  "valor": 90
 },
 {
  "descricao": "Limpeza fÃ­sica interna e troca de pasta tÃ©rmica (desktop)",
  "valor": 100
 },
 {
  "descricao": "Limpeza fÃ­sica interna e troca de pasta tÃ©rmica (notebook)",
  "valor": 150
 },
 {
  "descricao": "Backup de dados do usuÃ¡rio",
  "valor": 80
 },
 {
  "descricao": "InstalaÃ§Ã£o e configuraÃ§Ã£o de antivÃ­rus",
  "valor": 50
 },
 {
  "descricao": "AtualizaÃ§Ã£o do sistema operacional e drivers",
  "valor": 70
 },
 {
  "descricao": "Montagem de computador",
  "valor": 150
 },
 {
  "descricao": "InstalaÃ§Ã£o de SSD/HD com clonagem do sistema",
  "valor": 120
 },
 {
  "descricao": "InstalaÃ§Ã£o de memÃ³ria RAM (mÃ£o de obra)",
  "valor": 50
 },
 {
  "descricao": "Troca de tela de notebook (mÃ£o de obra)",
  "valor": 150
 },
 {
  "descricao": "Troca de teclado de notebook (mÃ£o de obra)",
  "valor": 100
 },
 {
  "descricao": "Troca de peÃ§a com testes de funcionamento",
  "valor": 80
 },
 {
  "descricao": "ConfiguraÃ§Ã£o de impressora",
  "valor": 60
 },
 {
  "descricao": "InstalaÃ§Ã£o de impressora em rede/Wi-Fi",
  "valor": 80
 },
 {
  "descricao": "ManutenÃ§Ã£o de impressora jato de tinta (limpeza e desobstruÃ§Ã£o)",
  "valor": 150
 },
 {
  "descricao": "ManutenÃ§Ã£o de impressora laser (limpeza e revisÃ£o)",
  "valor": 180
 },
 {
  "descricao": "ManutenÃ§Ã£o de impressora tÃ©rmica/etiquetas (limpeza do cabeÃ§ote e calibraÃ§Ã£o)",
  "valor": 130
 },
 {
  "descricao": "Reset de contador / almofada de absorÃ§Ã£o",
  "valor": 120
 },
 {
  "descricao": "ConfiguraÃ§Ã£o de rede e Wi-Fi",
  "valor": 100
 },
 {
  "descricao": "ConfiguraÃ§Ã£o de roteador/modem",
  "valor": 80
 },
 {
  "descricao": "InstalaÃ§Ã£o e configuraÃ§Ã£o de access point / mesh",
  "valor": 120
 },
 {
  "descricao": "InstalaÃ§Ã£o de ponto de rede (mÃ£o de obra por ponto, material Ã  parte)",
  "valor": 120
 },
 {
  "descricao": "OrganizaÃ§Ã£o de rack e patch panel",
  "valor": 250
 },
 {
  "descricao": "ConfiguraÃ§Ã£o de switch gerenciÃ¡vel / VLAN",
  "valor": 250
 },
 {
  "descricao": "ConfiguraÃ§Ã£o de roteador MikroTik / firewall",
  "valor": 350
 },
 {
  "descricao": "ConfiguraÃ§Ã£o de failover / balanceamento de links",
  "valor": 450
 },
 {
  "descricao": "ConfiguraÃ§Ã£o de VPN",
  "valor": 300
 },
 {
  "descricao": "Compartilhamento de pastas e permissÃµes em rede",
  "valor": 100
 },
 {
  "descricao": "DiagnÃ³stico de rede (lentidÃ£o ou quedas)",
  "valor": 150
 },
 {
  "descricao": "Visita tÃ©cnica / deslocamento",
  "valor": 80
 },
 {
  "descricao": "Hora tÃ©cnica adicional",
  "valor": 100
 }
];
const PRESETS_PECAS_PADRAO = [
 {
  "descricao": "Fonte ATX 500W",
  "valor": 180
 },
 {
  "descricao": "MemÃ³ria RAM 8GB DDR4",
  "valor": 170
 },
 {
  "descricao": "SSD 240GB",
  "valor": 150
 },
 {
  "descricao": "HD 1TB",
  "valor": 250
 },
 {
  "descricao": "Cooler para processador",
  "valor": 80
 },
 {
  "descricao": "Pasta tÃ©rmica",
  "valor": 25
 },
 {
  "descricao": "Cabo de rede Cat5e (metro)",
  "valor": 2
 },
 {
  "descricao": "Bateria CMOS",
  "valor": 15
 },
 {
  "descricao": "Teclado USB",
  "valor": 60
 },
 {
  "descricao": "Mouse USB",
  "valor": 40
 },
 {
  "descricao": "SSD 480GB",
  "valor": 280
 },
 {
  "descricao": "MemÃ³ria RAM 8GB DDR4 para notebook (SODIMM)",
  "valor": 190
 },
 {
  "descricao": "Carregador para notebook (compatÃ­vel)",
  "valor": 150
 },
 {
  "descricao": "Bateria para notebook",
  "valor": 220
 },
 {
  "descricao": "Teclado para notebook",
  "valor": 150
 },
 {
  "descricao": "Tela de notebook 15.6\"",
  "valor": 380
 },
 {
  "descricao": "Cabo de rede Cat6 (metro)",
  "valor": 4
 },
 {
  "descricao": "Conector RJ45 (unidade)",
  "valor": 3
 },
 {
  "descricao": "Tomada RJ45 Cat6 (keystone)",
  "valor": 25
 },
 {
  "descricao": "Patch cord Cat6 1,5m",
  "valor": 20
 },
 {
  "descricao": "Patch panel 24 portas",
  "valor": 250
 },
 {
  "descricao": "Switch 8 portas Gigabit",
  "valor": 170
 },
 {
  "descricao": "Switch 16 portas Gigabit",
  "valor": 350
 },
 {
  "descricao": "Roteador Wi-Fi AC1200",
  "valor": 220
 },
 {
  "descricao": "Access point Wi-Fi 6",
  "valor": 450
 },
 {
  "descricao": "Cabo USB para impressora",
  "valor": 20
 },
 {
  "descricao": "Cabo HDMI 1,5m",
  "valor": 30
 }
];
const PRESETS_PECAS_EXTRA = [
 {
  "descricao": "Nobreak 600VA",
  "valor": 380
 },
 {
  "descricao": "Estabilizador 300VA",
  "valor": 120
 },
 {
  "descricao": "Monitor 19\" LED",
  "valor": 500
 },
 {
  "descricao": "Monitor 24\" Full HD",
  "valor": 650
 },
 {
  "descricao": "Kit teclado e mouse sem fio",
  "valor": 110
 },
 {
  "descricao": "Webcam Full HD",
  "valor": 130
 },
 {
  "descricao": "Headset USB com microfone",
  "valor": 90
 },
 {
  "descricao": "HD externo 1TB",
  "valor": 330
 },
 {
  "descricao": "Pen drive 32GB",
  "valor": 45
 },
 {
  "descricao": "Adaptador Wi-Fi USB",
  "valor": 60
 },
 {
  "descricao": "Placa de rede Gigabit PCI-E",
  "valor": 60
 },
 {
  "descricao": "Cabo VGA 1,8m",
  "valor": 25
 },
 {
  "descricao": "Cabo SATA",
  "valor": 12
 },
 {
  "descricao": "Cabo de forÃ§a para computador",
  "valor": 15
 },
 {
  "descricao": "Garrafa de tinta (refil)",
  "valor": 55
 },
 {
  "descricao": "Toner compatÃ­vel (impressora laser)",
  "valor": 150
 },
 {
  "descricao": "Ribbon para impressora de etiquetas",
  "valor": 45
 },
 {
  "descricao": "Rack de parede 5U",
  "valor": 350
 },
 {
  "descricao": "Canaleta (metro)",
  "valor": 8
 },
 {
  "descricao": "Caixa de cabo de rede Cat5e (305m)",
  "valor": 420
 }
];
const PRESETS_EQUIPAMENTOS_PADRAO = [
 "Computador desktop",
 "Notebook",
 "Notebook Dell",
 "Notebook Lenovo",
 "Notebook HP",
 "Notebook Acer",
 "Notebook Asus",
 "Notebook Samsung",
 "Notebook Positivo",
 "MacBook / iMac",
 "All-in-one",
 "Servidor",
 "Monitor",
 "Nobreak",
 "Estabilizador",
 "Impressora jato de tinta (HP)",
 "Impressora tanque de tinta (Epson EcoTank)",
 "Impressora Canon",
 "Impressora Brother",
 "Impressora multifuncional laser",
 "Impressora laser monocromÃ¡tica",
 "Impressora tÃ©rmica de etiquetas",
 "Impressora tÃ©rmica de cupom",
 "Leitor de cÃ³digo de barras",
 "Roteador Wi-Fi",
 "Roteador MikroTik",
 "Access point",
 "Switch",
 "Modem / ONU (fibra)",
 "Rack / patch panel",
 "HD externo / NAS"
];
let presetsServicos = [];
let presetsEquipamentos = [];
let presetsPecas = [];

function fmtMoney(v){
  return "R$ " + (Number(v)||0).toLocaleString('pt-BR',{minimumFractionDigits:2, maximumFractionDigits:2});
}
function fmtDate(iso){
  if(!iso) return "";
  const [y,m,d] = iso.split("-");
  return d+"/"+m+"/"+y;
}
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
}
function uid(){ return 'i'+Math.random().toString(36).slice(2,9); }

// ---------- Tabs ----------
document.querySelectorAll('nav.tabs button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    ['novo','historico','clientes'].forEach(t=>{
      document.getElementById('tab-'+t).style.display = (t===btn.dataset.tab)?'block':'none';
    });
    if(btn.dataset.tab==='historico') renderHistorico();
    if(btn.dataset.tab==='clientes') renderClientes();
  });
});

// ---------- Itens de valor ----------
function addItemRow(desc, valor){
  const wrap = document.getElementById('itensList');
  const row = document.createElement('div');
  row.className = 'item-row';
  row.innerHTML = `
    <input type="text" placeholder="DescriÃ§Ã£o do item" class="itDesc" value="${desc?desc.replace(/"/g,'&quot;'):''}">
    <input type="number" placeholder="0,00" step="0.01" class="itValor" value="${valor!==undefined?valor:''}">
    <button class="icon-btn" title="Remover">âœ•</button>
  `;
  row.querySelector('.icon-btn').addEventListener('click', ()=>{ row.remove(); recalcTotal(); });
  row.querySelector('.itValor').addEventListener('input', recalcTotal);
  wrap.appendChild(row);
}
document.getElementById('addItem').addEventListener('click', ()=> addItemRow('', ''));
function recalcTotal(){
  let total = 0;
  document.querySelectorAll('.itValor').forEach(inp=>{ total += Number(inp.value)||0; });
  document.getElementById('totalDisplay').textContent = fmtMoney(total);
  const entrada = Number(document.getElementById('fEntrada').value)||0;
  const sd = document.getElementById('saldoDisplay');
  if(entrada > 0){
    const pct = total > 0 ? Math.round(entrada/total*100) : 0;
    sd.textContent = 'Entrada de ' + fmtMoney(entrada) + (total>0 ? ' ('+pct+'% do total)' : '') + ' â€” saldo na entrega: ' + fmtMoney(Math.max(total-entrada,0));
  } else {
    sd.textContent = '';
  }
  return total;
}
document.getElementById('fEntrada').addEventListener('input', recalcTotal);
document.querySelectorAll('[data-pct]').forEach(b=>{
  b.addEventListener('click', ()=>{
    const total = recalcTotal();
    document.getElementById('fEntrada').value = (Math.round(total*Number(b.dataset.pct))/100).toFixed(2);
    recalcTotal();
  });
});
function coletarItens(){
  const itens = [];
  document.querySelectorAll('.item-row').forEach(row=>{
    const desc = row.querySelector('.itDesc').value.trim();
    const valor = Number(row.querySelector('.itValor').value)||0;
    if(desc || valor) itens.push({descricao: desc, valor: valor});
  });
  return itens;
}

// ---------- ServiÃ§os e peÃ§as padrÃ£o (presets) ----------
function renderEquipSelect(){
  const sel = document.getElementById('equipPresetSelect');
  if(!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">+ Inserir equipamento padrÃ£o...</option>' +
    presetsEquipamentos.map(p=>`<option value="${p.id}">${(p.descricao||'').replace(/&/g,'&amp;').replace(/</g,'&lt;')}</option>`).join('');
  sel.value = cur && presetsEquipamentos.some(p=>p.id===cur) ? cur : '';
}
document.getElementById('equipPresetSelect').addEventListener('change', (e)=>{
  const p = presetsEquipamentos.find(x=>x.id===e.target.value);
  if(p){
    const inp = document.getElementById('fEquip');
    inp.value = inp.value.trim() ? inp.value.trim() + ', ' + p.descricao : p.descricao + ' ';
    inp.focus();
  }
  e.target.value = '';
});

function abrirGerenciarEquipamentos(){
  const modalRoot = document.getElementById('modalRoot');
  renderGerenciarEquipModal();
}
function renderGerenciarEquipModal(){
  const modalRoot = document.getElementById('modalRoot');
  const esc = t => (t||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const rowsHtml = presetsEquipamentos.length ? presetsEquipamentos.map(p=>`
    <div class="preset-manage-row" data-id="${p.id}" style="grid-template-columns:1fr 34px 34px;">
      <input type="text" class="presetDescInp" value="${esc(p.descricao)}" style="margin:0;padding:6px 8px;font-size:13px;">
      <button class="icon-btn" title="Salvar alteraÃ§Ãµes" data-save="${p.id}" style="color:var(--ok);">âœ”</button>
      <button class="icon-btn" title="Remover" data-del="${p.id}">âœ•</button>
    </div>`).join('') : '<div class="empty">Nenhum equipamento cadastrado ainda.</div>';
  modalRoot.innerHTML = `
  <div class="modal-bg" id="modalBgEquip">
    <div class="modal" style="max-width:520px;">
      <div class="modal-head">
        <div><strong>Equipamentos padrÃ£o</strong></div>
        <button class="close-x" id="closeModalEquip">âœ•</button>
      </div>
      <div class="modal-body">
        <div style="padding:14px 18px 0;"><div class="preset-manage-list">${rowsHtml}</div></div>
        <div class="preset-add-row" style="grid-template-columns:1fr auto;">
          <input type="text" id="novoEquipDesc" placeholder="Novo equipamento padrÃ£o">
          <button class="btn btn-primary btn-sm" id="novoEquipAdd">+ Adicionar</button>
        </div>
        <div style="padding:0 12px 14px;">
          <button class="btn btn-outline btn-sm" id="equipImportar" type="button" style="width:100%;">Carregar lista sugerida MTZ</button>
          <div class="muted-small" style="margin-top:6px;">Adiciona sÃ³ o que ainda nÃ£o existe. Para mudar um nome, edite na lista e clique no âœ” (ou Enter).</div>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('closeModalEquip').addEventListener('click', ()=> modalRoot.innerHTML='');
  document.getElementById('modalBgEquip').addEventListener('click', (e)=>{ if(e.target.id==='modalBgEquip') modalRoot.innerHTML=''; });
  modalRoot.querySelectorAll('[data-del]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      if(!db) return;
      try{ await db.doc('presetsEquipamentos/'+btn.dataset.del).delete(); toast('Removido'); }
      catch(e){ toast('Erro ao remover'); }
    });
  });
  modalRoot.querySelectorAll('[data-save]').forEach(btn=>{
    const row = btn.closest('.preset-manage-row');
    const salvar = async ()=>{
      const desc = row.querySelector('.presetDescInp').value.trim();
      if(!desc){ toast('A descriÃ§Ã£o nÃ£o pode ficar vazia'); return; }
      if(!db){ toast('Sem conexÃ£o com o armazenamento agora.'); return; }
      try{ await db.doc('presetsEquipamentos/'+btn.dataset.save).update({descricao: desc}); toast('AlteraÃ§Ãµes salvas'); }
      catch(e){ toast('Erro ao salvar'); }
    };
    btn.addEventListener('click', salvar);
    row.querySelector('input').addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); salvar(); } });
  });
  const adicionar = async ()=>{
    const desc = document.getElementById('novoEquipDesc').value.trim();
    if(!desc){ toast('Informe a descriÃ§Ã£o'); return; }
    if(!db){ toast('Sem conexÃ£o com o armazenamento agora.'); return; }
    try{ await db.doc('presetsEquipamentos/'+uid()).set({descricao: desc, criadoEm: Date.now()}); toast('Equipamento adicionado'); }
    catch(e){ toast('Erro ao adicionar'); }
  };
  document.getElementById('novoEquipAdd').addEventListener('click', adicionar);
  document.getElementById('novoEquipDesc').addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); adicionar(); } });
  document.getElementById('equipImportar').addEventListener('click', async ()=>{
    if(!db){ toast('Sem conexÃ£o com o armazenamento agora.'); return; }
    const norm = t => (t||'').toLowerCase().replace(/\s+/g,' ').trim();
    let novos = 0;
    try{
      for(const d of PRESETS_EQUIPAMENTOS_PADRAO){
        if(!presetsEquipamentos.some(p => norm(p.descricao) === norm(d))){
          await db.doc('presetsEquipamentos/'+uid()).set({descricao: d, criadoEm: Date.now()});
          novos++;
        }
      }
      toast(novos+' equipamentos adicionados');
    }catch(e){ toast('Erro ao carregar a lista'); }
  });
}
document.getElementById('gerenciarEquip').addEventListener('click', abrirGerenciarEquipamentos);

function renderPresetSelects(){
  const selServ = document.getElementById('servicoPresetSelect');
  const cur1 = selServ.value;
  selServ.innerHTML = '<option value="">+ Inserir serviÃ§o padrÃ£o...</option>' +
    presetsServicos.map(p=>`<option value="${p.id}">${(p.descricao||'').replace(/</g,'&lt;')}${p.valor>0?' â€” '+fmtMoney(p.valor):''}</option>`).join('');
  selServ.value = cur1 && presetsServicos.some(p=>p.id===cur1) ? cur1 : '';

  const selPeca = document.getElementById('pecaPresetSelect');
  const cur2 = selPeca.value;
  selPeca.innerHTML = '<option value="">+ Inserir peÃ§a padrÃ£o...</option>' +
    presetsPecas.map(p=>`<option value="${p.id}">${(p.descricao||'').replace(/</g,'&lt;')} â€” ${fmtMoney(p.valor)}</option>`).join('');
  selPeca.value = cur2 && presetsPecas.some(p=>p.id===cur2) ? cur2 : '';
}

document.getElementById('servicoPresetSelect').addEventListener('change', (e)=>{
  const id = e.target.value;
  if(!id) return;
  const p = presetsServicos.find(x=>x.id===id);
  if(p){
    const ta = document.getElementById('fServicos');
    ta.value = ta.value.trim() ? ta.value.replace(/\n+$/,'') + '\n' + p.descricao : p.descricao;
    if(p.valor > 0){
      const rows = document.querySelectorAll('#itensList .item-row');
      const last = rows[rows.length-1];
      const lastEmpty = last && !last.querySelector('.itDesc').value.trim() && !last.querySelector('.itValor').value;
      if(lastEmpty){ last.remove(); }
      addItemRow(p.descricao, p.valor);
      recalcTotal();
    }
  }
  e.target.value = '';
});

document.getElementById('pecaPresetSelect').addEventListener('change', (e)=>{
  const id = e.target.value;
  if(!id) return;
  const p = presetsPecas.find(x=>x.id===id);
  if(p){
    const rows = document.querySelectorAll('#itensList .item-row');
    const last = rows[rows.length-1];
    const lastEmpty = last && !last.querySelector('.itDesc').value.trim() && !last.querySelector('.itValor').value;
    if(lastEmpty){ last.remove(); }
    addItemRow(p.descricao, p.valor);
    recalcTotal();
  }
  e.target.value = '';
});

async function seedPresetsSeNecessario(){
  if(!db) return;
  try{
    const snapS = await db.collection('presetsServicos').get();
    if(!snapS.docs || !snapS.docs.length){
      for(const it of PRESETS_SERVICOS_PADRAO){
        await db.doc('presetsServicos/'+uid()).set({descricao: it.descricao, valor: it.valor, criadoEm: Date.now()});
      }
    }
  }catch(e){}
  try{
    const snapP = await db.collection('presetsPecas').get();
    if(!snapP.docs || !snapP.docs.length){
      for(const it of PRESETS_PECAS_PADRAO.concat(PRESETS_PECAS_EXTRA)){
        await db.doc('presetsPecas/'+uid()).set({descricao: it.descricao, valor: it.valor, criadoEm: Date.now()});
      }
    }
  }catch(e){}
  try{
    const snapE = await db.collection('presetsEquipamentos').get();
    if(!snapE.docs || !snapE.docs.length){
      for(const d of PRESETS_EQUIPAMENTOS_PADRAO){
        await db.doc('presetsEquipamentos/'+uid()).set({descricao: d, criadoEm: Date.now()});
      }
    }
  }catch(e){}
  await migrarPresetsComValor();
}

// Uma Ãºnica vez: completa a lista com os padrÃµes sugeridos e preenche o valor mÃ©dio
// dos itens antigos que estavam sem preÃ§o. Depois disso, o que vocÃª editar ou apagar nÃ£o Ã© refeito.
async function migrarPresetsComValor(){
  try{
    const flag = await db.doc('config/presetsMigracao').get();
    const v = flag.exists && flag.data() ? (flag.data().v||0) : 0;
    if(v >= 3) return;
    const norm = t => (t||'').toLowerCase().replace(/\s+/g,' ').trim();
    if(v < 2){
      const grupos = [
        ['presetsServicos', PRESETS_SERVICOS_PADRAO],
        ['presetsPecas', PRESETS_PECAS_PADRAO]
      ];
      for(const [col, sugeridos] of grupos){
        const snap = await db.collection(col).get();
        const existentes = snap.docs.map(d=>({id:d.id, ...d.data()}));
        for(const it of sugeridos){
          const ex = existentes.find(p => norm(p.descricao) === norm(it.descricao));
          if(!ex){
            await db.doc(col+'/'+uid()).set({descricao: it.descricao, valor: it.valor, criadoEm: Date.now()});
          } else if(!(ex.valor > 0)){
            await db.doc(col+'/'+ex.id).update({valor: it.valor});
          }
        }
      }
    }
    // v3: peÃ§as e equipamentos adicionais
    const snapP = await db.collection('presetsPecas').get();
    const pecas = snapP.docs.map(d=>d.data());
    for(const it of PRESETS_PECAS_EXTRA){
      if(!pecas.some(p => norm(p.descricao) === norm(it.descricao))){
        await db.doc('presetsPecas/'+uid()).set({descricao: it.descricao, valor: it.valor, criadoEm: Date.now()});
      }
    }
    await db.doc('config/presetsMigracao').set({v: 3, em: Date.now()});
  }catch(e){}
}

function abrirGerenciarPresets(tipo){
  const modalRoot = document.getElementById('modalRoot');
  const isServ = tipo === 'servicos';
  renderGerenciarPresetsModal(isServ);
  document.getElementById('closeModalPreset').addEventListener('click', ()=> modalRoot.innerHTML='');
  document.getElementById('modalBgPreset').addEventListener('click', (e)=>{ if(e.target.id==='modalBgPreset') modalRoot.innerHTML=''; });
}

function renderGerenciarPresetsModal(isServ){
  const modalRoot = document.getElementById('modalRoot');
  const lista = isServ ? presetsServicos : presetsPecas;
  const rowsHtml = lista.length ? lista.map(p=>`
    <div class="preset-manage-row" data-id="${p.id}">
      <input type="text" class="presetDescInp" value="${(p.descricao||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}" style="margin:0;padding:6px 8px;font-size:13px;">
      <input type="number" step="0.01" class="presetValorInp" value="${p.valor!==undefined?p.valor:''}" placeholder="0,00" style="margin:0;padding:6px 8px;font-size:13px;">
      <button class="icon-btn" title="Salvar alteraÃ§Ãµes" data-save="${p.id}" style="color:var(--ok);">âœ”</button>
      <button class="icon-btn" title="Remover" data-del="${p.id}">âœ•</button>
    </div>`).join('') : '<div class="empty">Nenhum padrÃ£o cadastrado ainda.</div>';

  modalRoot.innerHTML = `
  <div class="modal-bg" id="modalBgPreset">
    <div class="modal" style="max-width:520px;">
      <div class="modal-head">
        <div><strong>${isServ ? 'ServiÃ§os padrÃ£o' : 'PeÃ§as padrÃ£o'}</strong></div>
        <button class="close-x" id="closeModalPreset">âœ•</button>
      </div>
      <div class="modal-body">
        <div style="padding:14px 18px 0;">
          <div class="preset-manage-list">${rowsHtml}</div>
        </div>
        <div class="preset-add-row">
          <input type="text" id="novoPresetDesc" placeholder="${isServ?'Novo serviÃ§o padrÃ£o':'Nova peÃ§a padrÃ£o'}">
          <input type="number" id="novoPresetValor" placeholder="0,00" step="0.01">
          <button class="btn btn-primary btn-sm" id="novoPresetAdd">+ Adicionar</button>
        </div>
        <div style="padding:0 12px 14px;">
          <button class="btn btn-outline btn-sm" id="presetImportar" type="button" style="width:100%;">Carregar lista sugerida MTZ (valores mÃ©dios da regiÃ£o)</button>
          <div class="muted-small" style="margin-top:6px;">Adiciona sÃ³ o que ainda nÃ£o existe e preenche o valor dos que estÃ£o sem preÃ§o. Para mudar nome ou valor, edite na lista acima e clique no âœ” (ou aperte Enter).</div>
        </div>
      </div>
    </div>
  </div>`;

  modalRoot.querySelectorAll('[data-del]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const id = btn.dataset.del;
      if(!db) return;
      try{
        await db.doc((isServ?'presetsServicos/':'presetsPecas/')+id).delete();
        toast('Removido');
      }catch(e){ toast('Erro ao remover'); }
    });
  });

  modalRoot.querySelectorAll('[data-save]').forEach(btn=>{
    const row = btn.closest('.preset-manage-row');
    const salvar = async ()=>{
      if(!db){ toast('Sem conexÃ£o com o armazenamento agora.'); return; }
      const desc = row.querySelector('.presetDescInp').value.trim();
      const valor = Number(row.querySelector('.presetValorInp').value)||0;
      if(!desc){ toast('A descriÃ§Ã£o nÃ£o pode ficar vazia'); return; }
      try{
        await db.doc((isServ?'presetsServicos/':'presetsPecas/')+btn.dataset.save).update({descricao: desc, valor: valor});
        toast('AlteraÃ§Ãµes salvas');
      }catch(e){ toast('Erro ao salvar'); }
    };
    btn.addEventListener('click', salvar);
    row.querySelectorAll('input').forEach(inp=>{
      inp.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); salvar(); } });
    });
  });

  document.getElementById('presetImportar').addEventListener('click', async ()=>{
    if(!db){ toast('Sem conexÃ£o com o armazenamento agora.'); return; }
    if(!confirm('Carregar a lista sugerida? SÃ³ serÃ£o adicionados os itens que ainda nÃ£o existem.')) return;
    const norm = t => (t||'').toLowerCase().replace(/\s+/g,' ').trim();
    const sugeridos = isServ ? PRESETS_SERVICOS_PADRAO : PRESETS_PECAS_PADRAO.concat(PRESETS_PECAS_EXTRA);
    const lista = isServ ? presetsServicos : presetsPecas;
    const col = isServ ? 'presetsServicos/' : 'presetsPecas/';
    let novos = 0, atualizados = 0;
    try{
      for(const it of sugeridos){
        const ex = lista.find(p => norm(p.descricao) === norm(it.descricao));
        if(!ex){
          await db.doc(col+uid()).set({descricao: it.descricao, valor: it.valor, criadoEm: Date.now()});
          novos++;
        } else if(!(ex.valor > 0)){
          await db.doc(col+ex.id).update({valor: it.valor});
          atualizados++;
        }
      }
      toast(novos+' adicionados, '+atualizados+' com valor preenchido');
    }catch(e){ toast('Erro ao carregar a lista'); }
  });

  document.getElementById('novoPresetAdd').addEventListener('click', async ()=>{
    const desc = document.getElementById('novoPresetDesc').value.trim();
    if(!desc){ toast('Informe a descriÃ§Ã£o'); return; }
    if(!db){ toast('Sem conexÃ£o com o armazenamento agora.'); return; }
    try{
      const valor = Number(document.getElementById('novoPresetValor').value)||0;
      await db.doc((isServ?'presetsServicos/':'presetsPecas/')+uid()).set({descricao: desc, valor: valor, criadoEm: Date.now()});
      toast('PadrÃ£o adicionado');
    }catch(e){ toast('Erro ao adicionar'); }
  });
}

document.getElementById('gerenciarServicos').addEventListener('click', ()=> abrirGerenciarPresets('servicos'));
document.getElementById('gerenciarPecas').addEventListener('click', ()=> abrirGerenciarPresets('pecas'));

// ---------- MÃ¡scaras: CEP e CPF ----------
function maskCep(v){
  v = (v||'').replace(/\D/g,'').slice(0,8);
  if(v.length > 5) v = v.slice(0,5)+'-'+v.slice(5);
  return v;
}
function maskCpf(v){
  v = (v||'').replace(/\D/g,'').slice(0,11);
  v = v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');
  return v;
}
function montarEndereco(rua, numero, bairro, cidade, uf){
  let a = (rua||'').trim();
  if(numero) a += (a ? ', ' : '') + numero;
  const loc = [cidade, uf].filter(Boolean).join(' - ');
  return [a, bairro, loc].filter(Boolean).join(', ');
}
document.getElementById('fCliCep').addEventListener('input', async (e)=>{
  e.target.value = maskCep(e.target.value);
  const digits = e.target.value.replace(/\D/g,'');
  if(digits.length===8){
    try{
      const resp = await fetch('https://viacep.com.br/ws/'+digits+'/json/');
      const j = await resp.json();
      if(!j.erro){
        if(j.logradouro) document.getElementById('fCliEnd').value = j.logradouro;
        if(j.bairro) document.getElementById('fCliBairro').value = j.bairro;
        if(j.localidade) document.getElementById('fCliCidade').value = j.localidade;
        if(j.uf) document.getElementById('fCliUf').value = j.uf;
        document.getElementById('fCliNumero').focus();
      } else {
        toast('CEP nÃ£o encontrado');
      }
    }catch(err){
      toast('NÃ£o foi possÃ­vel consultar o CEP agora (sem internet?)');
    }
  }
});
document.getElementById('fCliDocTipo').addEventListener('change', (e)=>{
  const numEl = document.getElementById('fCliDocNumero');
  numEl.placeholder = e.target.value==='CPF' ? '000.000.000-00' : 'NÃºmero do RG';
  numEl.value = '';
});
document.getElementById('fCliDocNumero').addEventListener('input', (e)=>{
  if(document.getElementById('fCliDocTipo').value === 'CPF'){
    e.target.value = maskCpf(e.target.value);
  }
});

// ---------- ConfiguraÃ§Ã£o de campos obrigatÃ³rios ----------
function abrirConfigCampos(){
  const modalRoot = document.getElementById('modalRoot');
  modalRoot.innerHTML = `
  <div class="modal-bg" id="modalBgConfig">
    <div class="modal" style="max-width:460px;">
      <div class="modal-head">
        <div><strong>Campos obrigatÃ³rios</strong></div>
        <button class="close-x" id="closeModalConfig">âœ•</button>
      </div>
      <div class="modal-body">
        <div class="config-row">
          <span>CEP obrigatÃ³rio</span>
          <label class="switch"><input type="checkbox" id="cfgCep" ${configCampos.cepObrigatorio?'checked':''}><span class="slider"></span></label>
        </div>
        <div class="config-row">
          <span>CPF/RG obrigatÃ³rio</span>
          <label class="switch"><input type="checkbox" id="cfgDoc" ${configCampos.documentoObrigatorio?'checked':''}><span class="slider"></span></label>
        </div>
        <div class="config-row">
          <span>Senha de acesso</span>
          <button class="btn btn-outline btn-sm" id="cfgTrocarSenha">Alterar senha</button>
        </div>
        <div class="config-row">
          <span>Dados da empresa</span>
          <button class="btn btn-outline btn-sm" id="cfgEditarEmpresa">Editar</button>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('closeModalConfig').addEventListener('click', ()=> modalRoot.innerHTML='');
  document.getElementById('modalBgConfig').addEventListener('click', (e)=>{ if(e.target.id==='modalBgConfig') modalRoot.innerHTML=''; });
  const salvarConfig = async ()=>{
    if(!db) { toast('Sem conexÃ£o com o armazenamento agora.'); return; }
    const novo = {
      cepObrigatorio: document.getElementById('cfgCep').checked,
      documentoObrigatorio: document.getElementById('cfgDoc').checked
    };
    try{
      await db.doc('config/campos').set(novo);
      toast('ConfiguraÃ§Ã£o salva');
    }catch(e){ toast('Erro ao salvar configuraÃ§Ã£o'); }
  };
  document.getElementById('cfgCep').addEventListener('change', salvarConfig);
  document.getElementById('cfgDoc').addEventListener('change', salvarConfig);
  document.getElementById('cfgTrocarSenha').addEventListener('click', async ()=>{
    const user = auth && auth.currentUser;
    if(!user || !user.email){ toast('FaÃ§a login novamente.'); return; }
    const atual = prompt('Digite a senha atual:');
    if(atual===null) return;
    try{
      const cred = firebase.auth.EmailAuthProvider.credential(user.email, atual);
      await user.reauthenticateWithCredential(cred);
      const nova = prompt('Digite a nova senha (mÃ­nimo 6 caracteres):');
      if(!nova || nova.length<6){ toast('Senha invÃ¡lida (mÃ­nimo 6 caracteres)'); return; }
      const confirmarNova = prompt('Confirme a nova senha:');
      if(nova !== confirmarNova){ toast('As senhas nÃ£o coincidem'); return; }
      await user.updatePassword(nova);
      toast('Senha alterada com sucesso');
    }catch(e){
      toast((e.code==='auth/invalid-credential'||e.code==='auth/wrong-password') ? 'Senha atual incorreta' : 'Erro ao alterar a senha');
    }
  });
  document.getElementById('cfgEditarEmpresa').addEventListener('click', async ()=>{
    if(!db){ toast('Sem conexÃ£o com o armazenamento agora.'); return; }
    try{
      const doc = await db.doc('config/acesso').get();
      const hashMasterSalvo = doc.exists && doc.data() ? doc.data().senhaMasterHash : null;
      if(!hashMasterSalvo){
        const nova = prompt('Nenhuma senha master definida ainda.\nCrie uma senha master (mÃ­nimo 4 caracteres) para proteger os dados da empresa:');
        if(!nova || nova.length<4){ if(nova!==null) toast('Senha invÃ¡lida'); return; }
        const confirmar = prompt('Confirme a senha master:');
        if(nova !== confirmar){ toast('As senhas nÃ£o coincidem'); return; }
        const novoHash = await sha256Hex(nova);
        await db.doc('config/acesso').set({senhaMasterHash: novoHash}, {merge:true});
        toast('Senha master definida');
      } else {
        const digitada = prompt('Digite a senha master para editar os dados da empresa:');
        if(digitada===null) return;
        const hashDigitado = await sha256Hex(digitada);
        if(hashDigitado !== hashMasterSalvo){ toast('Senha master incorreta'); return; }
      }
      abrirEditarEmpresa();
    }catch(e){ toast('Erro ao verificar a senha master'); }
  });
}
function abrirEditarEmpresa(){
  const modalRoot = document.getElementById('modalRoot');
  modalRoot.innerHTML = `
  <div class="modal-bg" id="modalBgEmpresa">
    <div class="modal" style="max-width:460px;">
      <div class="modal-head">
        <div><strong>Dados da empresa</strong></div>
        <button class="close-x" id="closeModalEmpresa">âœ•</button>
      </div>
      <div class="modal-body">
        <label>Nome da empresa</label>
        <input type="text" id="empNome" value="${EMPRESA.nome||''}">
        <label>CNPJ</label>
        <input type="text" id="empCnpj" value="${EMPRESA.cnpj||''}" placeholder="00.000.000/0000-00">
        <label>TÃ©cnico responsÃ¡vel</label>
        <input type="text" id="empTecnico" value="${EMPRESA.tecnico||''}">
        <label>Telefone</label>
        <input type="tel" id="empTelefone" value="${EMPRESA.telefone||''}">
        <label>EndereÃ§o</label>
        <input type="text" id="empEndereco" value="${EMPRESA.endereco||''}">
        <button class="btn btn-primary" id="salvarEmpresaBtn" style="width:100%;margin-top:10px;">Salvar</button>
      </div>
    </div>
  </div>`;
  document.getElementById('closeModalEmpresa').addEventListener('click', ()=> modalRoot.innerHTML='');
  document.getElementById('modalBgEmpresa').addEventListener('click', (e)=>{ if(e.target.id==='modalBgEmpresa') modalRoot.innerHTML=''; });
  document.getElementById('salvarEmpresaBtn').addEventListener('click', async ()=>{
    if(!db){ toast('Sem conexÃ£o com o armazenamento agora.'); return; }
    const novo = {
      nome: document.getElementById('empNome').value.trim(),
      cnpj: document.getElementById('empCnpj').value.trim(),
      tecnico: document.getElementById('empTecnico').value.trim(),
      telefone: document.getElementById('empTelefone').value.trim(),
      endereco: document.getElementById('empEndereco').value.trim()
    };
    try{
      await db.doc('config/empresa').set(novo);
      toast('Dados da empresa salvos');
      modalRoot.innerHTML='';
    }catch(e){ toast('Erro ao salvar os dados da empresa'); }
  });
}
document.getElementById('configCamposBtn').addEventListener('click', abrirConfigCampos);

// ---------- Cliente autocomplete ----------
function preencherCliente(c){
  document.getElementById('fCliNome').value = c.nome||'';
  document.getElementById('fCliTel').value = c.telefone||'';
  document.getElementById('fCliEnd').value = c.endereco||'';
  document.getElementById('fCliNumero').value = c.numero||'';
  document.getElementById('fCliBairro').value = c.bairro||'';
  document.getElementById('fCliCidade').value = c.cidade||'';
  document.getElementById('fCliUf').value = c.uf||'';
  document.getElementById('fCliCep').value = c.cep||'';
  document.getElementById('fCliDocTipo').value = c.documentoTipo||'CPF';
  document.getElementById('fCliDocNumero').value = c.documentoNumero||'';
}
function renderClienteSelect(){
  const sel = document.getElementById('cliSalvoSelect');
  const lista = [...clientes].sort((a,b)=>(a.nome||'').localeCompare(b.nome||''));
  sel.innerHTML = '<option value="">+ Inserir cliente salvo' + (lista.length ? ' ('+lista.length+')' : '') + '...</option>' +
    lista.map(c=>`<option value="${c.id}">${(c.nome||'').replace(/&/g,'&amp;').replace(/</g,'&lt;')}${c.telefone?' Â· '+c.telefone:''}</option>`).join('');
  sel.value = '';
}
document.getElementById('cliSalvoSelect').addEventListener('change', (e)=>{
  const c = clientes.find(x=>x.id===e.target.value);
  if(c){
    preencherCliente(c);
    document.getElementById('cliSuggest').innerHTML = '';
    toast('Cliente inserido');
  }
  e.target.value = '';
});
document.getElementById('fCliNome').addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  const box = document.getElementById('cliSuggest');
  box.innerHTML = '';
  if(!q){ return; }
  const matches = clientes.filter(c => (c.nome||'').toLowerCase().includes(q)).slice(0,5);
  if(!matches.length) return;
  const suggestDiv = document.createElement('div');
  suggestDiv.className = 'client-suggest';
  matches.forEach(c=>{
    const item = document.createElement('div');
    item.textContent = c.nome + (c.telefone? ' Â· '+c.telefone : '');
    item.addEventListener('click', ()=>{
      preencherCliente(c);
      box.innerHTML = '';
    });
    suggestDiv.appendChild(item);
  });
  box.appendChild(suggestDiv);
});

// ---------- FormulÃ¡rio: limpar / preencher ----------
function limparForm(){
  editingId = null;
  document.getElementById('formTitle').textContent = 'Nova Ordem de ServiÃ§o / OrÃ§amento';
  document.getElementById('fCliNome').value='';
  document.getElementById('fCliTel').value='';
  document.getElementById('fCliEnd').value='';
  document.getElementById('fCliNumero').value='';
  document.getElementById('fCliBairro').value='';
  document.getElementById('fCliCidade').value='';
  document.getElementById('fCliUf').value='';
  document.getElementById('fCliCep').value='';
  document.getElementById('fCliDocTipo').value='CPF';
  document.getElementById('fCliDocNumero').value='';
  document.getElementById('fCliDocNumero').placeholder='000.000.000-00';
  document.getElementById('fData').value = new Date().toISOString().slice(0,10);
  document.getElementById('fStatus').value = 'orcamento';
  document.getElementById('fEquip').value='';
  document.getElementById('fProblema').value='';
  document.getElementById('fServicos').value='';
  document.getElementById('fObs').value='OrÃ§amento vÃ¡lido por 15 dias a partir da data de emissÃ£o.';
  document.getElementById('fEntrada').value='';
  document.getElementById('fEntradaPaga').checked=false;
  document.getElementById('itensList').innerHTML='';
  addItemRow('','');
  recalcTotal();
  document.getElementById('saveStatus').textContent='';
}
document.getElementById('limparBtn').addEventListener('click', limparForm);

function carregarNoForm(o){
  editingId = o.id;
  document.getElementById('formTitle').textContent = 'Editando #' + o.numero;
  document.getElementById('fCliNome').value = o.clienteNome||'';
  document.getElementById('fCliTel').value = o.clienteTelefone||'';
  document.getElementById('fCliEnd').value = o.clienteEndereco||'';
  document.getElementById('fCliNumero').value = o.clienteNumero||'';
  document.getElementById('fCliBairro').value = o.clienteBairro||'';
  document.getElementById('fCliCidade').value = o.clienteCidade||'';
  document.getElementById('fCliUf').value = o.clienteUf||'';
  document.getElementById('fCliCep').value = o.clienteCep||'';
  document.getElementById('fCliDocTipo').value = o.clienteDocTipo||'CPF';
  document.getElementById('fCliDocNumero').value = o.clienteDocNumero||'';
  document.getElementById('fData').value = o.data||'';
  document.getElementById('fStatus').value = o.status||'orcamento';
  document.getElementById('fEquip').value = o.equipamento||'';
  document.getElementById('fProblema').value = o.problema||'';
  document.getElementById('fServicos').value = (o.servicos||[]).join("\n");
  document.getElementById('fObs').value = o.observacoes||'';
  document.getElementById('fEntrada').value = o.entrada>0 ? o.entrada : '';
  document.getElementById('fEntradaPaga').checked = !!o.entradaPaga;
  document.getElementById('itensList').innerHTML='';
  (o.itens||[]).forEach(it=> addItemRow(it.descricao, it.valor));
  if(!(o.itens||[]).length) addItemRow('','');
  recalcTotal();
  document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.remove('active'));
  document.querySelector('[data-tab="novo"]').classList.add('active');
  document.getElementById('tab-novo').style.display='block';
  document.getElementById('tab-historico').style.display='none';
  document.getElementById('tab-clientes').style.display='none';
  window.scrollTo({top:0, behavior:'smooth'});
}

// ---------- Salvar ----------
document.getElementById('salvarBtn').addEventListener('click', async ()=>{
  const nome = document.getElementById('fCliNome').value.trim();
  if(!nome){ toast('Informe o nome do cliente'); return; }
  const cep = document.getElementById('fCliCep').value.trim();
  const docTipo = document.getElementById('fCliDocTipo').value;
  const docNumero = document.getElementById('fCliDocNumero').value.trim();
  if(configCampos.cepObrigatorio && !cep){ toast('CEP Ã© obrigatÃ³rio'); return; }
  if(configCampos.documentoObrigatorio && !docNumero){ toast(docTipo+' Ã© obrigatÃ³rio'); return; }
  const itens = coletarItens();
  const total = itens.reduce((s,i)=>s+(Number(i.valor)||0),0);
  const entradaVal = Number(document.getElementById('fEntrada').value)||0;
  if(entradaVal > total){ toast('A entrada nÃ£o pode ser maior que o total'); return; }
  const servicos = document.getElementById('fServicos').value.split('\n').map(s=>s.trim()).filter(Boolean);

  const data = {
    clienteNome: nome,
    clienteTelefone: document.getElementById('fCliTel').value.trim(),
    clienteEndereco: document.getElementById('fCliEnd').value.trim(),
    clienteNumero: document.getElementById('fCliNumero').value.trim(),
    clienteBairro: document.getElementById('fCliBairro').value.trim(),
    clienteCidade: document.getElementById('fCliCidade').value.trim(),
    clienteUf: document.getElementById('fCliUf').value,
    clienteCep: cep,
    clienteDocTipo: docTipo,
    clienteDocNumero: docNumero,
    data: document.getElementById('fData').value,
    status: document.getElementById('fStatus').value,
    equipamento: document.getElementById('fEquip').value.trim(),
    problema: document.getElementById('fProblema').value.trim(),
    servicos: servicos,
    itens: itens,
    total: total,
    observacoes: document.getElementById('fObs').value.trim(),
    entrada: Number(document.getElementById('fEntrada').value)||0,
    entradaPaga: document.getElementById('fEntradaPaga').checked,
    atualizadoEm: Date.now()
  };

  if(!db){ toast('Sem conexÃ£o com o armazenamento agora.'); return; }

  try{
    await upsertCliente(data.clienteNome, data.clienteTelefone, data.clienteEndereco, data.clienteCep, data.clienteDocTipo, data.clienteDocNumero, {numero:data.clienteNumero, bairro:data.clienteBairro, cidade:data.clienteCidade, uf:data.clienteUf});

    if(editingId){
      await db.doc('ordens/'+editingId).update(data);
      toast('Atualizado com sucesso');
    } else {
      const numero = await proximoNumero();
      data.numero = numero;
      data.criadoEm = Date.now();
      const id = uid();
      await db.doc('ordens/'+id).set(data);
      toast('Salvo como #' + numero);
    }
    limparForm();
  }catch(err){
    toast('Erro ao salvar');
  }
});

async function proximoNumero(){
  try{
    const counterRef = db.doc('meta/contador');
    const cur = await counterRef.get();
    const curVal = (cur && cur.exists && cur.data() && cur.data().valor) || 0;
    const maiorExistente = ordens.reduce((m,o)=> Math.max(m, Number(o.numero)||0), 0);
    const next = Math.max(curVal, maiorExistente) + 1;
    await counterRef.set({valor: next});
    return next;
  }catch(e){
    return (ordens.reduce((m,o)=> Math.max(m, Number(o.numero)||0), 0)) + 1;
  }
}

async function upsertCliente(nome, telefone, endereco, cep, documentoTipo, documentoNumero, extra){
  extra = extra || {};
  if(!nome) return;
  const existing = clientes.find(c => (c.nome||'').toLowerCase() === nome.toLowerCase());
  if(existing){
    if(telefone || endereco || cep || documentoNumero || extra.numero || extra.cidade){
      await db.doc('clientes/'+existing.id).update({
        telefone: telefone || existing.telefone || '',
        endereco: endereco || existing.endereco || '',
        numero: extra.numero || existing.numero || '',
        bairro: extra.bairro || existing.bairro || '',
        cidade: extra.cidade || existing.cidade || '',
        uf: extra.uf || existing.uf || '',
        cep: cep || existing.cep || '',
        documentoTipo: documentoTipo || existing.documentoTipo || 'CPF',
        documentoNumero: documentoNumero || existing.documentoNumero || ''
      });
    }
  } else {
    const id = uid();
    await db.doc('clientes/'+id).set({nome, telefone: telefone||'', endereco: endereco||'', numero: extra.numero||'', bairro: extra.bairro||'', cidade: extra.cidade||'', uf: extra.uf||'', cep: cep||'', documentoTipo: documentoTipo||'CPF', documentoNumero: documentoNumero||'', criadoEm: Date.now()});
  }
}

// ---------- HistÃ³rico ----------
function statusBadge(status){
  const map = {
    orcamento: ['OrÃ§amento','badge-orc'],
    aprovado: ['Aprovado','badge-aprov'],
    concluido: ['ConcluÃ­do','badge-concl'],
    recusado: ['Recusado','badge-recus']
  };
  const [label, cls] = map[status] || ['â€”',''];
  return `<span class="badge ${cls}">${label}</span>`;
}

function renderHistorico(){
  const wrap = document.getElementById('histTableWrap');
  const q = (document.getElementById('searchHist').value||'').toLowerCase();
  let list = [...ordens].sort((a,b)=> (b.numero||0)-(a.numero||0));
  if(q){
    list = list.filter(o =>
      (o.clienteNome||'').toLowerCase().includes(q) ||
      String(o.numero||'').includes(q) ||
      (o.equipamento||'').toLowerCase().includes(q)
    );
  }
  if(!list.length){
    wrap.innerHTML = '<div class="empty">Nenhum registro encontrado.</div>';
    return;
  }
  let html = '<table class="hist"><thead><tr><th>#</th><th>Cliente</th><th>Equipamento</th><th>Data</th><th>Status</th><th>Total</th></tr></thead><tbody>';
  list.forEach(o=>{
    html += `<tr data-id="${o.id}">
      <td>${o.numero||'-'}</td>
      <td>${o.clienteNome||''}</td>
      <td>${o.equipamento||''}</td>
      <td>${fmtDate(o.data)}</td>
      <td>${statusBadge(o.status)}</td>
      <td>${fmtMoney(o.total)}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  wrap.innerHTML = html;
  wrap.querySelectorAll('tr[data-id]').forEach(tr=>{
    tr.addEventListener('click', ()=> abrirDetalhe(tr.dataset.id));
  });
}
document.getElementById('searchHist').addEventListener('input', renderHistorico);

// ---------- Clientes ----------
function renderClientes(){
  const wrap = document.getElementById('cliTableWrap');
  const q = (document.getElementById('searchCli').value||'').toLowerCase();
  let list = [...clientes].sort((a,b)=>(a.nome||'').localeCompare(b.nome||''));
  if(q) list = list.filter(c => (c.nome||'').toLowerCase().includes(q));
  if(!list.length){
    wrap.innerHTML = '<div class="empty">Nenhum cliente cadastrado ainda.</div>';
    return;
  }
  let html = '<table class="hist"><thead><tr><th>Nome</th><th>Telefone</th><th>EndereÃ§o</th><th>ServiÃ§os</th></tr></thead><tbody>';
  list.forEach(c=>{
    const count = ordens.filter(o => (o.clienteNome||'').toLowerCase() === (c.nome||'').toLowerCase()).length;
    html += `<tr data-nome="${c.nome.replace(/"/g,'&quot;')}"><td>${c.nome}</td><td>${c.telefone||'â€”'}</td><td>${montarEndereco(c.endereco,c.numero,c.bairro,c.cidade,c.uf)||'â€”'}</td><td>${count}</td></tr>`;
  });
  html += '</tbody></table>';
  wrap.innerHTML = html;
  wrap.querySelectorAll('tr[data-nome]').forEach(tr=>{
    tr.addEventListener('click', ()=>{
      document.getElementById('searchHist').value = tr.dataset.nome;
      document.querySelector('[data-tab="historico"]').click();
    });
  });
}
document.getElementById('searchCli').addEventListener('input', renderClientes);

// ---------- Detalhe / Documento imprimÃ­vel ----------
function abrirDetalhe(id){
  const o = ordens.find(x=>x.id===id);
  if(!o) return;
  const modalRoot = document.getElementById('modalRoot');
  const itensRows = (o.itens||[]).map(it=>`<tr><td>${it.descricao||''}</td><td style="text-align:right;">${fmtMoney(it.valor)}</td></tr>`).join('');
  const servicosLis = (o.servicos||[]).map(s=>`<li>${s}</li>`).join('');
  const statusLabelMap = {orcamento:'OrÃ§amento (proposta)', aprovado:'Aprovado â€” em execuÃ§Ã£o', concluido:'ConcluÃ­do', recusado:'Recusado'};

  modalRoot.innerHTML = `
  <div class="modal-bg" id="modalBg">
    <div class="modal">
      <div class="modal-head">
        <div><strong>#${o.numero}</strong> â€” ${statusBadge(o.status)}</div>
        <div>
          <button class="btn btn-outline btn-sm" id="editBtn">Editar</button>
          <button class="btn btn-outline btn-sm" id="printNativeBtn">Imprimir</button>
          <button class="btn btn-primary btn-sm" id="printBtn">Baixar PDF</button>
          <button class="close-x" id="closeModal">âœ•</button>
        </div>
      </div>
      <div class="modal-body">
        <div class="doc" id="docPrint">
          <div class="doc-header"><img src="${LOGO_CLARO}" alt="MTZ"></div>
          <hr>
          <h3>${o.status==='orcamento' ? 'ORÃ‡AMENTO DE SERVIÃ‡O TÃ‰CNICO' : 'ORDEM DE SERVIÃ‡O'} NÂº ${String(o.numero).padStart(4,'0')}</h3>
          <div class="doc-grid">
            <div><b>TÃ©cnico responsÃ¡vel</b>${EMPRESA.tecnico}<br><b style="margin-top:6px;">Telefone</b>${EMPRESA.telefone}</div>
            <div><b>EndereÃ§o</b>${EMPRESA.endereco}</div>
          </div>
          <div class="doc-grid">
            <div><b>Cliente</b>${o.clienteNome||''}<br><b style="margin-top:6px;">Telefone</b>${o.clienteTelefone||'â€”'}<br><b style="margin-top:6px;">${o.clienteDocTipo||'CPF'}</b>${o.clienteDocNumero||'â€”'}</div>
            <div><b>EndereÃ§o do cliente</b>${montarEndereco(o.clienteEndereco,o.clienteNumero,o.clienteBairro,o.clienteCidade,o.clienteUf)||'â€”'}${o.clienteCep?(' â€” CEP '+o.clienteCep):''}<br><b style="margin-top:6px;">Data</b>${fmtDate(o.data)}</div>
          </div>
          <div class="doc-section-title">Equipamento</div>
          <div style="font-size:13.5px;"><b>Modelo:</b> ${o.equipamento||'â€”'}<br><b>Problema relatado:</b> ${o.problema||'â€”'}</div>
          ${servicosLis ? `<div class="doc-section-title">ServiÃ§o Executado</div><ul>${servicosLis}</ul>` : ''}
          <div class="doc-section-title">Detalhamento de Valores</div>
          <table>
            <thead><tr><th>DescriÃ§Ã£o</th><th style="text-align:right;">Valor</th></tr></thead>
            <tbody>${itensRows}</tbody>
            <tbody><tr class="tot"><td>TOTAL</td><td style="text-align:right;">${fmtMoney(o.total)}</td></tr></tbody>
            ${o.entrada>0 ? `<tbody>
              <tr><td>Entrada (sinal) â€” ${o.entradaPaga?'recebida':'a pagar na aprovaÃ§Ã£o'}</td><td style="text-align:right;">${fmtMoney(o.entrada)}</td></tr>
              <tr><td><b>Saldo a pagar na entrega</b></td><td style="text-align:right;"><b>${fmtMoney(Math.max((o.total||0)-o.entrada,0))}</b></td></tr>
            </tbody>` : ''}
          </table>
          ${o.observacoes ? `<div class="doc-section-title">ObservaÃ§Ãµes</div><div class="obs">${o.observacoes}</div>` : ''}
          <div class="doc-section-title" style="margin-top:14px;">Status</div>
          <div style="font-size:13.5px;">${statusLabelMap[o.status]||''}</div>
          <div class="sign">${EMPRESA.tecnico} â€” TÃ©cnico ResponsÃ¡vel</div>
          <div class="doc-footer">${EMPRESA.nome}${EMPRESA.cnpj?' â€¢ CNPJ '+EMPRESA.cnpj:''} â€¢ ${EMPRESA.endereco} â€¢ ${EMPRESA.telefone}</div>
          ${o.status==='orcamento' ? `
          <div class="doc-autoriza">
            <div class="corte">âœ‚ DESTAQUE AQUI</div>
            <div class="aut-titulo">AUTORIZAÃ‡ÃƒO DO CLIENTE PARA EXECUÃ‡ÃƒO DO SERVIÃ‡O</div>
            <div style="font-size:12.5px;"><b>OrÃ§amento NÂº ${String(o.numero).padStart(4,'0')}</b>${o.equipamento?' â€” Equipamento: '+o.equipamento:''} â€” <b>Valor total: ${fmtMoney(o.total)}</b></div>
            <p>Eu, <b>${o.clienteNome||'____________________________'}</b>, ${o.clienteDocTipo||'CPF'} ${o.clienteDocNumero||'_______________'}, autorizo a ${EMPRESA.nome} a executar os serviÃ§os descritos neste orÃ§amento, no valor total de <b>${fmtMoney(o.total)}</b>, estando ciente dos serviÃ§os, valores e condiÃ§Ãµes apresentados.${o.entrada>0 ? ` Fica acordada a <b>entrada de ${fmtMoney(o.entrada)}</b>${o.total>0?' ('+Math.round(o.entrada/o.total*100)+'% do total)':''} na aprovaÃ§Ã£o, com saldo de <b>${fmtMoney(Math.max((o.total||0)-o.entrada,0))}</b> na conclusÃ£o do serviÃ§o.` : ''}</p>
            <div class="aut-linhas">
              <div>Data: ____/____/________</div>
              <div>Assinatura do cliente</div>
            </div>
          </div>` : ''}
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('closeModal').addEventListener('click', ()=> modalRoot.innerHTML='');
  document.getElementById('modalBg').addEventListener('click', (e)=>{ if(e.target.id==='modalBg') modalRoot.innerHTML=''; });
  document.getElementById('printBtn').addEventListener('click', ()=> gerarPdf(o));
  document.getElementById('printNativeBtn').addEventListener('click', ()=> window.print());
  document.getElementById('editBtn').addEventListener('click', ()=>{ modalRoot.innerHTML=''; carregarNoForm(o); });
}

async function gerarPdf(o){
  const btn = document.getElementById('printBtn');
  const original = btn.textContent;
  const el = document.getElementById('docPrint');
  if(!el || typeof html2pdf === 'undefined'){
    window.print();
    return;
  }
  btn.textContent = 'Gerando...';
  btn.disabled = true;
  const nomeArq = `OS_${String(o.numero).padStart(4,'0')}_${(o.clienteNome||'cliente').replace(/[^\w\-]+/g,'_')}.pdf`;
  try{
    await html2pdf().set({
      margin: 10,
      filename: nomeArq,
      image: {type:'jpeg', quality:0.98},
      html2canvas: {scale:2, useCORS:true, backgroundColor:'#ffffff'},
      jsPDF: {unit:'mm', format:'a4', orientation:'portrait'},
      pagebreak: {mode:['css','legacy'], avoid:['.doc-autoriza']}
    }).from(el).save();
    toast('PDF gerado');
  }catch(err){
    toast('NÃ£o foi possÃ­vel gerar o PDF. Tentando impressÃ£o do navegador...');
    window.print();
  }finally{
    btn.textContent = original;
    btn.disabled = false;
  }
}

// ---------- Firebase Firestore (banco compartilhado em tempo real) ----------
const firebaseConfig = {
  apiKey: "AIzaSyCOPxTxvFjGABt_ufy_Z8XGLXcAidHhzIU",
  authDomain: "mtzos-f6b4f.firebaseapp.com",
  projectId: "mtzos-f6b4f",
  storageBucket: "mtzos-f6b4f.firebasestorage.app",
  messagingSenderId: "273126256272",
  appId: "1:273126256272:web:24fbc52aef3f2010897215",
  measurementId: "G-XK82VZV0VF"
};
let firebaseReady = false;
let auth = null;
try{
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
  firebaseReady = true;
}catch(e){ firebaseReady = false; }

// ---------- DB init ----------
async function initDb(){
  downloadsCap = null;
  unsubOrdens = db.collection('ordens').onSnapshot(snap=>{
    ordens = snap.docs.map(d=>({id:d.id, ...d.data()}));
    renderHistorico();
  }, err=>{ toast('Erro ao carregar histÃ³rico'); });
  unsubClientes = db.collection('clientes').onSnapshot(snap=>{
    clientes = snap.docs.map(d=>({id:d.id, ...d.data()}));
    renderClientes();
    renderClienteSelect();
  }, err=>{ toast('Erro ao carregar clientes'); });
  unsubPresetServicos = db.collection('presetsServicos').onSnapshot(snap=>{
    presetsServicos = snap.docs.map(d=>({id:d.id, ...d.data()})).sort((a,b)=>(a.descricao||'').localeCompare(b.descricao||''));
    renderPresetSelects();
    if(document.getElementById('modalBgPreset') && document.querySelector('.modal-head strong').textContent==='ServiÃ§os padrÃ£o'){
      renderGerenciarPresetsModal(true);
    }
  }, err=>{});
  unsubPresetPecas = db.collection('presetsPecas').onSnapshot(snap=>{
    presetsPecas = snap.docs.map(d=>({id:d.id, ...d.data()})).sort((a,b)=>(a.descricao||'').localeCompare(b.descricao||''));
    renderPresetSelects();
    if(document.getElementById('modalBgPreset') && document.querySelector('.modal-head strong').textContent==='PeÃ§as padrÃ£o'){
      renderGerenciarPresetsModal(false);
    }
  }, err=>{});
  unsubPresetEquip = db.collection('presetsEquipamentos').onSnapshot(snap=>{
    presetsEquipamentos = snap.docs.map(d=>({id:d.id, ...d.data()})).sort((a,b)=>(a.descricao||'').localeCompare(b.descricao||''));
    renderEquipSelect();
    if(document.getElementById('modalBgEquip')){ renderGerenciarEquipModal(); }
  }, err=>{});
  unsubConfig = db.doc('config/campos').onSnapshot(doc=>{
    if(doc && doc.exists && doc.data()){
      configCampos = {
        cepObrigatorio: !!doc.data().cepObrigatorio,
        documentoObrigatorio: !!doc.data().documentoObrigatorio
      };
    }
  }, err=>{});
  unsubEmpresa = db.doc('config/empresa').onSnapshot(doc=>{
    if(doc && doc.exists && doc.data()){
      const d = doc.data();
      EMPRESA.nome = d.nome || EMPRESA.nome;
      EMPRESA.tecnico = d.tecnico || EMPRESA.tecnico;
      EMPRESA.telefone = d.telefone || EMPRESA.telefone;
      EMPRESA.endereco = d.endereco || EMPRESA.endereco;
      EMPRESA.cnpj = d.cnpj || '';
      document.getElementById('logoHeader').alt = EMPRESA.nome;
    }
  }, err=>{});
  await seedPresetsSeNecessario();
}

// ---------- Login (Firebase Authentication) ----------
async function sha256Hex(str){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
function mostrarOverlay(){ document.getElementById('lockOverlay').style.display='flex'; }
function esconderOverlay(){ document.getElementById('lockOverlay').style.display='none'; }

let dbIniciado = false;
function liberarAcesso(){
  esconderOverlay();
  if(dbIniciado) return;
  dbIniciado = true;
  limparForm();
  initDb();
}

function msgErroAuth(e){
  switch(e && e.code){
    case 'auth/invalid-email': return 'E-mail invÃ¡lido.';
    case 'auth/user-disabled': return 'Este usuÃ¡rio estÃ¡ desativado.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'E-mail ou senha incorretos.';
    case 'auth/too-many-requests': return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
    case 'auth/network-request-failed': return 'Sem conexÃ£o com a internet.';
    default: return 'NÃ£o foi possÃ­vel entrar. Tente novamente.';
  }
}

function iniciarComSenha(){
  if(!firebaseReady){
    document.getElementById('lockMsg').textContent = 'NÃ£o foi possÃ­vel conectar (verifique sua internet).';
    mostrarOverlay();
    return;
  }
  mostrarOverlay();
  auth.onAuthStateChanged(user=>{
    if(user){ liberarAcesso(); }
    else { dbIniciado = false; mostrarOverlay(); }
  });
}

async function tentarAcesso(){
  const email = document.getElementById('lockEmailInput').value.trim();
  const senha = document.getElementById('lockPassInput').value;
  const msgEl = document.getElementById('lockMsg');
  msgEl.style.color = '#c0392b';
  msgEl.textContent = '';
  if(!email || !senha){ msgEl.textContent = 'Informe e-mail e senha.'; return; }
  const btn = document.getElementById('lockSubmitBtn');
  btn.disabled = true;
  try{
    await auth.signInWithEmailAndPassword(email, senha);
    document.getElementById('lockPassInput').value = '';
  }catch(e){
    msgEl.textContent = msgErroAuth(e);
  }finally{
    btn.disabled = false;
  }
}

async function esqueciSenha(){
  const email = document.getElementById('lockEmailInput').value.trim();
  const msgEl = document.getElementById('lockMsg');
  msgEl.style.color = '#c0392b';
  if(!email){ msgEl.textContent = 'Digite seu e-mail acima para receber o link.'; return; }
  try{
    await auth.sendPasswordResetEmail(email);
    msgEl.style.color = '#1E9E5A';
    msgEl.textContent = 'Se o e-mail estiver cadastrado, enviamos um link para redefinir a senha.';
  }catch(e){
    msgEl.textContent = msgErroAuth(e);
  }
}

document.getElementById('lockSubmitBtn').addEventListener('click', tentarAcesso);
document.getElementById('lockResetBtn').addEventListener('click', esqueciSenha);
document.getElementById('lockPassInput').addEventListener('keydown', (e)=>{ if(e.key==='Enter') tentarAcesso(); });
document.getElementById('lockEmailInput').addEventListener('keydown', (e)=>{ if(e.key==='Enter') tentarAcesso(); });
document.getElementById('logoutBtn').addEventListener('click', async ()=>{
  try{ await auth.signOut(); }catch(e){}
  location.reload();
});

iniciarComSenha();
