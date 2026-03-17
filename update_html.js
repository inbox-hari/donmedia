const fs = require('fs');
const files = ['index.html', 'store.html', 'about.html', 'contact.html', 'book-store.html', 'magazines.html', 'digital-store.html'];

const replacementActive = `<div class="store-nav-wrapper">
  <a href="store.html" class="active">Store</a>
  <button class="dropdown-toggle toggle-icon" type="button" aria-expanded="false"><i class="fas fa-chevron-down caret-icon"></i></button>
</div>`;

const replacementInactive = `<div class="store-nav-wrapper">
  <a href="store.html">Store</a>
  <button class="dropdown-toggle toggle-icon" type="button" aria-expanded="false"><i class="fas fa-chevron-down caret-icon"></i></button>
</div>`;

for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /<a href="#" class="dropdown-toggle active"[\s\S]*?>Store\s*<i class="fas fa-chevron-down caret-icon"><\/i\s*>[\s\S]*?<\/a>/g,
    replacementActive
  );
  
  content = content.replace(
    /<a href="#" class="dropdown-toggle"[\s\S]*?>Store\s*<i class="fas fa-chevron-down caret-icon"><\/i\s*>[\s\S]*?<\/a>/g,
    replacementInactive
  );

  fs.writeFileSync(file, content);
  console.log('Updated', file);
}
