import sys, re
sys.path.insert(0, sys.argv[1]); OUT = sys.argv[2]; F = sys.argv[3]
from shape import shape
INK, CORAL, CORAL2 = '#151515', '#E9806A', '#D4664F'
REEM = F + '/ReemKufi.ttf'
BW, BH = 230, 108  # brick ≈ one stroke tall, 2:1 like a real brick

def pbox(d):
    n = [float(v) for v in re.findall(r'-?\d+\.?\d*', d)]
    xs, ys = n[0::2], n[1::2]
    return min(xs), min(ys), max(xs), max(ys)

def union(a, b):
    return (min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3])) if a else b

def doc(body, bb, pad, bg=None, rx=0, square=False, padx=None):
    x0, y0, x1, y1 = bb
    px = pad if padx is None else padx
    w, h = x1 - x0 + 2 * px, y1 - y0 + 2 * pad
    if square:
        s = max(w, h); cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        X, Y, w, h = cx - s / 2, cy - s / 2, s, s
    else:
        X, Y = x0 - px, y0 - pad
    bgr = f'<rect x="{X:.0f}" y="{-(Y + h):.0f}" width="{w:.0f}" height="{h:.0f}" rx="{rx}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{X:.0f} {-(Y + h):.0f} {w:.0f} {h:.0f}" role="img" aria-label="بنّاء">{bgr}<g transform="scale(1,-1)">{body}</g></svg>'

def brick(cx, cy, w, h, fill, rx=None):
    rx = h * 0.18 if rx is None else rx
    return f'<rect x="{cx - w/2:.1f}" y="{cy - h/2:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx:.1f}" fill="{fill}"/>'

def word(text='بنّاء', wght=700, ink=INK, dots='brick'):
    g, adv, upm = shape(REEM, text, wght)
    body = ''; bb = None
    for x in g:
        b = x['bbox']
        if 'dot' in x['name'] and dots == 'brick':
            cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
            body += brick(cx, cy, BW, BH, CORAL)
            b = (cx - BW/2, cy - BH/2, cx + BW/2, cy + BH/2)
        else:
            body += f'<path d="{x["d"]}" fill="{ink}"/>'
        bb = union(bb, b) if b else bb
    return body, bb

def course(x0, x1, y_top, bw=210, bh=78, gap=18, rows=2):
    # running bond: alternate rows offset by half a brick, clipped to [x0, x1]
    out = ''
    for r in range(rows):
        y = y_top - r * (bh + gap) - bh / 2
        off = 0 if r % 2 == 0 else (bw + gap) / 2
        x = x1 + off
        while x - bw > x0 - bw:
            a, b = max(x - bw, x0), min(x, x1)
            if b - a > bh * 0.6:
                out += brick((a + b) / 2, y, b - a, bh, CORAL if (r + int((x1 - x) // bw)) % 3 else CORAL2)
            x -= bw + gap
    return out, (x0, y_top - rows * (bh + gap), x1, y_top)

def save(n, s): open(f'{OUT}/{n}.svg', 'w').write(s)

# 1. Brick dots
b, bb = word(); save('1-dots', doc(b, bb, 50))
b, bb = word('ب', 800, '#fff'); save('1-dots-icon', doc(b, bb, 230, bg=INK, rx=260, square=True))

# 2. Laid: plain word (bricks as dots too) standing on a two-course foundation
b, bb = word(dots='brick')
c, cb = course(bb[0] - 10, bb[2] + 10, bb[1] - 40)
save('2-laid', doc(b + c, union(bb, cb), 50))
b2, bb2 = word('ب', 800, '#fff')
c2, cb2 = course(bb2[0] - 60, bb2[2] + 60, bb2[1] - 40)
save('2-laid-icon', doc(b2 + c2, union(bb2, cb2), 190, bg=INK, rx=260, square=True))

# 3. Brick ب: the letter laid in bricks. Body: base course of 3 bricks, two upright bricks at the ends,
# and the dot as one coral brick below. Wordmark beside it is the plain word.
def brick_ba(ink):
    bw, bh, g = 150, 70, 14
    parts = ''
    y = 0
    xs = [-(bw + g), 0, bw + g]
    for x in xs: parts += brick(x, y, bw, bh, ink)
    # upright ends (rotated bricks) rising from the base
    ux = 1.5 * bw + g - bh / 2
    parts += brick(ux, y + bh / 2 + g + bw / 2 - bh / 2 + 4, bh, bw, ink)
    parts += brick(-ux, y + bh / 2 + g + bw / 2 - bh / 2 + 4, bh, bw, ink)
    parts += brick(0, y - bh - g * 1.6, bw, bh, CORAL)
    top = y + bh / 2 + g + bw - bh / 2 + 4
    return parts, (-1.5 * bw - g, y - 1.5 * bh - g * 1.6, 1.5 * bw + g, top)
p, pb = brick_ba(INK); save('3-ba', doc(p, pb, 40))
p, pb = brick_ba('#fff'); save('3-ba-icon', doc(p, pb, 150, bg=INK, rx=260, square=True))
b, bb = word(dots='plain'); save('3-word', doc(b, bb, 50))
print('ok')
