
import { createTheme } from "@/lib/utils";

export const discrepometroTheme = createTheme({
  dark: {
    background: "#F1F1F1", // Alterado para branco gelo
    foreground: "#1A1F2C", // Texto escuro para contraste
    card: "#FFFFFF", // Cards com fundo branco
    cardForeground: "#1A1F2C", // Texto escuro em cards
    popover: "#FFFFFF",
    popoverForeground: "#1A1F2C",
    primary: "#F97316", // tom dourado/laranja mantido
    primaryForeground: "#000000",
    secondary: "#E9ECF1", // Secundário mais claro
    secondaryForeground: "#1A1F2C",
    muted: "#E9ECF1",
    mutedForeground: "#5A6173", // Texto muted mais escuro para melhor legibilidade
    accent: "#E9ECF1",
    accentForeground: "#1A1F2C",
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
    border: "#D1D5DB", // Bordas mais visíveis
    input: "#FFFFFF", // Input com fundo branco
    ring: "#F97316",
  }
});
