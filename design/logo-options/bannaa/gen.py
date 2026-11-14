import sys
# Square-Kufic بنّاء on a 10x10 brick grid (col 0 = left, row 0 = top). Read right to left.
INK, DOT = 'L', 'D'
cells = {}
def put(c, r, k=INK): cells[(c, r)] = k
for c in range(4, 10): put(c, 7)            # baseline joining ب ن ا
for r in (5, 6): put(9, r)                   # ب tooth
put(9, 9, DOT)                               # ب dot below
for r in (5, 6): put(7, r)                   # ن tooth
put(7, 3, DOT)                               # ن dot above
for c in (6, 7, 8): put(c, 1)                # shadda base
put(6, 0); put(8, 0)                         # shadda prongs
for r in range(0, 7): put(4, r)              # alef
for c in (1, 2): put(c, 5)                   # hamza head
put(1, 6)
for c in (0, 1, 2): put(c, 7)                # hamza tail
def svg(field=None, ink='#151515', dot='#E9806A', bg=None, rx=0.9, gap=0.9, pad=0, size=10, cols=10, rows=10, radius=0):
    u = size
    W = cols * u + 2 * pad; H = rows * u + 2 * pad
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="بنّاء">']
    if bg: out.append(f'<rect width="{W}" height="{H}" rx="{radius}" fill="{bg}"/>')
    for r in range(rows):
        for c in range(cols):
            k = cells.get((c, r))
            fill = ink if k == INK else dot if k == DOT else field
            if not fill: continue
            x = pad + c * u + gap / 2; y = pad + r * u + gap / 2; s = u - gap
            out.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{s:.1f}" height="{s:.1f}" rx="{rx}" fill="{fill}"/>')
    out.append('</svg>')
    return ''.join(out)
open('a-letters.svg', 'w').write(svg())
open('b-wall.svg', 'w').write(svg(field='#EFE2D2', bg='#F8F0E6', pad=8, radius=18))
open('c-night.svg', 'w').write(svg(field='#2A2622', ink='#5FC4C0', dot='#F09A85', bg='#151515', pad=8, radius=18))
