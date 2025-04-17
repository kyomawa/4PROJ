import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";

// =============================================================================================

export default function Unauthorized() {
  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] justify-center items-center">
      <div className="flex flex-col items-center gap-y-16">
        <Illustration className="size-80" />
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-1.5 items-center">
            <h1 className="text-5xl font-bold">Non autorisée</h1>
            <p className="text-xl text-center">Vous n&apos;êtes pas autorisé à accéder à cette page.</p>
          </div>
          <Link href="/connexion" className={cn(buttonVariants({ variant: "default", size: "none" }), "text-lg")}>
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  );
}

// =============================================================================================

type IllustrationProps = {
  className?: string;
};

function Illustration({ className }: IllustrationProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="742.417"
      height="712.723"
      viewBox="0 0 742.417 712.723"
    >
      <g id="Group_9" data-name="Group 9" transform="translate(-589 -184)">
        <path
          id="Path_274-133"
          fill="#9f616a"
          d="M449.813 328.006s11.621 38.349 8.135 43 37.187-25.566 37.187-25.566-15.107-10.459-9.3-25.566Z"
          data-name="Path 274"
          transform="translate(251.695 108.565)"
        ></path>
        <path
          id="Path_968-134"
          fill="#090814"
          d="M853.606 262.605h-3.9V155.628a61.915 61.915 0 0 0-61.915-61.915h-226.65a61.915 61.915 0 0 0-61.916 61.915v586.883a61.915 61.915 0 0 0 61.915 61.915h226.648a61.915 61.915 0 0 0 61.912-61.915V338.753h3.9Z"
          data-name="Path 968"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_969-135"
          fill="#fff"
          d="M837.006 151.481v595.175a46.96 46.96 0 0 1-46.935 46.952H558.764a46.967 46.967 0 0 1-46.973-46.959V151.482a46.965 46.965 0 0 1 46.971-46.951h28.058a22.33 22.33 0 0 0 20.656 30.74h131.868A22.33 22.33 0 0 0 760 104.53h30.055a46.957 46.957 0 0 1 46.951 46.934Z"
          data-name="Path 969"
          transform="translate(360.209 90.287)"
        ></path>
        <circle
          id="Ellipse_18"
          cx="96.565"
          cy="96.565"
          r="96.565"
          fill="#695bf9"
          data-name="Ellipse 18"
          transform="translate(938 287.564)"
        ></circle>
        <path
          id="Path_39-136"
          fill="#e6e6e6"
          d="M779.672 494.309H574.135a3.81 3.81 0 0 1-3.806-3.806V439.52a3.81 3.81 0 0 1 3.806-3.806h205.537a3.81 3.81 0 0 1 3.806 3.806v50.98a3.81 3.81 0 0 1-3.806 3.806Zm-205.537-57.074a2.286 2.286 0 0 0-2.284 2.284V490.5a2.286 2.286 0 0 0 2.284 2.284h205.537a2.286 2.286 0 0 0 2.284-2.284v-50.981a2.286 2.286 0 0 0-2.284-2.284Z"
          data-name="Path 39"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_40-137"
          fill="#e6e6e6"
          d="M637.7 454.074a2.665 2.665 0 0 0 0 5.329h125.6a2.665 2.665 0 0 0 .2-5.326H637.7Z"
          data-name="Path 40"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_41-138"
          fill="#e6e6e6"
          d="M637.7 470.058a2.664 2.664 0 1 0 0 5.329h125.6a2.665 2.665 0 0 0 .2-5.326H637.7Z"
          data-name="Path 41"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_42-139"
          fill="#e6e6e6"
          d="M779.672 579.289H574.135a3.81 3.81 0 0 1-3.806-3.806V524.5a3.81 3.81 0 0 1 3.806-3.806h205.537a3.81 3.81 0 0 1 3.806 3.806v50.985a3.81 3.81 0 0 1-3.806 3.8Zm-205.537-57.073a2.286 2.286 0 0 0-2.284 2.284v50.985a2.286 2.286 0 0 0 2.284 2.284h205.537a2.286 2.286 0 0 0 2.284-2.284V524.5a2.286 2.286 0 0 0-2.284-2.284Z"
          data-name="Path 42"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_43-140"
          fill="#e6e6e6"
          d="M637.7 539.33a2.664 2.664 0 0 0 0 5.329h125.6a2.665 2.665 0 1 0 .087-5.329z"
          data-name="Path 43"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_44-141"
          fill="#e6e6e6"
          d="M637.7 555.318a2.664 2.664 0 0 0 0 5.329h125.6a2.665 2.665 0 1 0 .087-5.329z"
          data-name="Path 44"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_39-2-142"
          fill="#e6e6e6"
          d="M779.672 664.547H574.135a3.81 3.81 0 0 1-3.806-3.806v-50.983a3.81 3.81 0 0 1 3.806-3.806h205.537a3.81 3.81 0 0 1 3.806 3.806v50.985a3.81 3.81 0 0 1-3.806 3.806Zm-205.537-57.073a2.286 2.286 0 0 0-2.284 2.284v50.985a2.286 2.286 0 0 0 2.284 2.284h205.537a2.286 2.286 0 0 0 2.284-2.284v-50.985a2.286 2.286 0 0 0-2.284-2.284Z"
          data-name="Path 39-2"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_40-2-143"
          fill="#e6e6e6"
          d="M637.7 624.591a2.664 2.664 0 0 0 0 5.329h125.6a2.665 2.665 0 0 0 .2-5.326H637.7Z"
          data-name="Path 40-2"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_41-2-144"
          fill="#e6e6e6"
          d="M637.7 640.578a2.664 2.664 0 0 0 0 5.329h125.6a2.665 2.665 0 0 0 .2-5.326H637.7Z"
          data-name="Path 41-2"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_970-145"
          fill="#e6e6e6"
          d="M969.27 806.286H230.729c-1.071 0-1.938-.468-1.938-1.045s.868-1.045 1.938-1.045h738.542c1.07 0 1.938.468 1.938 1.045s-.868 1.045-1.939 1.045"
          data-name="Path 970"
          transform="translate(360.209 90.287)"
        ></path>
        <g id="Group_58" data-name="Group 58" transform="translate(589 184)">
          <path
            id="Path_438-146"
            fill="#e6e6e6"
            d="M937.992 765.521a19.47 19.47 0 0 1-18.806-3.313c-6.587-5.528-8.652-14.636-10.332-23.07l-4.97-24.945 10.405 7.165c7.483 5.152 15.134 10.47 20.316 17.933s7.443 17.651 3.28 25.726"
            data-name="Path 438"
            transform="translate(-228.791 -93.713)"
          ></path>
          <path
            id="Path_439-147"
            fill="#f2f2f2"
            d="M936.385 797.458c1.31-9.542 2.657-19.206 1.738-28.849-.816-8.565-3.429-16.93-8.749-23.789a39.6 39.6 0 0 0-10.153-9.2c-1.015-.641-1.95.968-.939 1.606a37.62 37.62 0 0 1 14.881 17.956c3.24 8.241 3.76 17.224 3.2 25.977-.338 5.294-1.053 10.553-1.774 15.8a.964.964 0 0 0 .65 1.144.936.936 0 0 0 1.144-.65Z"
            data-name="Path 439"
            transform="translate(-228.791 -93.713)"
          ></path>
          <path
            id="Path_442-148"
            fill="#e6e6e6"
            d="M926.958 782.148a14.34 14.34 0 0 1-12.491 6.447c-6.323-.3-11.595-4.713-16.34-8.9l-14.035-12.4 9.289-.444c6.68-.32 13.533-.618 19.9 1.442s12.231 7.018 13.394 13.6"
            data-name="Path 442"
            transform="translate(-228.791 -93.713)"
          ></path>
          <path
            id="Path_443-149"
            fill="#f2f2f2"
            d="M940.086 802.943c-6.3-11.156-13.618-23.555-26.685-27.518a29.8 29.8 0 0 0-11.224-1.159c-1.192.1-.894 1.94.3 1.837a27.67 27.67 0 0 1 17.912 4.739c5.051 3.438 8.983 8.217 12.311 13.286 2.039 3.1 3.865 6.341 5.691 9.573.58 1.032 2.286.287 1.695-.758"
            data-name="Path 443"
            transform="translate(-228.791 -93.713)"
          ></path>
        </g>
        <g id="Group_59" data-name="Group 59" transform="translate(589 184)">
          <circle
            id="Ellipse_5"
            cx="15.986"
            cy="15.986"
            r="15.986"
            fill="#695bf9"
            data-name="Ellipse 5"
            transform="translate(355 354.999)"
          ></circle>
          <path
            id="Path_40-3-150"
            fill="#e6e6e6"
            d="M592.124 461.712c-.184 0-.333 1.193-.333 2.664s.149 2.665.333 2.665h15.719c.184.024.336-1.149.339-2.62a5.94 5.94 0 0 0-.328-2.708z"
            data-name="Path 40-3"
            transform="translate(-228.791 -93.713)"
          ></path>
        </g>
        <g id="Group_60" data-name="Group 60" transform="translate(589 184)">
          <circle
            id="Ellipse_5-2"
            cx="15.986"
            cy="15.986"
            r="15.986"
            fill="#695bf9"
            data-name="Ellipse 5-2"
            transform="translate(355 440.292)"
          ></circle>
          <path
            id="Path_40-4-151"
            fill="#e6e6e6"
            d="M592.124 547.005c-.184 0-.333 1.193-.333 2.664s.149 2.665.333 2.665h15.719c.184.024.336-1.149.339-2.62a5.94 5.94 0 0 0-.328-2.708z"
            data-name="Path 40-4"
            transform="translate(-228.791 -93.713)"
          ></path>
        </g>
        <g id="Group_61" data-name="Group 61" transform="translate(589 184)">
          <circle
            id="Ellipse_5-3"
            cx="15.986"
            cy="15.986"
            r="15.986"
            fill="#695bf9"
            data-name="Ellipse 5-3"
            transform="translate(355 525.55)"
          ></circle>
          <path
            id="Path_40-5-152"
            fill="#e6e6e6"
            d="M592.124 632.263c-.184 0-.333 1.193-.333 2.664s.149 2.665.333 2.665h15.719c.184.024.336-1.149.339-2.62a5.94 5.94 0 0 0-.328-2.708z"
            data-name="Path 40-5"
            transform="translate(-228.791 -93.713)"
          ></path>
        </g>
        <path
          id="Rectangle_117"
          fill="#fff"
          d="M0 0h8v67H0z"
          data-name="Rectangle 117"
          transform="rotate(-45 942.529 -1035.191)"
        ></path>
        <path
          id="Rectangle_118"
          fill="#fff"
          d="M0 0h8v67H0z"
          data-name="Rectangle 118"
          transform="rotate(45 96.032 1452.82)"
        ></path>
        <path
          id="Path_254-153"
          fill="#9f616a"
          d="M319.051 549.848a10.056 10.056 0 0 0 5.388-14.447L348 508.537 329.608 506l-19.558 25.9a10.11 10.11 0 0 0 9 17.95Z"
          data-name="Path 254"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_255-154"
          fill="#9f616a"
          d="M118.679 694.215h-16.435l-7.819-63.395h24.257Z"
          data-name="Path 255"
          transform="translate(589 184)"
        ></path>
        <path
          id="Path_257-155"
          fill="#9f616a"
          d="m204.713 680.461-15.7 4.873-26.262-58.224 23.166-7.192Z"
          data-name="Path 257"
          transform="translate(589 184)"
        ></path>
        <path
          id="Path_973-156"
          fill="#e6e6e6"
          d="m334.884 495.656-24.341 27.877 19.056 1.715Z"
          data-name="Path 973"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_975-157"
          fill="#090814"
          d="M325.373 531.589s-8.455 4.227-9.512 23.251 3.171 68.7 3.171 68.7-4.227 22.194 0 42.274-4.227 93 1.057 93 32.762 3.171 33.819 0 2.114-50.729 2.114-50.729 8.455-24.308 0-39.1c0 0 29.521 51.548 48.615 90.889 4.179 8.61 35.933-1.057 30.649-10.569s-17.966-52.843-17.966-52.843-9.512-31.706-26.421-45.445l8.455-67.639s17.967-45.445 7.4-51.786-81.381-.003-81.381-.003"
          data-name="Path 975"
          transform="translate(360.209 90.287)"
        ></path>
        <circle
          id="Ellipse_182"
          cx="27.478"
          cy="27.478"
          r="27.478"
          fill="#9f616a"
          data-name="Ellipse 182"
          transform="translate(689.809 396.765)"
        ></circle>
        <path
          id="Path_976-158"
          fill="#e5e5e5"
          d="m387.727 361.434-34.16 20.08s-13.08 7.366-17.966 20.08c-5.208 13.55-2.181 32.628 0 36.99 4.227 8.455-1.773 29.592-1.773 29.592l-5.284 48.615s-19.023 17.966-4.227 20.08 41.217-1.057 57.07 0 33.819 3.171 28.535-7.4-11.625-17.967-5.284-39.1c4.962-16.54 4.747-78.383 4.419-104.5a21.03 21.03 0 0 0-10.211-17.771Z"
          data-name="Path 976"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_980-159"
          d="m372.407 394.727 3.17 64.468-30.726 62.223-5.211-1.983 31.706-58.127Z"
          data-name="Path 980"
          opacity="0.1"
          style={{ isolation: "isolate" }}
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_982-160"
          d="M407.279 472.932v-7.4l-35.929 59.186Z"
          data-name="Path 982"
          opacity="0.1"
          style={{ isolation: "isolate" }}
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_983-161"
          fill="#090814"
          d="m337.576 306.387-4.539-1.816s9.5-10.457 22.713-9.548l-3.717-4.092s9.085-3.637 17.345 5.91c4.342 5.019 9.365 10.919 12.5 17.564h4.865l-2.03 4.471 7.106 4.471-7.294-.8a24.74 24.74 0 0 1-.69 11.579l.2 3.534s-8.459-13.089-8.459-14.9v4.54s-4.543-4.092-4.543-6.82l-2.478 3.183-1.239-5-15.28 5 2.476-4.094-9.5 1.364 3.717-5s-10.737 5.91-11.15 10.912-5.781 11.366-5.781 11.366l-2.478-4.547s-3.72-20.457 8.256-27.277"
          data-name="Path 983"
          transform="translate(360.209 92.401)"
        ></path>
        <path
          id="Path_259-162"
          fill="#9f616a"
          d="M355.354 552.839a10.056 10.056 0 0 0 2.738-15.174l18.423-30.62-18.554.768-14.65 28.96a10.11 10.11 0 0 0 12.043 16.067Z"
          data-name="Path 259"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_981-163"
          fill="#e5e5e5"
          d="m397.24 375.175 7.926-1.585s23.779 17.438 16.381 52.314-40.16 87.719-40.16 87.719-7.4 9.512-9.512 11.625-6.341 0-4.227 3.171-3.171 5.284-3.171 5.284-23.251 0-21.137-8.455 38.047-68.7 38.047-68.7l-5.287-56.013s-4.226-27.474 21.14-25.36"
          data-name="Path 981"
          transform="translate(360.209 90.287)"
        ></path>
        <path
          id="Path_277-164"
          fill="#090814"
          d="M514.368 783.067s-10.829-7.941-10.829-3.61-12.273 21.658-12.273 21.658-20.214 14.439-3.61 14.439 23.824-2.888 23.824-2.888l17.327-11.551s4.332-5.054 2.888-10.829-6.5-13.717-6.5-13.717-5.773 7.942-10.827 6.498"
          data-name="Path 277"
          transform="translate(267.08 81.168)"
        ></path>
        <path
          id="Path_278-165"
          fill="#090814"
          d="M409.446 787.859s-1.494-7.471-6.723-3.735-19.423 14.941-19.423 14.941-26.147 5.976-9.712 13.447 53.787-2.988 53.787-2.988 1.494-23.906 0-23.159-17.182 2.988-17.929 1.494"
          data-name="Path 278"
          transform="translate(280.5 81.521)"
        ></path>
      </g>
    </svg>
  );
}

// =============================================================================================
