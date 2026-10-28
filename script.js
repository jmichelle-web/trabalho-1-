const produtos = [
  {id:1, nome:"Vitrola portátil Philips", cat:"Vitrolas", ano:1962, preco:890, estado:"Restaurada", cor:"#6e2230", desc:"Mala em courino vinho, toca discos de 33 e 45 rotações. Agulha nova."},
  {id:2, nome:"Vitrola de mesa Radiolux", cat:"Vitrolas", ano:1958, preco:1450, estado:"Funcionando", cor:"#1d3340", desc:"Gabinete de madeira com rádio AM integrado e alto-falante original."},
  {id:3, nome:"LP Elis & Tom", cat:"Discos", ano:1974, preco:240, estado:"Ótimo", cor:"#2f5560", desc:"Primeira prensagem nacional, capa com leve desgaste nas bordas."},
  {id:4, nome:"LP Clube da Esquina", cat:"Discos", ano:1972, preco:380, estado:"Bom", cor:"#6e2230", desc:"Álbum duplo com encarte original. Vinil sem chiados."},
  {id:5, nome:"Compacto Os Mutantes", cat:"Discos", ano:1968, preco:120, estado:"Bom", cor:"#1d3340", desc:"Disco de 45 rotações com luva de papel original."},
  {id:6, nome:"Máquina de escrever Olivetti Lettera 32", cat:"Máquinas de escrever", ano:1965, preco:780, estado:"Revisada", cor:"#2f5560", desc:"Verde-água, teclado ABNT, fita nova e capa de transporte."},
  {id:7, nome:"Máquina de escrever Remington", cat:"Máquinas de escrever", ano:1948, preco:1100, estado:"Funcionando", cor:"#6e2230", desc:"Corpo preto com detalhes cromados. Todas as teclas respondem."},
  {id:8, nome:"Escrivaninha em imbuia", cat:"Móveis", ano:1955, preco:2800, estado:"Restaurada", cor:"#1d3340", desc:"Três gavetas, tampo com forro de couro e chaves originais."},
  {id:9, nome:"Cadeira giratória de escritório", cat:"Móveis", ano:1960, preco:650, estado:"Bom", cor:"#2f5560", desc:"Estrutura em madeira e assento reestofado em linho."},
  {id:10, nome:"Telefone de disco preto", cat:"Decoração", ano:1970, preco:320, estado:"Ótimo", cor:"#6e2230", desc:"Bakelite original, fio trocado. Peça decorativa."},
  {id:11, nome:"Câmera Kodak Brownie", cat:"Decoração", ano:1935, preco:520, estado:"Bom", cor:"#1d3340", desc:"Corpo de metal e fole de couro preservado. Não testada com filme."},
  {id:12, nome:"Relógio de parede Junghans", cat:"Decoração", ano:1950, preco:940, estado:"Revisado", cor:"#2f5560", desc:"Caixa de nogueira, pêndulo e mecanismo a corda revisado."}
];

const $ = id => document.getElementById(id);
const brl = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
let categoria = "Todas";
let sacola = [];
try { sacola = JSON.parse(localStorage.getItem("sacola")) || []; } catch(e) {}

function salvar(){ try { localStorage.setItem("sacola", JSON.stringify(sacola)); } catch(e) {} }

function aviso(msg){
  const el = $("aviso"); el.textContent = msg; el.classList.add("ativo");
  clearTimeout(aviso.t); aviso.t = setTimeout(() => el.classList.remove("ativo"), 2200);
}

function renderCategorias(){
  const cats = ["Todas", ...new Set(produtos.map(p => p.cat))];
  $("categorias").innerHTML = cats.map(c =>
    `<button class="chip" aria-pressed="${c === categoria}" data-cat="${c}">${c}</button>`).join("");
}

function renderGrade(){
  const q = $("busca").value.trim().toLowerCase();
  let lista = produtos.filter(p =>
    (categoria === "Todas" || p.cat === categoria) &&
    (p.nome.toLowerCase().includes(q) || String(p.ano).includes(q) || p.cat.toLowerCase().includes(q)));
  const o = $("ordem").value;
  lista.sort((a,b) => o === "menor" ? a.preco - b.preco : o === "maior" ? b.preco - a.preco : a.ano - b.ano);
  $("vazio").hidden = lista.length > 0;
  $("grade").innerHTML = lista.map(p => {
    const naSacola = sacola.includes(p.id);
    return `<article class="etiqueta">
      <div class="arte" style="background:${p.cor}">${p.ano}</div>
      <div class="corpo">
        <span class="lote">Lote ${String(p.id).padStart(3,"0")}, ${p.cat}</span>
        <h3>${p.nome}</h3>
        <p class="desc">${p.desc}</p>
        <span class="estado">${p.estado}</span>
        <div class="preco-linha">
          <span class="preco">${brl(p.preco)}</span>
          <button class="add" data-id="${p.id}" ${naSacola ? "disabled" : ""}>${naSacola ? "Na sacola" : "Reservar"}</button>
        </div>
      </div></article>`;
  }).join("");
}

function renderSacola(){
  const itens = sacola.map(id => produtos.find(p => p.id === id));
  $("contador").textContent = itens.length;
  $("itens").innerHTML = itens.length
    ? itens.map(p => `<li><div>${p.nome}<small>${brl(p.preco)}</small></div><button data-rem="${p.id}">Remover</button></li>`).join("")
    : "<li>Sua sacola está vazia. Escolha uma peça do acervo.</li>";
  $("total").textContent = brl(itens.reduce((s,p) => s + p.preco, 0));
  $("finalizar").disabled = !itens.length;
}

function gaveta(abrir){
  $("gaveta").classList.toggle("aberta", abrir);
  $("gaveta").setAttribute("aria-hidden", !abrir);
  $("fundo").hidden = !abrir;
}

function atualizar(){ salvar(); renderGrade(); renderSacola(); }

document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.cat){ categoria = t.dataset.cat; renderCategorias(); renderGrade(); }
  if (t.dataset.id){ sacola.push(Number(t.dataset.id)); atualizar(); aviso("Peça adicionada à sacola"); }
  if (t.dataset.rem){ sacola = sacola.filter(id => id !== Number(t.dataset.rem)); atualizar(); }
});
$("busca").addEventListener("input", renderGrade);
$("ordem").addEventListener("change", renderGrade);
$("abrirCarrinho").addEventListener("click", () => gaveta(true));
$("fechar").addEventListener("click", () => gaveta(false));
$("fundo").addEventListener("click", () => gaveta(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") gaveta(false); });
$("limpar").addEventListener("click", () => { sacola = []; atualizar(); });
$("finalizar").addEventListener("click", () => {
  const n = sacola.length;
  sacola = []; atualizar(); gaveta(false);
  aviso(`Reserva enviada: ${n} ${n > 1 ? "peças" : "peça"}. Entraremos em contato.`);
});

renderCategorias();
atualizar();
