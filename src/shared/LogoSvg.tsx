const LogoSvg = () => {
  return (
    <svg className="block w-full dark:hidden" viewBox="0 0 160 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Map pin */}
      <path
        d="M15 2C9.48 2 5 6.56 5 12.17C5 19.5 15 30 15 30C15 30 25 19.5 25 12.17C25 6.56 20.52 2 15 2Z"
        fill="#EA580C"
      />
      <circle cx="15" cy="12" r="4.5" fill="white" />
      <circle cx="15" cy="12" r="2" fill="#EA580C" />

      {/* Tourkokan wordmark */}
      <text x="33" y="14" fontFamily="'Poppins', sans-serif" fontSize="13" fontWeight="700" fill="#1F2937">Tour</text>
      <text x="33" y="28" fontFamily="'Poppins', sans-serif" fontSize="13" fontWeight="600" fill="#EA580C">Kokan</text>
    </svg>
  )
}

export default LogoSvg
