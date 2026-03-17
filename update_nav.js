const fs = require('fs');
const files = [
  'index.html',
  'store.html',
  'about.html',
  'contact.html',
  'book-store.html',
  'magazines.html',
  'digital-store.html'
];

const desktopStoreRegex1 = /<li><a href="store\.html">Store<\/a><\/li>/g;
const desktopStoreRegex2 = /<li><a href="store\.html" class="active">Store<\/a><\/li>/g;
const mobileStoreRegex1 = /<li><a href="store\.html">Store<\/a><\/li>/g;

const dropdownHTML = `<li class="dropdown">
          <div class="store-nav-wrapper">
            <a href="store.html">Store</a>
            <button class="dropdown-toggle toggle-icon" type="button" aria-expanded="false"><i class="fas fa-chevron-down caret-icon"></i></button>
          </div>
          <ul class="dropdown-menu">
            <li><a href="book-store.html">Book Store</a></li>
            <li><a href="magazines.html">Magazines</a></li>
            <li><a href="digital-store.html">Digital Store</a></li>
            <li><a href="free-store.html">Free Store</a></li>
          </ul>
        </li>`;

const dropdownHTMLActive = `<li class="dropdown">
          <div class="store-nav-wrapper">
            <a href="store.html" class="active">Store</a>
            <button class="dropdown-toggle toggle-icon" type="button" aria-expanded="false"><i class="fas fa-chevron-down caret-icon"></i></button>
          </div>
          <ul class="dropdown-menu">
            <li><a href="book-store.html">Book Store</a></li>
            <li><a href="magazines.html">Magazines</a></li>
            <li><a href="digital-store.html">Digital Store</a></li>
            <li><a href="free-store.html">Free Store</a></li>
          </ul>
        </li>`;


for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(desktopStoreRegex2, dropdownHTMLActive);
  content = content.replace(desktopStoreRegex1, dropdownHTML);
  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
}
