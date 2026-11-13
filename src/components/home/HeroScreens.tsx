import type { ReactNode } from 'react'
import { useHome } from './context'
import {
  Badge,
  BarRow,
  Chip,
  Chrome,
  ChatMsg,
  CodeRow,
  InitialAvatar,
  KV,
  MascotAvatar,
  Pill,
  Title,
  Value,
  Win,
  WinBody,
  toneFor,
} from './ui'

// The 13 floating product mockups behind the round table. Each one fades and rises in
// when its focus index is active. Coordinates are the design's pixel positions inside the 560x440 box.

// A chat speaker is either a mascot (slug) or a plain initial letter.
function avatarFor(m: { slug?: string; initial?: string }) {
  return m.slug ? <MascotAvatar slug={m.slug} /> : <InitialAvatar letter={m.initial ?? ''} />
}

function Screen({ index, focus, label, children }: { index: number; focus: number; label: string; children: ReactNode }) {
  const on = index === focus
  return (
    <div
      data-screen-label={label}
      style={{
        position: 'absolute',
        inset: 0,
        transition: 'opacity .7s ease,transform .9s cubic-bezier(.4,0,.1,1)',
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(28px)',
      }}
    >
      {children}
    </div>
  )
}

export function HeroScreens({ focus }: { focus: number }) {
  const { c } = useHome()
  const s = c.screens

  return (
    <>
      {/* 0: petra */}
      <Screen index={0} focus={focus} label="petra">
        <Win left={0} top={14} width={350}>
          <Chrome label={s.petra.chat} />
          <WinBody>
            {s.petra.msgs.map((m, k) => (
              <ChatMsg
                key={k}
                avatar={avatarFor(m)}
                name={m.name}
                time={m.time}
                text={m.text}
              />
            ))}
          </WinBody>
        </Win>
        <Win left={236} top={214} width={324} dark ltr>
          <Chrome dark label={s.petra.plan} />
          <WinBody>
            {s.petra.planRows.map(([verb, text], k) => (
              <CodeRow key={k} verb={verb} verbColor="#EBA196" text={text} />
            ))}
          </WinBody>
        </Win>
        <Pill left={14} top={384} dot="#C9746A">
          {s.petra.pill}
        </Pill>
      </Screen>

      {/* 1: machu */}
      <Screen index={1} focus={focus} label="machu">
        <Win left={0} top={14} width={350}>
          <Chrome label={s.machu.chrome} />
          <WinBody>
            <Title>{s.machu.title}</Title>
            {s.machu.rows.map(([label, value], k) => (
              <BarRow key={k} label={label} pct={[70, 78, 85, 75][k]} value={value} color={k === 3 ? '#5EA885' : '#93D2B1'} />
            ))}
          </WinBody>
        </Win>
        <Win left={250} top={204} width={310}>
          <Chrome label={s.machu.chrome2} />
          <WinBody>
            <Title>{s.machu.title2}</Title>
            {s.machu.kv.map(([k, v]) => (
              <KV key={k} k={k}>
                <Value>{v}</Value>
              </KV>
            ))}
            <KV k={s.machu.suggested[0]}>
              <Badge tone="ok">{s.machu.suggested[1]}</Badge>
            </KV>
          </WinBody>
        </Win>
        <Pill left={14} top={384} dot="#5EA885">
          {s.machu.pill}
        </Pill>
      </Screen>

      {/* 2: alexandria */}
      <Screen index={2} focus={focus} label="alexandria">
        <Win left={0} top={14} width={360}>
          <Chrome label={s.alexandria.chrome} />
          <WinBody>
            <Title>{s.alexandria.title}</Title>
            {s.alexandria.rows.map(([k, v]) => (
              <KV key={k} k={k}>
                <Value>{v}</Value>
              </KV>
            ))}
          </WinBody>
        </Win>
        <Win left={262} top={210} width={298}>
          <Chrome label={s.alexandria.chrome2} />
          <WinBody>
            <Title>{s.alexandria.title2}</Title>
            <KV k={s.alexandria.titleStatus[0]}>
              <Badge tone="ok">{s.alexandria.titleStatus[1]}</Badge>
            </KV>
            <KV k={s.alexandria.photos[0]}>
              <Value>{s.alexandria.photos[1]}</Value>
            </KV>
            <KV k={s.alexandria.price[0]}>
              <Value>{s.alexandria.price[1]}</Value>
            </KV>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {s.alexandria.sizes.map((z) => (
                <Chip key={z} mono>
                  {z}
                </Chip>
              ))}
            </div>
          </WinBody>
        </Win>
        <Pill left={14} top={384} dot="#4F56C4">
          {s.alexandria.pill}
        </Pill>
      </Screen>

      {/* 3: angkor */}
      <Screen index={3} focus={focus} label="angkor">
        <Win left={0} top={14} width={330}>
          <Chrome label={s.angkor.chrome} />
          <WinBody>
            {s.angkor.blocks.map((b, k) => (
              <div
                key={k}
                style={{
                  height: [60, 44, 34, 34][k],
                  borderRadius: 8,
                  background: '#FFE7AE',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px',
                  fontSize: 11,
                  fontWeight: 500,
                  color: '#0d0d0d',
                }}
              >
                {b}
              </div>
            ))}
          </WinBody>
        </Win>
        <Win left={232} top={196} width={328} dark ltr>
          <Chrome dark label={s.angkor.chrome2} />
          <WinBody>
            {s.angkor.build.map(([verb, text, ok], k) => (
              <CodeRow key={k} verb={verb} verbColor="#F5C25C" text={text} ok={ok || undefined} />
            ))}
          </WinBody>
        </Win>
        <Pill left={14} top={384} dot="#D6952C">
          {s.angkor.pill}
        </Pill>
      </Screen>

      {/* 4: venice */}
      <Screen index={4} focus={focus} label="venice">
        <Win left={0} top={14} width={340}>
          <Chrome label={s.venice.chrome} />
          <WinBody>
            <Title>{s.venice.title}</Title>
            {s.venice.channels.map(([k, v]) => (
              <KV key={k} k={k}>
                <Badge tone="ok">{v}</Badge>
              </KV>
            ))}
            <div style={{ fontSize: 11.5, lineHeight: '16px', color: '#5d5d5d' }}>{s.venice.note}</div>
          </WinBody>
        </Win>
        <Win left={240} top={200} width={320}>
          <Chrome label={s.venice.chrome2} />
          <WinBody>
            <Title>{s.venice.title2}</Title>
            {s.venice.stock.map(([k, v]) => (
              <KV key={k} k={k}>
                <Value>{v}</Value>
              </KV>
            ))}
            <KV k={s.venice.inStep[0]}>
              <Badge tone="ok">{s.venice.inStep[1]}</Badge>
            </KV>
          </WinBody>
        </Win>
        <Pill left={14} top={384} dot="#C9529C">
          {s.venice.pill}
        </Pill>
      </Screen>

      {/* 5: rio */}
      <Screen index={5} focus={focus} label="rio">
        <Win left={0} top={14} width={340}>
          <Chrome label={s.rio.chrome} />
          <WinBody>
            <Title>{s.rio.title}</Title>
            {s.rio.bars.map(([label, value], k) => (
              <BarRow key={k} label={label} pct={[68, 56, 78][k]} value={value} color={k === 2 ? '#7E5ED0' : '#B194F2'} />
            ))}
            <div style={{ fontSize: 11.5, lineHeight: '16px', color: '#5d5d5d' }}>{s.rio.note}</div>
          </WinBody>
        </Win>
        <Win left={236} top={196} width={324}>
          <Chrome
            label={s.rio.chrome2}
            end={<span style={{ marginInlineStart: 'auto', fontSize: 11, color: '#767676' }}>{s.rio.today}</span>}
          />
          <WinBody>
            <ChatMsg avatar={<MascotAvatar slug="rio" />} name={s.rio.msg.name} time={s.rio.msg.time} text={s.rio.msg.text} />
            <div style={{ display: 'flex', gap: 6 }}>
              <span
                style={{
                  height: 26,
                  padding: '0 12px',
                  borderRadius: 999,
                  background: '#181818',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {s.rio.approve}
              </span>
              <span
                style={{
                  height: 26,
                  padding: '0 12px',
                  borderRadius: 999,
                  background: 'rgba(13,13,13,.06)',
                  color: '#0d0d0d',
                  fontSize: 12,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {s.rio.decline}
              </span>
            </div>
          </WinBody>
        </Win>
        <Pill left={14} top={384} dot="#7E5ED0">
          {s.rio.pill}
        </Pill>
      </Screen>

      {/* 6: giza */}
      <Screen index={6} focus={focus} label="giza">
        <Win left={0} top={14} width={340}>
          <Chrome label={s.giza.chrome} />
          <WinBody>
            <Title>{s.giza.title}</Title>
            {s.giza.bars.map(([label, value], k) => (
              <BarRow key={k} label={label} pct={[18, 72, 60, 90][k]} value={value} color={k === 0 ? '#D27A34' : '#F4A866'} />
            ))}
            <div style={{ fontSize: 11.5, lineHeight: '16px', color: '#5d5d5d' }}>{s.giza.note}</div>
          </WinBody>
        </Win>
        <Win left={246} top={214} width={314}>
          <Chrome label={s.giza.chrome2} />
          <WinBody>
            <Title>{s.giza.title2}</Title>
            {s.giza.kv.map(([k, v]) => (
              <KV key={k} k={k}>
                <Value>{v}</Value>
              </KV>
            ))}
            <KV k={s.giza.status[0]}>
              <Badge tone="ok">{s.giza.status[1]}</Badge>
            </KV>
          </WinBody>
        </Win>
        <Pill left={14} top={388} dot="#D27A34">
          {s.giza.pill}
        </Pill>
      </Screen>

      {/* 7: pisa */}
      <Screen index={7} focus={focus} label="pisa">
        <Win left={0} top={14} width={350}>
          <Chrome label={s.pisa.chrome} />
          <WinBody>
            {s.pisa.rows.map(([id, st, tone], k) => (
              <KV key={k} k={id}>
                {tone ? <Badge tone={toneFor(tone)}>{st}</Badge> : <Value>{st}</Value>}
              </KV>
            ))}
          </WinBody>
        </Win>
        <Win left={250} top={178} width={310}>
          <Chrome label={s.pisa.chrome2} />
          <WinBody>
            <Title>{s.pisa.title2}</Title>
            {s.pisa.kv.map(([k, v]) => (
              <KV key={k} k={k}>
                <Value>{v}</Value>
              </KV>
            ))}
            <KV k={s.pisa.tracking[0]}>
              <Badge tone="ok">{s.pisa.tracking[1]}</Badge>
            </KV>
          </WinBody>
        </Win>
        <Pill left={14} top={384} dot="#5F86D6">
          {s.pisa.pill}
        </Pill>
      </Screen>

      {/* 8: kyoto */}
      <Screen index={8} focus={focus} label="kyoto">
        <Win left={0} top={14} width={356}>
          <Chrome label={s.kyoto.chrome} />
          <WinBody>
            {s.kyoto.msgs.map((m, k) => (
              <ChatMsg
                key={k}
                avatar={avatarFor(m)}
                name={m.name}
                time={m.time}
                text={m.text}
              />
            ))}
          </WinBody>
        </Win>
        <Win left={256} top={222} width={304}>
          <Chrome label={s.kyoto.chrome2} />
          <WinBody>
            <Title>{s.kyoto.title2}</Title>
            {s.kyoto.kv.map(([k, v]) => (
              <KV key={k} k={k}>
                <Value>{v}</Value>
              </KV>
            ))}
          </WinBody>
        </Win>
        <Pill left={14} top={388} dot="#CC5A40">
          {s.kyoto.pill}
        </Pill>
      </Screen>

      {/* 9: zurich */}
      <Screen index={9} focus={focus} label="zurich">
        <Win left={0} top={14} width={330}>
          <Chrome label={s.zurich.chrome} />
          <WinBody>
            <Title>{s.zurich.title}</Title>
            {s.zurich.kv.map(([k, v]) => (
              <KV key={k} k={k}>
                <Value>{v}</Value>
              </KV>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderTop: '1px solid rgba(13,13,13,.08)',
                paddingTop: 9,
              }}
            >
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0d0d0d' }}>{s.zurich.total[0]}</span>
              <span style={{ fontSize: 22, lineHeight: '26px', fontWeight: 700, color: '#0d0d0d' }}>{s.zurich.total[1]}</span>
            </div>
          </WinBody>
        </Win>
        <Win left={240} top={214} width={320}>
          <Chrome label={s.zurich.chrome2} />
          <WinBody>
            {s.zurich.bars.map(([label, value], k) => (
              <BarRow key={k} label={label} pct={[82, 30, 20][k]} value={value} color={k === 0 ? '#7E8BA0' : '#B6C0CF'} />
            ))}
            <div style={{ fontSize: 11.5, lineHeight: '16px', color: '#5d5d5d' }}>{s.zurich.note}</div>
          </WinBody>
        </Win>
        <Pill left={14} top={384} dot="#7E8BA0">
          {s.zurich.pill}
        </Pill>
      </Screen>

      {/* 10: delphi */}
      <Screen index={10} focus={focus} label="delphi">
        <Win left={0} top={14} width={340}>
          <Chrome label={s.delphi.chrome} />
          <WinBody>
            <Title>{s.delphi.title}</Title>
            {s.delphi.bars.map(([label, value], k) => (
              <BarRow key={k} label={label} pct={[90, 70, 52, 40][k]} value={value} color={k === 0 ? '#7F9840' : '#B5CB72'} />
            ))}
          </WinBody>
        </Win>
        <Win left={244} top={196} width={316}>
          <Chrome label={s.delphi.chrome2} />
          <WinBody>
            <Title>{s.delphi.title2}</Title>
            {s.delphi.kv.map(([k, v]) => (
              <KV key={k} k={k}>
                <Value>{v}</Value>
              </KV>
            ))}
          </WinBody>
        </Win>
        <Pill left={14} top={384} dot="#7F9840">
          {s.delphi.pill}
        </Pill>
      </Screen>

      {/* 11: greenwich */}
      <Screen index={11} focus={focus} label="greenwich">
        <Win left={0} top={14} width={340}>
          <Chrome label={s.greenwich.chrome} />
          <WinBody>
            <Title>{s.greenwich.title}</Title>
            <div style={{ height: 64, borderRadius: 8, background: '#F6FBC4', position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 14,
                  height: 14,
                  margin: -7,
                  borderRadius: 999,
                  background: '#fa423e',
                  boxShadow: '0 0 0 3px #fff',
                }}
              />
            </div>
            <KV k={s.greenwich.kv[0][0]}>
              <Badge tone="ok">{s.greenwich.kv[0][1]}</Badge>
            </KV>
            <KV k={s.greenwich.kv[1][0]}>
              <Value>{s.greenwich.kv[1][1]}</Value>
            </KV>
          </WinBody>
        </Win>
        <Win left={250} top={222} width={310}>
          <Chrome label={s.greenwich.chrome2} />
          <WinBody>
            {s.greenwich.maps.map(([k, v, tone]) => (
              <KV key={k} k={k}>
                <Badge tone={toneFor(tone)}>{v}</Badge>
              </KV>
            ))}
          </WinBody>
        </Win>
        <Pill left={14} top={392} dot="#A8B824">
          {s.greenwich.pill}
        </Pill>
      </Screen>

      {/* 12: sydney */}
      <Screen index={12} focus={focus} label="sydney">
        <Win left={0} top={14} width={330}>
          <Chrome label={s.sydney.chrome} />
          <WinBody>
            <Title>{s.sydney.title}</Title>
            {s.sydney.rows.map(([k, v]) => (
              <KV key={k} k={k}>
                <Badge tone="ok">{v}</Badge>
              </KV>
            ))}
            <KV k={s.sydney.first[0]}>
              <Value>{s.sydney.first[1]}</Value>
            </KV>
          </WinBody>
        </Win>
        <Win left={236} top={206} width={324}>
          <Chrome label={s.sydney.chrome2} />
          <WinBody>
            {s.sydney.msgs.map((m, k) => (
              <ChatMsg
                key={k}
                avatar={avatarFor(m)}
                name={m.name}
                time={m.time}
                text={m.text}
              />
            ))}
          </WinBody>
        </Win>
        <Pill left={14} top={384} dot="#4C9EC2">
          {s.sydney.pill}
        </Pill>
      </Screen>
    </>
  )
}

