import '../styles/LogoClima.css'; // Asegúrate de que en este CSS NO haya background-color para `.clima`

const LogoClima = () => (
  <svg
    className="clima"
    viewBox="0 0 290 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Texto "C" */}
    <text
      x="10"
      y="60"
      fontFamily="Segoe UI, Arial, sans-serif"
      fontSize="56"
      fontWeight="bold"
      fill="#334D6E"
    >
      C
    </text>

    {/* Ícono clima (entre L e I) */}
    <g transform="translate(54,10)">
      <ellipse cx="36" cy="59" rx="17" ry="5" fill="#b0c6e8" opacity="0.18" />
      <circle cx="50" cy="26" r="12" fill="#FFE066" stroke="#F9C846" strokeWidth="2" />
      <ellipse cx="31" cy="38" rx="15" ry="9" fill="#E3ECF7" stroke="#A5B7CC" strokeWidth="1.8" />
      <ellipse cx="45" cy="42" rx="11" ry="7" fill="#E3ECF7" stroke="#A5B7CC" strokeWidth="1.8" />
      <path d="M30 55C30 59 36 59 36 55C36 52 33 50 33 50C33 50 30 52 30 55Z" fill="#50B3E2" stroke="#3B7EA1" strokeWidth="1.1" />
      <ellipse cx="28" cy="35" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.5" />
    </g>

    {/* Texto "L" */}
    <text
      x="52"
      y="60"
      fontFamily="Segoe UI, Arial, sans-serif"
      fontSize="56"
      fontWeight="bold"
      fill="#334D6E"
    >
      L
    </text>

    {/* Espacio reservado sin fondo */}
    <rect x="95" y="15" width="65" height="60" fill="none" />

    {/* Texto "IMA" */}
    <text
      x="125"
      y="60"
      fontFamily="Segoe UI, Arial, sans-serif"
      fontSize="56"
      fontWeight="bold"
      fill="#334D6E"
    >
      IMA
    </text>
  </svg>
);

export default LogoClima;
