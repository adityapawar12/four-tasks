import { createContext, useContext, useState } from "react";

interface SideNavOnlyInterface {
  isOpen: boolean;
}

interface SideNavContextInterface {
  sideNav: SideNavOnlyInterface;
  toggleSideNav?(): void;
}

export const SideNavContext = createContext<SideNavContextInterface | null>(
  null
);

export const SideNavProvider = ({ children }: { children: JSX.Element }) => {
  const [sideNav, setSideNav] = useState<SideNavOnlyInterface>({
    isOpen: false,
  });

  const toggleSideNav = (): void => {
    setSideNav((prevSideNav: SideNavOnlyInterface) => {
      return { ...prevSideNav, isOpen: !prevSideNav.isOpen };
    });
  };

  return (
    <SideNavContext.Provider
      value={{
        sideNav,
        toggleSideNav,
      }}
    >
      {children}
    </SideNavContext.Provider>
  );
};

export const useSideNav = () => {
  return useContext(SideNavContext);
};
