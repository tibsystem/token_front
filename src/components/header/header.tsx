/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import DropdownNotification from "./dropdown/notification";
import DropdownLanguage from "./dropdown/language";
import DropdownProfile from "./dropdown/profile";
import SearchForm from "./search/form";
import DropdownMegaMenu from "./dropdown/mega";
import DarkModeSwitcher from "./DarkmodeSwitcher/DarkModeSwitcher";
import { useAppSettings } from "@/config/app-settings";
import UseProfile from "@/hooks/UseProfile";
import useDarkMode from "@/hooks/useDarkMode";

export default function Header() {
  const { settings, updateSettings } = useAppSettings();
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  const toggleAppSidebarEnd = (e: React.MouseEvent) => {
    e.preventDefault();

    updateSettings({
      appSidebarEndToggled: !settings.appSidebarEndToggled,
    });
  };

  const toggleAppSidebarEndMobile = (e: React.MouseEvent) => {
    e.preventDefault();

    updateSettings({
      appSidebarEndMobileToggled: true,
    });
  };

  const toggleAppSidebarMobile = () => {
    updateSettings({
      appSidebarMobileToggled: true,
    });
  };

  const toggleAppTopMenuMobile = () => {
    updateSettings({
      appTopMenuMobileToggled: true,
    });
  };

  const setAppMode = (mode: string) => {
    document.documentElement.setAttribute("data-bs-theme", mode);
    localStorage.appMode = mode;
    document.dispatchEvent(new Event("theme-reload"));
  };

  return (
    <div
      id="header"
      className="app-header"
      data-bs-theme={settings.appHeaderInverse ? "dark" : ""}
    >
      <div className="navbar-header">
        {settings.appSidebarTwo && (
          <button
            type="button"
            className="navbar-mobile-toggler"
            onClick={toggleAppSidebarEndMobile}
          >
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        )}
        <Link href="#" className="navbar-brand">
          <img
            src={
              isDarkMode
                ? "../../assets/img/logo-light.webp"
                : "../../assets/img/logo-dark.webp"
            }
            alt="Logo"
            className="logo"
          />
        </Link>

        {settings.appHeaderMegaMenu && (
          <button
            type="button"
            className="navbar-mobile-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#top-navbar"
          >
            <span className="fa-stack fa-lg text-inverse">
              <i className="far fa-square fa-stack-2x"></i>
              <i className="fa fa-cog fa-stack-1x"></i>
            </span>
          </button>
        )}
        {settings.appTopMenu && !settings.appSidebarNone && (
          <button
            type="button"
            className="navbar-mobile-toggler"
            onClick={toggleAppTopMenuMobile}
          >
            <span className="fa-stack fa-lg text-inverse">
              <i className="far fa-square fa-stack-2x"></i>
              <i className="fa fa-cog fa-stack-1x"></i>
            </span>
          </button>
        )}
        {settings.appSidebarNone && settings.appTopMenu && (
          <button
            type="button"
            className="navbar-mobile-toggler"
            onClick={toggleAppTopMenuMobile}
          >
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        )}
        {!settings.appSidebarNone && (
          <button
            type="button"
            className="navbar-mobile-toggler"
            onClick={toggleAppSidebarMobile}
          >
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        )}
      </div>

      {settings.appHeaderMegaMenu && <DropdownMegaMenu />}

      <div className="navbar-nav">
        {/* <SearchForm /> */}
        {/* <DropdownNotification /> */}

        {settings.appHeaderLanguageBar && <DropdownLanguage />}
        <DarkModeSwitcher
          checked={isDarkMode}
          onChange={() => {
            setIsDarkMode(!isDarkMode);
            setAppMode(!isDarkMode ? "dark" : "light");
          }}
        />

        <DropdownProfile />

        {settings.appSidebarTwo && (
          <div className="navbar-divider d-none d-md-block"></div>
        )}

        {settings.appSidebarTwo && (
          <div className="navbar-item d-none d-md-block">
            <Link
              href="/"
              onClick={toggleAppSidebarEnd}
              className="navbar-link icon"
            >
              <i className="fa fa-th"></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
