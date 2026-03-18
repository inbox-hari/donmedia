import"../hero-stars-BadzpYtY.js";import{t as e}from"../supabase-client-PZdivSTP.js";/* empty css               */var t=0,n=`donmedia`;(async()=>{try{let{data:{session:t},error:n}=await e.auth.getSession();if(n)throw n;if(!t){window.location.replace(`login.html`);return}r(t.user)}catch(e){console.error(`Session verification failed:`,e),window.location.replace(`login.html`)}})(),e.auth.onAuthStateChange((e,t)=>{(e===`SIGNED_OUT`||!t&&e!==`INITIAL_SESSION`)&&window.location.replace(`login.html`),e===`TOKEN_REFRESHED`&&t&&t.user});function r(e){let t=document.getElementById(`user-email-display`),n=document.getElementById(`user-avatar`);t&&(t.textContent=e.email.split(`@`)[0]),n&&(n.textContent=e.email.charAt(0).toUpperCase()),document.body.classList.add(`auth-ready`),h(),y()}async function i(){let t=document.getElementById(`logout-btn`);t&&(t.disabled=!0,t.innerHTML=`<i class="fas fa-circle-notch fa-spin"></i> Signing out…`),await e.auth.signOut(),window.location.replace(`login.html`)}window.handleLogout=i;var a=null;function o(e,t=`success`){let n=document.getElementById(`toast`);n.textContent=(t===`success`?`✓ `:`✕ `)+e,n.className=`toast `+t+` show`,a&&clearTimeout(a),a=setTimeout(()=>{n.className=`toast`},3500)}function s(e,t){let n=document.getElementById(e);n&&(n.textContent=`⚠ `+t,n.classList.add(`show`))}function c(e){let t=document.getElementById(e);t&&t.classList.remove(`show`)}function l(e,t,n){let r=document.getElementById(e+`-progress`),i=document.getElementById(e+`-progress-bar`),a=document.getElementById(e+`-progress-label`);r&&(r.classList.add(`show`),i&&(i.style.width=t+`%`),a&&(a.textContent=n||`Uploading…`))}function u(e){let t=document.getElementById(e+`-progress`);t&&setTimeout(()=>{t.classList.remove(`show`);let n=document.getElementById(e+`-progress-bar`);n&&(n.style.width=`0%`)},800)}function d(e,t){let n=document.getElementById(e),r=document.getElementById(t);!n||!r||n.addEventListener(`change`,()=>{r.textContent=n.files[0]?n.files[0].name:``})}d(`b-cover-file`,`b-cover-name`),d(`b-pdf-file`,`b-pdf-name`),d(`m-cover-file`,`m-cover-name`),d(`m-pdf-file`,`m-pdf-name`);function f(e){[`books`,`magazines`].forEach(t=>{document.getElementById(`tab-`+t).classList.toggle(`active`,t===e),document.getElementById(`tab-`+t+`-btn`).classList.toggle(`active`,t===e),document.getElementById(`nav-`+t).classList.toggle(`active`,t===e)});let t={books:`Books`,magazines:`Magazines`};document.getElementById(`topbar-title`).textContent=t[e]||e,D()}window.switchTab=f;function p(e,t){return`${e}/${Date.now()}_${t.name.replace(/[^a-zA-Z0-9._-]/g,`_`)}`}async function m(t,r){let i=p(t,r);console.log(`Starting upload to path: ${i} in bucket: ${n}`);let{data:a,error:o}=await e.storage.from(n).upload(i,r,{cacheControl:`3600`,contentType:r.type,upsert:!1});if(o)throw console.error(`Upload error for ${r.name}:`,o),Error(`Storage upload failed: `+o.message);console.log(`Upload successful: ${i}`);let{data:{publicUrl:s}}=e.storage.from(n).getPublicUrl(i);return{path:i,publicUrl:s}}document.getElementById(`book-upload-form`).addEventListener(`submit`,async n=>{n.preventDefault(),c(`b-error`);let r=document.getElementById(`b-title`).value.trim(),i=document.getElementById(`b-description`).value.trim(),a=document.getElementById(`b-price`).value.trim(),d=document.getElementById(`b-cover-file`).files[0],f=document.getElementById(`b-pdf-file`).files[0];if(!r||!a){s(`b-error`,`Title and Price are required.`);return}if(!d){s(`b-error`,`Please select a cover image.`);return}if(!f){s(`b-error`,`Please select a PDF file.`);return}let p=document.getElementById(`b-submit-btn`);p.disabled=!0,p.innerHTML=`<i class="fas fa-circle-notch fa-spin"></i> Uploading…`;try{l(`b`,20,`Uploading cover image…`);let n=await m(`books/covers`,d);l(`b`,60,`Uploading PDF…`);let s=await m(`books/pdfs`,f);l(`b`,90,`Saving to database…`);let{error:c}=await e.from(`books`).insert([{title:r,description:i,cover_url:n.publicUrl,pdf_url:s.publicUrl,price:a}]);if(c)throw Error(c.message);l(`b`,100,`Done!`),u(`b`),o(`Book uploaded successfully!`),document.getElementById(`book-upload-form`).reset(),[`b-cover-name`,`b-pdf-name`].forEach(e=>{let t=document.getElementById(e);t&&(t.textContent=``)}),t++,document.getElementById(`stat-uploads`).textContent=t,h()}catch(e){u(`b`),s(`b-error`,e.message),o(e.message,`error`)}finally{p.disabled=!1,p.innerHTML=`<i class="fas fa-upload"></i> Upload Book`}});async function h(){let t=document.getElementById(`books-tbody`);t.innerHTML=`<tr><td colspan="4"><div class="empty-state"><i class="fas fa-circle-notch fa-spin"></i><p>Loading…</p></div></td></tr>`;let{data:n,error:r}=await e.from(`books`).select(`*`).order(`created_at`,{ascending:!1});if(r){t.innerHTML=`<tr><td colspan="4"><div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Failed to load books.</p></div></td></tr>`;return}if(document.getElementById(`stat-books`).textContent=n.length,!n.length){t.innerHTML=`<tr><td colspan="4"><div class="empty-state"><i class="fas fa-book-open"></i><p>No books yet. Upload your first one!</p></div></td></tr>`;return}t.innerHTML=n.map(e=>`
    <tr id="book-row-${e.id}">
      <td>
        ${e.cover_url?`<img class="item-thumb" src="${O(e.cover_url)}" alt="${O(e.title)}" loading="lazy">`:`<div class="item-thumb-placeholder"><i class="fas fa-image"></i></div>`}
      </td>
      <td>
        <div class="item-title">${O(e.title)}</div>
        <div class="item-meta" style="margin-top:2px">${O(e.description||``)}</div>
      </td>
      <td><span class="badge badge-blue">${O(String(e.price||`—`))}</span></td>
      <td>
        <div class="action-group">
          <button class="btn btn-orange btn-sm" onclick="editBook('${e.id}')">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-red btn-sm" onclick="deleteBook('${e.id}', '${O(e.cover_url||``)}', '${O(e.pdf_url||``)}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `).join(``)}async function g(t){let{data:n,error:r}=await e.from(`books`).select(`*`).eq(`id`,t).single();if(r){o(`Could not load book data.`,`error`);return}let i=document.getElementById(`book-row-`+t);i.classList.add(`edit-row`),i.innerHTML=`
    <td colspan="3" style="padding:.8rem">
      <div style="display:grid;grid-template-columns:1fr;gap:.6rem;margin-bottom:.5rem">
        <input id="edit-b-title-${t}"  value="${k(n.title)}"  placeholder="Title"  style="font-weight:700" />
        <input id="edit-b-price-${t}"  value="${k(n.price||``)}"  placeholder="Price"  />
        <input id="edit-b-desc-${t}"   value="${k(n.description||``)}" placeholder="Description" />
      </div>
    </td>
    <td>
      <div class="action-group" style="flex-direction:column;align-items:stretch">
        <button class="btn btn-green btn-sm" onclick="saveBook('${t}')">
          <i class="fas fa-check"></i> Save
        </button>
        <button class="btn btn-ghost btn-sm" onclick="loadBooks()" style="margin-top:.3rem">
          Cancel
        </button>
      </div>
    </td>
  `}async function _(t){let n=document.getElementById(`edit-b-title-`+t).value.trim(),r=document.getElementById(`edit-b-price-`+t).value.trim(),i=document.getElementById(`edit-b-desc-`+t).value.trim();if(!n){o(`Title cannot be empty.`,`error`);return}let{error:a}=await e.from(`books`).update({title:n,price:r,description:i}).eq(`id`,t);if(a){o(`Failed to save: `+a.message,`error`);return}o(`Book updated!`),h()}async function v(t,r,i){if(!confirm(`Delete this book? This cannot be undone.`))return;let a=[r,i].map(e=>{try{let t=new URL(e).pathname.split(`/object/public/`+n+`/`);return t[1]?decodeURIComponent(t[1]):null}catch{return null}}).filter(Boolean);a.length&&await e.storage.from(n).remove(a);let{error:s}=await e.from(`books`).delete().eq(`id`,t);if(s){o(`Delete failed: `+s.message,`error`);return}o(`Book deleted.`),h()}window.loadBooks=h,window.editBook=g,window.saveBook=_,window.deleteBook=v,document.getElementById(`mag-upload-form`).addEventListener(`submit`,async n=>{n.preventDefault(),c(`m-error`);let r=document.getElementById(`m-title`).value.trim(),i=document.getElementById(`m-description`).value.trim(),a=document.getElementById(`m-cover-file`).files[0],d=document.getElementById(`m-pdf-file`).files[0];if(!r){s(`m-error`,`Title is required.`);return}if(!a){s(`m-error`,`Please select a cover image.`);return}if(!d){s(`m-error`,`Please select a PDF file.`);return}let f=document.getElementById(`m-submit-btn`);f.disabled=!0,f.innerHTML=`<i class="fas fa-circle-notch fa-spin"></i> Uploading…`;try{l(`m`,20,`Uploading cover image…`);let n=await m(`magazines/covers`,a);l(`m`,60,`Uploading PDF…`);let s=await m(`magazines/pdfs`,d);l(`m`,90,`Saving to database…`);let{error:c}=await e.from(`magazines`).insert([{title:r,description:i,cover_url:n.publicUrl,pdf_url:s.publicUrl}]);if(c)throw Error(c.message);l(`m`,100,`Done!`),u(`m`),o(`Magazine uploaded successfully!`),document.getElementById(`mag-upload-form`).reset(),[`m-cover-name`,`m-pdf-name`].forEach(e=>{let t=document.getElementById(e);t&&(t.textContent=``)}),t++,document.getElementById(`stat-uploads`).textContent=t,y()}catch(e){u(`m`),s(`m-error`,e.message),o(e.message,`error`)}finally{f.disabled=!1,f.innerHTML=`<i class="fas fa-upload"></i> Upload Magazine`}});async function y(){let t=document.getElementById(`mags-tbody`);t.innerHTML=`<tr><td colspan="3"><div class="empty-state"><i class="fas fa-circle-notch fa-spin"></i><p>Loading…</p></div></td></tr>`;let{data:n,error:r}=await e.from(`magazines`).select(`*`).order(`created_at`,{ascending:!1});if(r){t.innerHTML=`<tr><td colspan="3"><div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Failed to load magazines.</p></div></td></tr>`;return}if(document.getElementById(`stat-magazines`).textContent=n.length,!n.length){t.innerHTML=`<tr><td colspan="3"><div class="empty-state"><i class="fas fa-newspaper"></i><p>No magazines yet. Upload your first one!</p></div></td></tr>`;return}t.innerHTML=n.map(e=>`
    <tr id="mag-row-${e.id}">
      <td>
        ${e.cover_url?`<img class="item-thumb" src="${O(e.cover_url)}" alt="${O(e.title)}" loading="lazy">`:`<div class="item-thumb-placeholder"><i class="fas fa-image"></i></div>`}
      </td>
      <td>
        <div class="item-title">${O(e.title)}</div>
        <div class="item-meta">${O(e.description||``)}</div>
      </td>
      <td>
        <div class="action-group">
          <button class="btn btn-orange btn-sm" onclick="editMagazine('${e.id}')">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-red btn-sm" onclick="deleteMagazine('${e.id}', '${O(e.cover_url||``)}', '${O(e.pdf_url||``)}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `).join(``)}window.loadMagazines=y;async function b(t){let{data:n,error:r}=await e.from(`magazines`).select(`*`).eq(`id`,t).single();if(r){o(`Could not load magazine data.`,`error`);return}let i=document.getElementById(`mag-row-`+t);i.classList.add(`edit-row`),i.innerHTML=`
    <td colspan="2" style="padding:.8rem">
      <div style="display:grid;grid-template-columns:1fr;gap:.6rem">
        <input id="edit-m-title-${t}" value="${k(n.title)}" placeholder="Title" style="font-weight:700" />
        <input id="edit-m-desc-${t}"  value="${k(n.description||``)}" placeholder="Description" />
      </div>
    </td>
    <td>
      <div class="action-group" style="flex-direction:column;align-items:stretch">
        <button class="btn btn-green btn-sm" onclick="saveMagazine('${t}')">
          <i class="fas fa-check"></i> Save
        </button>
        <button class="btn btn-ghost btn-sm" onclick="loadMagazines()" style="margin-top:.3rem">
          Cancel
        </button>
      </div>
    </td>
  `}window.editMagazine=b;async function x(t){let n=document.getElementById(`edit-m-title-`+t).value.trim(),r=document.getElementById(`edit-m-desc-`+t).value.trim();if(!n){o(`Title cannot be empty.`,`error`);return}let{error:i}=await e.from(`magazines`).update({title:n,description:r}).eq(`id`,t);if(i){o(`Failed to save: `+i.message,`error`);return}o(`Magazine updated!`),y()}window.saveMagazine=x;async function S(t,r,i){if(!confirm(`Delete this magazine? This cannot be undone.`))return;let a=[r,i].map(e=>{try{let t=new URL(e).pathname.split(`/object/public/`+n+`/`);return t[1]?decodeURIComponent(t[1]):null}catch{return null}}).filter(Boolean);a.length&&await e.storage.from(n).remove(a);let{error:s}=await e.from(`magazines`).delete().eq(`id`,t);if(s){o(`Delete failed: `+s.message,`error`);return}o(`Magazine deleted.`),y()}window.deleteMagazine=S;var C=document.getElementById(`sidebar`),w=document.getElementById(`sidebar-backdrop`),T=document.getElementById(`sidebar-toggle`);function E(){C.classList.add(`open`),w.style.display=`block`}function D(){C.classList.remove(`open`),w.style.display=`none`}window.closeSidebar=D,T&&T.addEventListener(`click`,E),w&&w.addEventListener(`click`,D);function O(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function k(e){return String(e).replace(/'/g,`&#39;`).replace(/"/g,`&quot;`)}