// Rend une planche .dc.html (maquette du canevas) en HTML statique.
// Usage : node tools/render-dc.mjs <planche.dc.html> <sortie.html> [etatJSON]
import fs from 'node:fs';
const [src, out, stateArg] = process.argv.slice(2);
const html = fs.readFileSync(src, 'utf8');
const code = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
class DCLogic { constructor(p) { this.props = p; } setState() {} }
const Component = new Function('DCLogic', code + '\nreturn Component;')(DCLogic);
const comp = new Component({});
if (stateArg) Object.assign(comp.state, JSON.parse(stateArg));
const vals = comp.renderVals();

const ev = (expr, scope) => {
  try { return new Function(...Object.keys(scope), `return (${expr});`)(...Object.values(scope)); }
  catch (e) { throw new Error(`Expression invalide : ${expr} (${e.message})`); }
};
const esc = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const interp = (s, scope) => s.replace(/\{\{([\s\S]+?)\}\}/g, (_, e) => {
  const v = ev(e.trim(), scope);
  return typeof v === 'function' ? '' : esc(v);
});

// Trouve la balise fermante correspondante en tenant compte de l'imbrication.
function block(s, start, tag) {
  const re = new RegExp(`<${tag}\\b|</${tag}>`, 'g');
  re.lastIndex = start + 1; let depth = 1, m;
  while ((m = re.exec(s))) { depth += m[0].startsWith('</') ? -1 : 1; if (!depth) return [m.index, m.index + m[0].length]; }
  throw new Error(`<${tag}> non fermée`);
}
function render(s, scope) {
  let res = '', i = 0;
  const re = /<sc-(for|if)\b([^>]*)>/g; let m;
  while ((m = re.exec(s))) {
    if (m.index < i) continue;
    res += interp(s.slice(i, m.index), scope);
    const [cs, ce] = block(s, m.index, 'sc-' + m[1]);
    const inner = s.slice(m.index + m[0].length, cs);
    const attr = n => (m[2].match(new RegExp(`${n}="\\{\\{([\\s\\S]*?)\\}\\}"`)) || [])[1];
    if (m[1] === 'for') {
      const as = m[2].match(/as="(\w+)"/)[1];
      (ev(attr('list'), scope) || []).forEach((it, idx) => { res += render(inner, { ...scope, [as]: it, [as + 'Index']: idx }); });
    } else if (ev(attr('value'), scope)) res += render(inner, scope);
    i = ce; re.lastIndex = ce;
  }
  return res + interp(s.slice(i), scope);
}
const body = html.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1];
const helmet = (body.match(/<helmet>([\s\S]*?)<\/helmet>/) || [, ''])[1];
const main = render(body.replace(/<helmet>[\s\S]*?<\/helmet>/, ''), vals)
  .replace(/\s(hint-placeholder-[a-z]+|onClick)="[^"]*"/g, '');
fs.writeFileSync(out, JSON.stringify({ helmet, main }));
console.log(`ok : ${main.length} caractères`);
