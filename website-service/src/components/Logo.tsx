import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";

// =========================================================================================================

type LogoProps = {
  className?: string;
  noAnimation?: boolean;
  isLink?: boolean;
};

export default function Logo({ className, isLink, noAnimation }: LogoProps) {
  if (isLink) {
    return (
      <Link href="/">
        <LogoComponent className={className} noAnimation={noAnimation} />
      </Link>
    );
  }

  return <LogoComponent className={className} />;
}

// =========================================================================================================

function LogoComponent({ className, noAnimation }: LogoProps) {
  return (
    <svg
      className={cn(noAnimation && "hover:scale-105 transition-transform duration-150", className)}
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      fill="none"
      viewBox="0 0 40 40"
    >
      <g clipPath="url(#clip0_87_269)">
        <rect width="40" height="40" fill="#695BF9" rx="3.125"></rect>
        <g filter="url(#filter0_f_87_269)">
          <path fill="#FAFAFA" fillOpacity="0.45" d="m42.422 13.672-29.14 29.14h29.14z"></path>
        </g>
        <g filter="url(#filter1_f_87_269)">
          <path fill="#FAFAFA" fillOpacity="0.45" d="m-2.773 26.328 29.14-29.14h-29.14z"></path>
        </g>
        <path
          fill="#fff"
          d="M24.278 5.463q.846 0 1.947.338 1.101.297 1.778 1.016.465.423-.127.254a11 11 0 0 1-1.227-.254 3.9 3.9 0 0 0-1.313-.212q-2.625-.042-3.81 1.524-1.185 1.524-1.354 3.895-.127 1.65.042 3.302.212 1.609.466 3.217t.423 3.217q.212 1.608.042 3.26-.042.465-.127.55-.042.084-.127-.043a6 6 0 0 0-.126-.338 6 6 0 0 0-.085-.424 48 48 0 0 0-.635-3.386 152 152 0 0 1-.72-3.471 49 49 0 0 1-.55-3.471 18.3 18.3 0 0 1 0-3.514 7.3 7.3 0 0 1 .55-2.116 5.7 5.7 0 0 1 1.1-1.736 5.1 5.1 0 0 1 1.694-1.185q.974-.423 2.159-.423m-7.535 5.587a8.6 8.6 0 0 1 .593-2.286 7.9 7.9 0 0 1 1.227-2.116 5.8 5.8 0 0 1 1.905-1.524q1.143-.593 2.54-.593.042 0 .212.043.211 0 .338.042.17.042.127.085 0 .042-.296.084a6.8 6.8 0 0 0-2.116.762 6.6 6.6 0 0 0-1.694 1.355 7.2 7.2 0 0 0-1.185 1.82 6.3 6.3 0 0 0-.508 2.032 16.8 16.8 0 0 0 .17 4.106q.339 2.033.761 4.064.466 2.031.762 4.106.338 2.032.17 4.064a8 8 0 0 1-.381 1.693 6.9 6.9 0 0 1-.805 1.65q-.465.763-1.185 1.313-.72.508-1.608.635-.678.085-.593-.042.127-.17.508-.381 1.524-.847 2.074-1.99.593-1.143.762-2.836a15.8 15.8 0 0 0-.17-3.98 68 68 0 0 0-.719-4.063 111 111 0 0 1-.762-4.021 17.5 17.5 0 0 1-.127-4.022M15.6 34.502q1.777 0 3.006-.635a6.4 6.4 0 0 0 2.032-1.736 8.3 8.3 0 0 0 1.227-2.497q.424-1.44.55-2.964.17-1.905-.084-3.81a81 81 0 0 0-.593-3.767q-.295-1.905-.55-3.81a17.6 17.6 0 0 1-.085-3.852q.17-1.947 1.185-3.09 1.059-1.143 3.133-1.143.72 0 1.82.254 1.143.255 1.863.72.761.507-.127.296a37 37 0 0 0-1.312-.296q-.805-.17-1.228-.17-1.65 0-2.836.72t-1.355 2.54a15 15 0 0 0 .085 3.894q.296 1.905.677 3.853.381 1.947.635 3.894.297 1.947.127 3.894a13.1 13.1 0 0 1-.635 3.133 9.5 9.5 0 0 1-1.44 2.751 7.2 7.2 0 0 1-2.327 1.99q-1.355.72-3.217.72-.51 0-1.313-.17a17 17 0 0 1-1.608-.423 12.5 12.5 0 0 1-1.524-.677q-.678-.423-1.016-.89-.381-.423.254-.21.72.38 1.735.93 1.06.55 2.921.55m-.254-1.482q1.059 0 1.947-.339.89-.338 1.82-.888v.127q0 .38-.423.761a4.5 4.5 0 0 1-.973.635 6 6 0 0 1-1.355.466q-.72.17-1.481.17a5 5 0 0 1-.805-.085 21 21 0 0 1-1.058-.297 10 10 0 0 1-.974-.465q-.465-.255-.635-.593-.465-.508-.296-.55.17-.085.466.127.677.21 1.524.592.888.34 2.243.34"
        ></path>
      </g>
      <defs>
        <filter
          id="filter0_f_87_269"
          width="74.063"
          height="74.063"
          x="-9.18"
          y="-8.789"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur result="effect1_foregroundBlur_87_269" stdDeviation="11.23"></feGaussianBlur>
        </filter>
        <filter
          id="filter1_f_87_269"
          width="74.063"
          height="74.063"
          x="-25.234"
          y="-25.273"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur result="effect1_foregroundBlur_87_269" stdDeviation="11.23"></feGaussianBlur>
        </filter>
        <clipPath id="clip0_87_269">
          <rect width="40" height="40" fill="#fff" rx="3.125"></rect>
        </clipPath>
      </defs>
    </svg>
  );
}

// =========================================================================================================
