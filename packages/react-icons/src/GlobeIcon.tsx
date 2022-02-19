import * as React from 'react';

function SvgGlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.317 4.415c-.302.027-.6.071-.89.132-.377.616-.71 1.422-.975 2.373h1.865V4.415zm-2.748.784a7.643 7.643 0 00-2.242 1.72H8.02c.156-.617.34-1.193.55-1.72zM5.34 8.304a7.567 7.567 0 00-.923 3.004H7.44c.03-1.048.13-2.059.29-3.004H5.34zm-.923 4.388c.086.96.35 1.868.76 2.691H7.68a22.12 22.12 0 01-.24-2.69H4.417zm1.646 4.076a7.648 7.648 0 002.507 2.033 14.154 14.154 0 01-.624-2.033H6.062zm4.365 2.685c.29.06.588.105.89.132v-2.817H9.369c.277 1.087.64 2.003 1.058 2.685zm2.274.13c.296-.026.587-.07.872-.13.417-.682.781-1.598 1.058-2.685H12.7v2.816zm2.73-.782a7.648 7.648 0 002.507-2.033h-1.883c-.17.736-.38 1.419-.624 2.033zm3.385-3.4a7.567 7.567 0 00.768-2.709H16.56a22.127 22.127 0 01-.24 2.691h2.345c.052 0 .103.006.152.017zM21 12a9 9 0 10-18 0 9 9 0 0018 0zm-1.416-.692H16.56a21.878 21.878 0 00-.29-3.004h2.391c.503.904.827 1.921.924 3.004zm-1.91-4.388A7.643 7.643 0 0015.43 5.2c.21.526.393 1.102.549 1.72h1.693zm-4.1-2.373a7.601 7.601 0 00-.873-.13V6.92h1.847c-.265-.951-.598-1.757-.975-2.373zm1.6 8.145c-.03.953-.118 1.857-.256 2.691h-2.216v-2.69h2.472zm-3.857 0v2.691H9.082a20.497 20.497 0 01-.256-2.69h2.49zm-2.18-4.388c-.17.92-.278 1.931-.311 3.004h2.49V8.304h-2.18zm3.564 0v3.004h2.473a20.217 20.217 0 00-.31-3.004H12.7z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SvgGlobeIcon;
