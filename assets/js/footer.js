/* Shared site footer — injected into every <footer data-footer>.
   Single source of truth for nav/legal links so all 8 pages stay
   in sync. */
(function () {
  var cols = [
    { head: 'Product', links: [
      { label: 'How It Works', href: 'how-it-works.html' },
      { label: 'Pricing', href: 'pricing.html' },
      { label: 'For Brands', href: 'for-brands.html' },
      { label: 'For Riders', href: 'for-riders.html' }
    ]},
    { head: 'Company', links: [
      { label: 'About', href: 'about.html' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: 'pilot.html' },
      { label: 'Press Kit', href: '#' }
    ]},
    { head: 'Resources', links: [
      { label: 'Blog', href: 'blog.html' },
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: 'how-it-works.html' },
      { label: 'Status', href: '#' }
    ]},
    { head: 'Legal', links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'DPDP Compliance', href: '#' }
    ]}
  ];

  var colHtml = cols.map(function (c) {
    var links = c.links.map(function (l) {
      return '<a href="' + l.href + '">' + l.label + '</a>';
    }).join('');
    return '<div><div class="footer-head">' + c.head + '</div>' +
           '<div class="footer-col-links">' + links + '</div></div>';
  }).join('');

  var html =
    '<div class="container">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<a href="index.html" class="footer-brand"><span class="dot"></span>DROPT</a>' +
          '<p class="footer-blurb">Hyperlocal quick-commerce infrastructure for fashion brands. Bangalore, India.</p>' +
        '</div>' + colHtml +
      '</div>' +
      '<div class="footer-bottom">' +
        '<div class="legal-1">pilot@dropt.in · invest@dropt.in · dropt.in</div>' +
        '<div class="legal-2">© 2025 Dropt Technologies Pvt. Ltd. · Bangalore, India</div>' +
      '</div>' +
    '</div>';

  var mounts = document.querySelectorAll('[data-footer]');
  for (var i = 0; i < mounts.length; i++) mounts[i].innerHTML = html;
})();
