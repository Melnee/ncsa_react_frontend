import { useState, useMemo } from "react";

export default function ProductList({ title, items=[] }) {
  const PAGE = 5;
  const [start, setStart] = useState(0);
  const maxStart = Math.max(0, items.length - PAGE);
  const view = useMemo(() => items.slice(start, start + PAGE), [items, start]);

  const prev = () => setStart(s => Math.max(0, s - 1));
  const next = () => setStart(s => Math.min(maxStart, s + 1));

  const fallback = "https://placehold.co/128x128?text=img";

  return (
    <section style={{padding:16,border:"1px solid #eee",borderRadius:12,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <h2 style={{margin:0}}>{title}</h2>
        <div style={{display:"flex",gap:8}}>
          <button onClick={prev} disabled={start===0}>←</button>
          <button onClick={next} disabled={start>=maxStart}>→</button>
        </div>
      </div>

      <ul style={{listStyle:"none",padding:0,margin:0,display:"grid",gridTemplateColumns:"repeat(5, minmax(0,1fr))",gap:16}}>
        {view.map(p=>(
          
          <li key={p.id} style={{border:"1px solid #f0f0f0",borderRadius:12,padding:12,display:"flex",flexDirection:"column",gap:8,alignItems:"center",textAlign:"center"
          }}>
            <img
              alt={p.name}
              src={p.image}
              width="64" height="64"
              loading="lazy"
              onError={e => { e.currentTarget.onerror=null; e.currentTarget.src=fallback; }}
              style={{objectFit:"cover",borderRadius:8}}
            />
            <div style={{minWidth:0}}>
              <div style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
              <small>Reviews: {p.totalreviews} · Rating: {Number(p.rating).toFixed(2)} · ${Number(p.price).toFixed(2)}</small>
            </div>
          </li>
        ))}
      </ul>

      <div style={{marginTop:8,fontSize:12,color:"#666"}}>
        Showing {start+1}-{Math.min(start+PAGE, items.length)} of {items.length}
      </div>
    </section>
  );
}
