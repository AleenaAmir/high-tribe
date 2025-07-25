import React from "react";

export default function StatsSummaryCards() {
  const data = [
    {
      head: "Total Payments",
      figures: "$2,722.86",
      bg: "bg-[#006FF8]",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="31"
          fill="none"
          viewBox="0 0 23 31"
        >
          <path
            fill="#fff"
            d="M8.662.895c-.469.02-.927.111-1.301.417-.375.306-.558.829-.529 1.348.06 1.039.702 2.291 2.043 4.23.704 1.016 1.121 1.775 1.64 2.72-.568.327-.96.932-.96 1.627 0 .423.15.812.39 1.128-2.083 1.078-4.275 2.81-5.267 5.176a4.09 4.09 0 0 0-3.593 4.049c0 1.227.55 2.328 1.413 3.076a1.74 1.74 0 0 0-.848 1.482c0 .262.064.508.17.732a1.74 1.74 0 0 0-.865 1.49c0 .952.785 1.737 1.737 1.737 3.414.01 7.18-.014 10.3 0 3.032 0 6.29-1.428 7.675-3.626 1.451-2.145 1.727-5.01.96-8.055l-.006-.01c-.749-2.795-3.199-4.813-5.518-6.024.253-.32.41-.72.41-1.156 0-.572-.266-1.082-.674-1.429.844-.675 1.997-1.69 3.021-2.854.743-.844 1.397-1.738 1.747-2.65.349-.911.347-1.983-.384-2.714-.405-.405-.975-.44-1.441-.365s-.921.249-1.367.43c-.445.182-.88.375-1.241.5s-.654.15-.708.14c-1.098-.22-2.361-.578-3.558-.88S9.6.856 8.662.895m.051 1.255c.643-.027 1.721.187 2.89.482s2.444.66 3.618.895c.493.098.922-.034 1.361-.185.44-.152.886-.354 1.307-.525s.819-.308 1.093-.352c.794-.043.593 1.015.453 1.39-.15.391-.418.839-.746 1.3-3.023.854-6.087.302-9.805-.623-.527-.94-.783-1.613-.802-1.942 0-.348.288-.44.631-.44m1.12 3.903c.663.155 1.31.286 1.951.404l.26 2.895h-.236c-.7-1.248-1.339-2.366-1.976-3.299m3.23.606q.592.08 1.176.125l-.928 2.568zm4.317.051a27 27 0 0 1-2.622 2.356l.797-2.236c.611-.002 1.22-.035 1.825-.12m-5.939 3.897h3.191c.359 0 .626.272.626.63a.61.61 0 0 1-.625.626H11.44a.614.614 0 0 1-.63-.626c0-.358.272-.63.63-.63m3.26 2.511c2.322 1.034 5.02 3.07 5.707 5.619.703 2.795.418 5.267-.783 7.04-1.201 1.775-3.34 2.94-6.647 3.028-2.093-.01-3.28-.002-4.175 0 .037-.14.062-.284.062-.435 0-.262-.064-.51-.171-.735.511-.304.861-.856.861-1.488 0-.863-.648-1.583-1.479-1.71a4.06 4.06 0 0 0 1.17-2.847 4.09 4.09 0 0 0-3.215-3.985c1.051-2.014 3.295-3.612 5.262-4.487h2.028v1.88c0 .837 1.255.837 1.255 0v-1.88zm-2.273 4.784v.237h-.645a.627.627 0 0 0-.565.625v2.367c.002.345.28.624.625.625h1.793v1.399h-1.793c-.855-.02-.855 1.274 0 1.255h.585v.236c0 .837 1.255.837 1.255 0v-.236h.583a.627.627 0 0 0 .625-.625V21.13a.63.63 0 0 0-.625-.63h-1.793v-1.107h1.793c.856.02.856-1.274 0-1.255h-.583v-.236a.628.628 0 1 0-1.255 0m-7.263.862A2.82 2.82 0 0 1 7.99 21.59a2.81 2.81 0 0 1-2.825 2.82 2.81 2.81 0 0 1-2.825-2.82 2.817 2.817 0 0 1 2.825-2.826m-1.779 6.902H7.82c.278 0 .482.204.482.481a.47.47 0 0 1-.482.482H3.386a.47.47 0 0 1-.481-.482c0-.277.204-.481.481-.481m-.694 2.223h4.437c.278 0 .482.204.482.482a.467.467 0 0 1-.482.481H2.692a.47.47 0 0 1-.482-.482c0-.277.204-.481.482-.481"
          ></path>
        </svg>
      ),
    },
    {
      head: "Average Rate",
      figures: "$61.88",
      bg: "bg-[#FF8B4F]",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          fill="none"
          viewBox="0 0 34 34"
        >
          <path
            fill="#fff"
            d="m18.552 16.021-3.446-4.25a2.496 2.496 0 1 0-4.2 0l-4.859 5.993a2 2 0 0 0-.597-.097 2.08 2.08 0 1 0 2.079 2.079 2.05 2.05 0 0 0-.266-.99l4.861-5.993a2.4 2.4 0 0 0 1.752 0l3.448 4.25c.343-.404.76-.74 1.228-.992M20.56 17.066a2.68 2.68 0 1 0 .007 5.359 2.68 2.68 0 0 0-.007-5.359M28.113 5.748a4.69 4.69 0 0 0-4.685 4.686 4.64 4.64 0 0 0 1.178 3.075l-2.038 2.512c.466.252.88.588 1.222.992l2.042-2.513a4.6 4.6 0 0 0 2.284.62 4.688 4.688 0 0 0 3.35-8.02 4.68 4.68 0 0 0-3.35-1.352zm0 7.798a3.112 3.112 0 1 1 .001-6.225 3.112 3.112 0 0 1 0 6.226M30.717 26.678H1.987a.787.787 0 0 0 0 1.574h28.73a.788.788 0 0 0 0-1.575M30.719 18.96h-4.108a.787.787 0 0 0 0 1.573h4.108a.787.787 0 0 0 0-1.573M28.113 23.133a.788.788 0 0 0 0-1.575H26.61a.788.788 0 0 0 0 1.575zM17.598 9.262h4.107a.787.787 0 0 0 0-1.574h-4.107a.787.787 0 0 0 0 1.574M17.598 11.86H19.1a.787.787 0 1 0 0-1.573h-1.503a.787.787 0 1 0 0 1.574"
          ></path>
        </svg>
      ),
    },
    {
      head: "Total Bookings",
      figures: "200",
      bg: "bg-[#752BDF]",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="31"
          height="30"
          fill="none"
          viewBox="0 0 31 30"
        >
          <path
            fill="#fff"
            d="M15.5.375C7.198.375.469 6.923.469 15S7.199 29.625 15.5 29.625 30.531 23.078 30.531 15 23.801.375 15.5.375m8.392 10.47L12.924 21.516a.72.72 0 0 1-.996 0l-.22-.215-.002.001-6.034-5.913a.673.673 0 0 1 0-.97l1.496-1.454a.72.72 0 0 1 .997 0l4.265 4.18 8.968-8.725a.72.72 0 0 1 .997 0l1.496 1.456c.276.266.276.7.001.97"
          ></path>
        </svg>
      ),
    },
    {
      head: "Total Nights",
      figures: "44",
      bg: "bg-[#FF3972]",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="31"
          height="31"
          fill="none"
          viewBox="0 0 31 31"
        >
          <path
            fill="#fff"
            d="M27.744 16.03a.73.73 0 0 0-.762-.174c-1.075.379-2.2.57-3.344.57-2.68 0-5.2-1.043-7.096-2.938a10.09 10.09 0 0 1-2.368-10.44.734.734 0 0 0-.936-.936 11.4 11.4 0 0 0-4.304 2.716 11.43 11.43 0 0 0-3.37 8.134c0 3.073 1.197 5.961 3.37 8.134a11.43 11.43 0 0 0 8.134 3.37c3.073 0 5.962-1.197 8.134-3.37a11.4 11.4 0 0 0 2.716-4.304.73.73 0 0 0-.174-.762m-3.58 4.028a9.97 9.97 0 0 1-7.096 2.94 9.97 9.97 0 0 1-7.096-2.94c-3.913-3.913-3.913-10.28 0-14.192a10 10 0 0 1 2.394-1.774 11.5 11.5 0 0 0 .033 4.754 11.46 11.46 0 0 0 3.105 5.68 11.43 11.43 0 0 0 8.134 3.369q1.167-.001 2.3-.23a10 10 0 0 1-1.774 2.393"
          ></path>
          <path
            fill="#fff"
            d="M27.232 6.698a2.9 2.9 0 0 0-2.046-1.254 4.04 4.04 0 0 0-1.257-1.542 4.03 4.03 0 0 0-2.427-.804 4.03 4.03 0 0 0-2.427.804 4.04 4.04 0 0 0-1.257 1.542 2.904 2.904 0 0 0-2.545 2.879c0 1.599 1.301 2.9 2.9 2.9h8.878a2.27 2.27 0 0 0 2.266-2.266c0-1.189-.92-2.167-2.085-2.26m-.18 3.057h-8.878c-.79 0-1.433-.643-1.433-1.432a1.434 1.434 0 0 1 1.534-1.428c.34.023.65-.189.75-.513a2.58 2.58 0 0 1 2.477-1.816c1.14 0 2.135.73 2.476 1.816a.734.734 0 0 0 .751.513q.06-.005.102-.005c.565 0 1.079.334 1.309.852a.734.734 0 0 0 .785.426.8.8 0 1 1 .127 1.587M11.368 25.054a2.45 2.45 0 0 0-1.599-.984 3.35 3.35 0 0 0-3.013-1.867c-.73 0-1.425.23-2.01.666-.429.32-.77.73-1.003 1.2a2.45 2.45 0 0 0-2.061 2.415 2.45 2.45 0 0 0 2.445 2.445h7.012a1.947 1.947 0 0 0 1.945-1.944c0-.995-.751-1.817-1.716-1.93m-.229 2.408H4.127a.978.978 0 1 1 .07-1.952.73.73 0 0 0 .75-.512 1.89 1.89 0 0 1 1.809-1.327c.833 0 1.56.533 1.809 1.327a.734.734 0 0 0 .75.512l.07-.003a.98.98 0 0 1 .893.581.734.734 0 0 0 .786.427.475.475 0 0 1 .552.47.477.477 0 0 1-.477.477M6.71 4.544a1.468 1.468 0 1 0-2.935 0 1.468 1.468 0 0 0 2.936 0M4.656 17.387a.88.88 0 1 0-1.762 0 .88.88 0 0 0 1.762 0M26.086 23.732a.88.88 0 1 0-1.762 0 .88.88 0 0 0 1.762 0M23.176 14.598a.88.88 0 1 0 0-1.76.88.88 0 0 0 0 1.76M17.64 26.447a.88.88 0 1 0-1.76 0 .88.88 0 0 0 1.76 0"
          ></path>
        </svg>
      ),
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white py-4 px-2 rounded-lg border border-[#D1D1D1] flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-[12px] md:text-[14px] font-medium ">
                {item.head}
              </p>
              <p className="text-[18px] md:text-[24px] font-bold">
                {item.figures}
              </p>
            </div>
            <div
              className={`${
                item.bg ? item.bg : "bg-black"
              } rounded-full p-2 aspect-square h-[53px] w-[53px] flex items-center justify-center`}
            >
              {item.svg}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
