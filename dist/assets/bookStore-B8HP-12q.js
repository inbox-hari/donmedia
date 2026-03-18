import"./FlipbookReader-CtuZ8Z3s.js";import"./hero-stars-BadzpYtY.js";/* empty css              */import"./reader-modal-entry-Cos9IzTU.js";import{t as e}from"./supabase-client-PZdivSTP.js";var t=document.getElementById(`book-list`);function n(e){return String(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function r(t){if(console.log(`File path:`,t),!t)return``;if(/^(https?:|data:|blob:)/i.test(t)||t.includes(`/storage/v1/object/public/`))return t;let n=String(t).split(`/`);if(n.length<2)return console.warn(`Unknown storage path format:`,t),t;let r=n.shift(),i=n.join(`/`),{data:a}=e.storage.from(r).getPublicUrl(i);return console.log(`Public URL:`,a?.publicUrl),a?.publicUrl||t}async function i(){if(!t)return;t.innerHTML=`
        <div style="grid-column:1/-1;text-align:center;padding:3rem;color:#94a3b8">
          <i class="fas fa-circle-notch fa-spin" style="font-size:1.8rem;margin-bottom:.6rem;display:block"></i>
          Loading books…
        </div>`;let{data:i,error:a}=await e.from(`books`).select(`*`).order(`created_at`,{ascending:!1});if(a){t.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#dc2626">Failed to load books. Please try again later.</div>`,console.error(`Fetch books error:`,a);return}if(console.log(`Books from DB:`,i),!i||!i.length){t.innerHTML=`
          <div style="grid-column:1/-1;text-align:center;padding:3rem;color:#94a3b8">
            <i class="fas fa-book-open" style="font-size:2.5rem;opacity:.3;display:block;margin-bottom:.8rem"></i>
            No books available yet. Check back soon!
          </div>`;return}t.innerHTML=i.map(e=>{let t=r(e.pdf_url);return`
        <div class="product-card" data-book="${n(t)}" role="button" tabindex="0"
             aria-label="Read ${n(e.title)}"
             style="cursor:pointer;">
          <div class="product-img-container">
            ${e.cover_url?`<img src="${n(e.cover_url)}" alt="${n(e.title)} cover" loading="lazy" width="300" height="400" />`:`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;color:#94a3b8;font-size:2rem"><i class="fas fa-book"></i></div>`}
          </div>
          <div class="product-info">
            <div class="product-title">${n(e.title)}</div>

            ${e.price?`<div class="product-price">${n(e.price)}</div>`:``}
            <a href="reader.html?book=${encodeURIComponent(t||``)}" class="read-btn"
               style="display:inline-flex;align-items:center;gap:.4rem;margin-top:.6rem;padding:.4rem .9rem;
                      background:#1e3799;color:#fff;border-radius:8px;font-size:.85rem;font-weight:700;
                      text-decoration:none;transition:background .2s;"
               onclick="event.stopPropagation()">
              <i class="fas fa-book-reader"></i> Read
            </a>
          </div>
        </div>
      `}).join(``),t.querySelectorAll(`.product-card[data-book]`).forEach(e=>{e.addEventListener(`click`,()=>{console.log(`Opening reader with:`,e.dataset.book),window.openBookReader&&window.openBookReader(e.dataset.book)}),e.addEventListener(`keydown`,t=>{(t.key===`Enter`||t.key===` `)&&window.openBookReader&&(t.preventDefault(),console.log(`Opening reader with:`,e.dataset.book),window.openBookReader(e.dataset.book))})})}i();