import re, json
def svg(f):
    s = open(f).read(); return re.sub(r'<svg ', '<svg width="100%" height="100%" ', s, count=1)
meta = json.load(open('fonts.json'))
icon = svg('3-ba-icon.svg')
cards = ''
for i, (name, label, note, ratio) in enumerate(meta, 1):
    w = svg(f'word-{name}.svg')
    cards += f'''<div class="card"><div class="tile big" dir="rtl"><span class="ic">{icon}</span><span class="wm" style="aspect-ratio:{ratio:.3f}">{w}</span></div>
<div class="tile nav" dir="rtl"><span class="ic s">{icon}</span><span class="wm s" style="aspect-ratio:{ratio:.3f}">{w}</span><span class="links">الوكلاء · طريقة العمل · الأسعار</span></div>
<div class="cap"><b>{i}. {label}</b><p>{note}</p></div></div>'''
html = f'''<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@500&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>body{{margin:0;font-family:Inter,var(--font-sans),sans-serif;color:var(--foreground)}}
.grid{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 12px}}
.tile{{border-radius:var(--radius);display:flex;align-items:center;gap:12px;background:#fcfcfc;box-shadow:inset 0 0 0 1px rgba(13,13,13,.08)}}
.big{{padding:22px;justify-content:center;min-height:110px}} .ic{{width:64px;height:64px;flex:none}} .wm{{height:72px;flex:none}}
.nav{{margin-top:8px;padding:10px 14px}} .ic.s{{width:28px;height:28px}} .wm.s{{height:30px}}
.links{{margin-inline-start:auto;font-family:'IBM Plex Sans Arabic';font-size:12px;color:#5d5d5d}}
.cap{{padding:8px 2px 0;font-size:13px;line-height:1.45}} .cap p{{margin:3px 0 0;color:var(--muted-foreground)}}
@media (max-width:560px){{.grid{{grid-template-columns:1fr}}}}</style></head><body><div class="grid">{cards}</div></body></html>'''
open('options.html', 'w').write(html)
