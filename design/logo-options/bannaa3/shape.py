import sys, json, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.recordingPen import DecomposingRecordingPen

def shape(path, text, wght=None):
    blob = hb.Blob.from_file_path(path); face = hb.Face(blob); font = hb.Font(face)
    if wght: font.set_variations({'wght': wght})
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font, buf)
    tt = TTFont(path)
    loc = {'wght': wght} if wght and 'fvar' in tt else None
    gs = tt.getGlyphSet(location=loc) if loc else tt.getGlyphSet()
    order = tt.getGlyphOrder()
    upm = tt['head'].unitsPerEm
    x = 0; out = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        pen = SVGPathPen(gs)
        # place glyph: flip y later in svg transform
        rec = DecomposingRecordingPen(gs); gs[name].draw(rec)
        from fontTools.pens.transformPen import TransformPen
        tp = TransformPen(pen, (1, 0, 0, 1, x + pos.x_offset, pos.y_offset))
        rec.replay(tp)
        from fontTools.pens.boundsPen import BoundsPen
        bp = BoundsPen(gs); rec.replay(TransformPen(bp, (1, 0, 0, 1, x + pos.x_offset, pos.y_offset)))
        out.append({'name': name, 'cluster': info.cluster, 'd': pen.getCommands(), 'x': x + pos.x_offset, 'adv': pos.x_advance, 'bbox': bp.bounds})
        x += pos.x_advance
    return out, x, upm

if __name__ == '__main__':
    path, text = sys.argv[1], sys.argv[2]
    w = float(sys.argv[3]) if len(sys.argv) > 3 else None
    g, adv, upm = shape(path, text, w)
    print(json.dumps({'adv': adv, 'upm': upm, 'glyphs': [{k: v for k, v in x.items() if k not in ('d',)} for x in g]}, ensure_ascii=False))
