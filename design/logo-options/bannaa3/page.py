import re
def svg(f):
    s = open(f).read(); return re.sub(r'<svg ', '<svg width="100%" height="100%" ', s, count=1)
opts = [
 ('1', 'Brick dots', 'نقاط من طوب', 'The dots of ب and ن are two coral bricks. Clean geometric Kufic, and the builder’s material is exactly where the letters need a mark.', '1-dots', '1-dots', '1-dots-icon'),
 ('2', 'Laid', 'مرصوص', 'The word stands on a two-course foundation laid in running bond, with brick dots above. The most literal: a name built on solid ground.', '2-laid', '2-laid', '2-laid-icon'),
 ('3', 'Brick ب', 'باء من طوب', 'The ب laid in bricks: a base course, two upright ends, the dot as the one coral brick. A monogram that is a wall; the wordmark beside it stays plain.', '3-ba', '3-word', '3-ba-icon'),
]
rows = ''
for n, en, ar, why, hero, word, icon in opts:
    lock_mark = f'<span class="mk">{svg(icon + ".svg")}</span>'
    rows += f'''<section class="opt"><div class="head"><span class="num">{n}</span><h2>{en} <span class="ar">{ar}</span></h2></div><p class="why">{why}</p>
<div class="grid"><div class="tile hero"><div class="big">{svg(hero + '.svg')}</div></div>
<div class="col"><div class="tile lock" dir="rtl">{lock_mark if n == '3' else ''}<span class="wm">{svg(word + '.svg')}</span></div>
<div class="tile sizes">{''.join(f'<span class="s{s}">{svg(icon + ".svg")}</span>' for s in (48, 32, 16))}<span class="cap">app icon · 48 · 32 · 16 px</span></div></div></div></section>'''
html = f'''<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@500&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>body{{margin:0;font-family:Inter,var(--font-sans),sans-serif;color:var(--foreground)}}
.opt{{padding:6px 0 24px;border-bottom:1px solid var(--border)}}.opt:last-child{{border-bottom:0}}
.head{{display:flex;align-items:center;gap:10px}}.num{{width:24px;height:24px;border-radius:999px;background:var(--secondary);font-size:12px;font-weight:600;display:grid;place-items:center}}
h2{{margin:0;font-size:20px;letter-spacing:-.02em}} .ar{{font-family:'IBM Plex Sans Arabic';font-weight:500;color:var(--muted-foreground);font-size:16px}}
.why{{margin:6px 0 14px;color:var(--muted-foreground);font-size:14px;line-height:1.5;max-width:62ch}}
.grid{{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:10px}}.col{{display:grid;gap:10px}}
.tile{{border-radius:var(--radius);padding:16px;display:flex;align-items:center;background:#fcfcfc;box-shadow:inset 0 0 0 1px rgba(13,13,13,.08)}}
.hero{{justify-content:center;min-height:180px}} .big{{width:240px;height:150px}}
.lock{{gap:10px}} .mk{{width:34px;height:34px;flex:none}} .wm{{height:40px;width:110px;flex:none}}
.sizes{{gap:14px}} .s48{{width:48px;height:48px}}.s32{{width:32px;height:32px}}.s16{{width:16px;height:16px}} .s48,.s32,.s16{{flex:none;display:block}}
.cap{{margin-inline-start:auto;font-size:12px;color:#767676}}
@media (max-width:560px){{.grid{{grid-template-columns:1fr}}}}</style></head><body>{rows}</body></html>'''
open('options.html', 'w').write(html)
