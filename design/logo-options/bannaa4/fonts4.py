import sys
sys.path.insert(0, sys.argv[1]); OUT = sys.argv[2]; F = sys.argv[3]
from shape import shape
from fontTools.ttLib import TTFont
INK = '#151515'
FONTS = [  # file, weight, label, note
 ('Rubik.ttf', 700, 'Rubik', 'Rounded corners that match the bricks; friendly, modern, very legible.'),
 ('Baloo.ttf', 700, 'Baloo Bhaijaan', 'Soft and round; the warmest and most playful, closest to the mascots.'),
 ('ReadexPro.ttf', 700, 'Readex Pro', 'Clean geometric sans with open forms; calm and product-like.'),
 ('Alexandria.ttf', 700, 'Alexandria', 'Wide geometric sans; strong and architectural, pairs with the English Inter.'),
 ('Almarai.ttf', None, 'Almarai', 'Compact contemporary sans; neutral and highly readable at small sizes.'),
 ('ElMessiri.ttf', 700, 'El Messiri', 'Calligraphic contrast inside a modern frame; the most traditional.'),
]
def bbox_union(gs):
    b = None
    for x in gs:
        if not x['bbox']: continue
        bb = x['bbox']
        b = bb if b is None else (min(b[0], bb[0]), min(b[1], bb[1]), max(b[2], bb[2]), max(b[3], bb[3]))
    return b
meta = []
for f, w, label, note in FONTS:
    path = F + '/' + f
    tt = TTFont(path)
    wt = w if 'fvar' in tt else None
    g, adv, upm = shape(path, 'بنّاء', wt)
    x0, y0, x1, y1 = bbox_union(g)
    pad = 30
    body = ''.join(f'<path d="{x["d"]}" fill="{INK}"/>' for x in g)
    vb = f'{x0 - pad:.0f} {-(y1 + pad):.0f} {x1 - x0 + 2*pad:.0f} {y1 - y0 + 2*pad:.0f}'
    name = label.lower().replace(' ', '-')
    open(f'{OUT}/word-{name}.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="بنّاء"><g transform="scale(1,-1)">{body}</g></svg>')
    meta.append((name, label, note, (x1 - x0 + 2*pad) / (y1 - y0 + 2*pad)))
import json; json.dump(meta, open(f'{OUT}/fonts.json', 'w'), ensure_ascii=False)
print('ok')
