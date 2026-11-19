# Builds the tensquads lockup (Ten · Pure mark + Inter 600 wordmark, outlined) as SVG.
import sys, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from io import BytesIO

src, out = sys.argv[1], sys.argv[2]
font = instantiateVariableFont(TTFont(src), {'wght': 600, 'opsz': 32})
buf = BytesIO(); font.save(buf); data = buf.getvalue()
upm = font['head'].unitsPerEm
f = hb.Font(hb.Face(data)); f.scale = (upm, upm)
b = hb.Buffer(); b.add_str('tensquads'); b.guess_segment_properties()
hb.shape(f, b, {'kern': True, 'liga': True})
gs = font.getGlyphSet(); order = font.getGlyphOrder()

SIZE = 42.0; TRACK = -0.02 * upm; BASE = 44.6; X0 = 81.0
s = SIZE / upm
pen = SVGPathPen(gs); bp = BoundsPen(gs)
x = 0
for info, pos in zip(b.glyph_infos, b.glyph_positions):
    g = order[info.codepoint]
    t = (s, 0, 0, -s, X0 + (x + pos.x_offset) * s, BASE)
    gs[g].draw(TransformPen(pen, t)); gs[g].draw(TransformPen(bp, t))
    x += pos.x_advance + TRACK
d = pen.getCommands(); x0, y0, x1, y1 = bp.bounds
print('word bounds', x0, y0, x1, y1)

MARK = '<line x1="17" y1="13" x2="17" y2="7.5" stroke="{c}" stroke-width="2.4" stroke-linecap="round"/><circle cx="17" cy="6" r="2.8" fill="{c}"/><rect x="8" y="13" width="18" height="40" rx="9" fill="{c}"/><circle cx="49" cy="33" r="15.5" fill="none" stroke="{ink}" stroke-width="9"/>'
W = round(x1 + 8, 1); H = 64
def svg(coral, ink):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="tensquads">'
            + MARK.format(c=coral, ink=ink) + f'<path fill="{ink}" d="{d}"/></svg>\n')
open(out + '/tensquads-logo.svg', 'w').write(svg('#E9806A', '#151515'))
open(out + '/tensquads-logo-white.svg', 'w').write(svg('#F09A85', '#FFFFFF'))
print('viewBox', W, H)
