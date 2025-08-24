import { useState, useMemo, useEffect } from "react";

const useMedia = q => {
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mm = window.matchMedia(q);
    const h = e => setM(e.matches);
    mm.addEventListener("change", h);
    return () => mm.removeEventListener("change", h);
  }, [q]);
  return m;
};

export default function ProductList({ title, items=[] }) {
  const isMobile = useMedia("(max-width: 479px)");
  const PAGE = isMobile ? 4 : 5;

  const [start, setStart] = useState(0);
  const maxStart = Math.max(0, items.length - PAGE);
  const view = useMemo(() => items.slice(start, start + PAGE), [items, start, PAGE]);

  useEffect(() => {   
    setStart(s => Math.min(s, Math.max(0, items.length - PAGE)));
  }, [items.length, PAGE]);

  const prev = () => setStart(s => Math.max(0, s - PAGE));
  const next = () => setStart(s => Math.min(maxStart, s + PAGE));
  
  const fallback = "https://placehold.co/128x128?text=img";

  return (
    <section style={{padding:16,border:"1px solid #eee",borderRadius:12,overflow:"hidden"}}>
      <style>{`
        .product-grid{
          display:grid;
          grid-template-columns: repeat(2, minmax(0,1fr)); /* 2x2 = 4 on phones */
          gap:12px;
        }
        @media (min-width:480px){ .product-grid{ grid-template-columns: repeat(3, minmax(0,1fr)); } }
        @media (min-width:768px){ .product-grid{ grid-template-columns: repeat(4, minmax(0,1fr)); } }
        @media (min-width:1024px){ .product-grid{ grid-template-columns: repeat(5, minmax(0,1fr)); } }

        /* constant card size */
        .product-card{
          display:flex; flex-direction:column; align-items:center; text-align:center;
          border:1px solid #f0f0f0; border-radius:12px; padding:12px; gap:8px;
          min-height: 180px; /* keep visual consistency */
        }
        .product-img{ width:72px; height:72px; object-fit:cover; border-radius:8px; }

        .name{ 
          font-weight:600; line-height:1.2;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
          overflow:hidden; white-space:normal; word-break:break-word;
          min-height: 2.4em; /* reserve space for 2 lines */
        }

        .pager button{ min-width:44px; min-height:44px; padding:6px 10px; border-radius:10px; border:1px solid #ddd; background:#fff; }
        .pager button:disabled{ opacity:.4; }
      `}</style>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <h2 style={{margin:0}}>{title}</h2>
        <div className="pager" style={{display:"flex",gap:8}}>
        <button
          onClick={prev}
          style={{visibility: start===0 ? "hidden" : "visible"}}
          aria-label="Previous page"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          onClick={next}
          style={{visibility: start>=maxStart ? "hidden" : "visible"}}
          aria-label="Next page"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        </div>
      </div>

      <ul className="product-grid" style={{listStyle:"none",padding:0,margin:0}}>
        {view.map(p=>(
          <li key={p.id} className="product-card">
            <img
              alt={p.name}
              src={p.image}
              loading="lazy"
              onError={e => { e.currentTarget.onerror=null; e.currentTarget.src=fallback; }}
              className="product-img"
            />
            <div style={{minWidth:0}}>
              <div className="name">{p.name}</div>
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
