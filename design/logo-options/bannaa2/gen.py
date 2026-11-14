import sys, re
sys.path.insert(0, sys.argv[1])
from shape import shape
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
OUT = sys.argv[2]; F = sys.argv[3]
INK, CORAL = '#151515', '#E9806A'
REEM, LALE = F + '/ReemKufi.ttf', F + '/Lalezar-Regular.ttf'

def bounds(path, glyphs, wght):
    tt = TTFont(path); gs = tt.getGlyphSet(location={'wght': wght} if wght and 'fvar' in tt else None)
    return gs

def glyph_bbox(gs, name, x):
    bp = BoundsPen(gs); gs[name].draw(bp)
    b = bp.bounds
    return None if not b else (b[0] + x, b[1], b[2] + x, b[3])

def svg_doc(parts, bbox, pad, bg=None, rx=0, square=False):
    x0, y0, x1, y1 = bbox
    w, h = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
    if square:
        s = max(w, h); cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        x0, x1, y0, y1 = cx - s / 2 + pad, cx + s / 2 - pad, cy - s / 2 + pad, cy + s / 2 - pad
        w = h = s
    vb = f'{x0 - pad:.0f} {-(y1 + pad):.0f} {w:.0f} {h:.0f}'
    bgr = f'<rect x="{x0 - pad:.0f}" y="{-(y1 + pad):.0f}" width="{w:.0f}" height="{h:.0f}" rx="{rx}" fill="{bg}"/>' if bg else ''
    body = ''.join(f'<path d="{d}" fill="{c}"/>' if not d.startswith('<') else d for d, c in parts)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="بنّاء">{bgr}<g transform="scale(1,-1)">{body}</g></svg>'

def word(path, wght, colors, replace_alef=None):
    g, adv, upm = shape(path, 'بنّاء', wght)
    gs = bounds(path, g, wght)
    parts = []; bb = [1e9, 1e9, -1e9, -1e9]
    for x in g:
        b = glyph_bbox(gs, x['name'], x['x'])
        if 'alef' in x['name'] or x['name'] == 'uniFE8E':
            if replace_alef:
                p, b = replace_alef(b)
                parts += p
                for i in range(4): bb[i] = min(bb[i], b[i]) if i < 2 else max(bb[i], b[i])
                continue
        col = INK
        for k, v in colors.items():
            if k in x['name']: col = v
        parts.append((x['d'], col))
        if b:
            for i in range(4): bb[i] = min(bb[i], b[i]) if i < 2 else max(bb[i], b[i])
    return parts, bb

def capsule_alef(b):
    # Petra: capsule as wide as the alef stroke, same height, antenna dot above.
    x0, y0, x1, y1 = b
    w = (x1 - x0) * 0.8; cx = x0 + w / 2; r = w / 2
    top = y1 - w * 0.95
    rect = f'<rect x="{cx - r:.1f}" y="{y0:.1f}" width="{w:.1f}" height="{top - y0:.1f}" rx="{r:.1f}" fill="{CORAL}"/>'
    stem = f'<rect x="{cx - w*0.11:.1f}" y="{top - 2:.1f}" width="{w*0.22:.1f}" height="{w*0.34:.1f}" fill="{CORAL}"/>'
    ball = f'<circle cx="{cx:.1f}" cy="{top + w*0.46:.1f}" r="{w*0.22:.1f}" fill="{CORAL}"/>'
    eye = f'<circle cx="{cx - w*0.08:.1f}" cy="{top - w*0.75:.1f}" r="{w*0.0:.1f}" fill="#fff"/>'
    return [(rect, ''), (stem, ''), (ball, '')], (cx - r, y0, cx + r, top + w * 0.7)

def save(name, svg): open(f'{OUT}/{name}.svg', 'w').write(svg)

# 1. Alef as Petra
p, bb = word(REEM, 700, {}, capsule_alef)
save('1-alef', svg_doc(p, bb, 40))
p2, bb2 = word(REEM, 700, {}, capsule_alef)
# icon: the word on a dark tile
save('1-alef-icon', svg_doc([(d, '#fff' if c == INK else c) if not d.startswith('<') else (d, c) for d, c in p2], bb2, 150, bg=INK, rx=230, square=True))

# 2. Shadda
p, bb = word(REEM, 700, {'shadda': CORAL})
save('2-shadda', svg_doc(p, bb, 40))
g, adv, upm = shape(REEM, 'ّ', 700); gs = bounds(REEM, g, 700)
sd = [x for x in g if 'shadda' in x['name']][0]; sb = glyph_bbox(gs, sd['name'], sd['x'])
save('2-shadda-icon', svg_doc([(sd['d'], '#fff')], sb, 170, bg=CORAL, rx=230, square=True))

# 3. ب foundation: Lalezar, dots in coral (dots are the glyph's small closed contours; the shadda stays ink)
import re as _re
def split_dots(d, gs_name):
    subs = [m for m in _re.split(r'(?=M)', d) if m.strip()]
    out = []
    for sp in subs:
        nums = [float(v) for v in _re.findall(r'-?\d+\.?\d*', sp)]
        xs, ys = nums[0::2], nums[1::2]
        area = (max(xs) - min(xs)) * (max(ys) - min(ys)) if xs else 0
        out.append((sp, area))
    big = max(a for _, a in out)
    return [(sp, CORAL if a <= 35000 and 'shadda' not in gs_name and gs_name != 'uni0651' else None) for sp, a in out]
def lalezar(text, dot_col, ink):
    g, adv, upm = shape(LALE, text); gs = bounds(LALE, g, None)
    parts = []; bb = [1e9, 1e9, -1e9, -1e9]
    for x in g:
        b = glyph_bbox(gs, x['name'], x['x'])
        if x['name'] in ('uniFE91', 'uniFEE8', 'uni0628', 'uniFE8F'):
            for sp, c in split_dots(x['d'], x['name']): parts.append((sp, dot_col if c else ink))
        else:
            parts.append((x['d'], ink))
        for i in range(4): bb[i] = min(bb[i], b[i]) if i < 2 else max(bb[i], b[i])
    return parts, bb
p, bb = lalezar('بنّاء', CORAL, INK); save('3-ba', svg_doc(p, bb, 40))
p, bb = lalezar('ب', CORAL, '#fff'); save('3-ba-icon', svg_doc(p, bb, 170, bg=INK, rx=230, square=True))
print('ok')
