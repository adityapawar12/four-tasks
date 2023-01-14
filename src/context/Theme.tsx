import { createContext, useContext, useState } from "react";

interface ThemeInterface {
  backgroundColor: string;
  color: string;
  isDarkModeOn?: boolean;
}

interface ThemeContextInterface {
  theme: ThemeInterface;
  changeTheme?(themeSettings: ThemeInterface): void;
}

export const ThemeContext = createContext<ThemeContextInterface | null>(null);

export const ThemeProvider = ({ children }: { children: JSX.Element }) => {
  const [theme, setTheme] = useState<ThemeInterface>({
    backgroundColor: `bg-violet-700`,
    color: `white`,
  });

  const changeTheme = (themeSettings: ThemeInterface): void => {
    const { backgroundColor, color } = themeSettings;
    setTheme({ backgroundColor: backgroundColor, color: color });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
