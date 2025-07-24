import useDarkMode from "@/hooks/useDarkMode";

const lightTheme = {
  bg: "#fff",
  titleColor: "#212529",
  card1Bg: "linear-gradient(135deg, #2C2C2E 0%, #1C1C1E 100%)",
  card2Bg: "linear-gradient(135deg, #2C2C2E 0%, #1C1C1E 100%)",
  cardTextColor: "#fff",
  cardSecondaryTextColor: "rgba(255, 255, 255, 0.9)",
  separatorColor: "#eee",
  item1Color: "#000000",
  item2Color: "#000000",
  item3Color: "#000000",
};

const darkTheme = {
  bg: "#1C1C1E",
  titleColor: "#FFFFFF",
  card1Bg: "linear-gradient(135deg, #2C2C2E 0%, #1C1C1E 100%)",
  card2Bg: "linear-gradient(135deg, #2C2C2E 0%, #1C1C1E 100%)",
  cardTextColor: "#FFFFFF",
  cardSecondaryTextColor: "#a1a1a6",
  separatorColor: "rgba(255, 255, 255, 0.1)",
  item1Color: "#FFFFFF",
  item2Color: "#FFFFFF",
  item3Color: "#FFFFFF",
};

const getBadgeBg = (isDarkMode, itemColor) => {
  return isDarkMode ? "#3A3A3C" : itemColor;
};

export default function Dashboardsummary({
  Propiedades,
  investidores,
  valorNegociado,
  graficoData,
}) {
  const { isDarkMode } = useDarkMode();
  const theme = isDarkMode ? darkTheme : lightTheme;
  return (
    <div
      style={{
        background: theme.bg,
        borderRadius: 24,
        boxShadow: theme.shadow,
        padding: 32,
        minWidth: 320,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 24,
        transition: "background 0.3s, box-shadow 0.3s",
      }}
    >
      <h4
        style={{
          fontWeight: 700,
          fontSize: 20,
          marginBottom: 16,
          color: theme.titleColor,
        }}
      >
        Resumo Executivo
      </h4>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div
          style={{
            flex: 1,
            background: theme.card1Bg,
            borderRadius: 18,
            minHeight: 70,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -10,
              top: -40,
              opacity: 0.1,
              fontSize: 110,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            <i
              className="fa fa-home fa-fw"
              style={{ color: theme.cardTextColor }}
            ></i>
          </div>
          <div style={{ position: "relative", zIndex: 2, padding: 16 }}>
            <div
              style={{
                color: theme.cardSecondaryTextColor,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Média/Imóvel
            </div>
            <div
              style={{
                color: theme.cardTextColor,
                fontSize: 24,
                fontWeight: 700,
                margin: "8px 0",
              }}
            >
              R${" "}
              {Propiedades > 0
                ? Number(valorNegociado / Propiedades).toLocaleString("pt-BR", {
                    maximumFractionDigits: 0,
                  })
                : "0"}
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: theme.card2Bg,
            borderRadius: 18,
            minHeight: 70,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -10,
              top: -40,
              opacity: 0.1,
              fontSize: 110,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            <i
              className="fa fa-user-friends fa-fw"
              style={{ color: theme.cardTextColor }}
            ></i>
          </div>
          <div style={{ position: "relative", zIndex: 2, padding: 16 }}>
            <div
              style={{
                color: theme.cardSecondaryTextColor,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Média/Investidor
            </div>
            <div
              style={{
                color: theme.cardTextColor,
                fontSize: 24,
                fontWeight: 700,
                margin: "8px 0",
              }}
            >
              R${" "}
              {investidores > 0
                ? Number(valorNegociado / investidores).toLocaleString(
                    "pt-BR",
                    { maximumFractionDigits: 0 }
                  )
                : "0"}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          borderTop: `1px solid ${theme.separatorColor}`,
          marginBottom: 16,
        }}
      ></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: theme.item1Color,
              fontWeight: 500,
            }}
          >
            <i className="fa fa-building"></i> Imóveis Ativos
          </span>
          <span
            style={{
              background: getBadgeBg(isDarkMode, theme.item1Color),
              color: "#fff",
              borderRadius: 12,
              padding: "2px 12px",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {Propiedades}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: theme.item2Color,
              fontWeight: 500,
            }}
          >
            <i className="fa fa-users"></i> Investidores Ativos
          </span>
          <span
            style={{
              background: getBadgeBg(isDarkMode, theme.item2Color),
              color: "#fff",
              borderRadius: 12,
              padding: "2px 12px",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {investidores}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: theme.item3Color,
              fontWeight: 500,
            }}
          >
            <i className="fa fa-chart-line"></i> Dias com Transações
          </span>
          <span
            style={{
              background: getBadgeBg(isDarkMode, theme.item3Color),
              color: "#fff",
              borderRadius: 12,
              padding: "2px 12px",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {graficoData.categories.length}
          </span>
        </div>
      </div>
    </div>
  );
}
