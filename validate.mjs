import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.join(import.meta.dirname,'dist');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate HTML IDs');
for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 if(url.startsWith('#')){assert(url==='#'||ids.includes(url.slice(1)),`Missing section: ${url}`);continue;}
 if(/^(https:|tel:)/.test(url))continue;
 assert(fs.existsSync(path.join(root,url.split("?")[0])),`Missing asset: ${url}`);
}
assert(html.includes('noindex,nofollow'));

assert(html.includes('tel:+79810981580'));
const cfg=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'.openai/hosting.json')));
assert.equal(cfg.static.directory,'dist');
const files=fs.readdirSync(root,{recursive:true}).filter(f=>fs.statSync(path.join(root,f)).isFile());
console.log(JSON.stringify({staticProduction:'passed',files:files.length,bytes:files.reduce((n,f)=>n+fs.statSync(path.join(root,f)).size,0),internalAnchors:'passed',localAssets:'passed',scripts:1}));
