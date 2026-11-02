import React, { useState } from 'react';
import { HeaderTopStrip } from './HeaderTopStrip';
import { HeaderDesktop } from './HeaderDesktop';
import { HeaderMobile } from './HeaderMobile';
import { MobileTabBar } from './MobileTabBar';
import { CommandPalette } from './CommandPalette';

export const Navbar: React.FC = () => {
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  return (
    <>
      {/* 1. Slim Demo Mode Top Strip with Live Dot */}
      <HeaderTopStrip />

      {/* 2. Desktop 64px Header & Shelf-Label Category Rail */}
      <HeaderDesktop onOpenSearch={() => setSearchPaletteOpen(true)} />

      {/* 3. Mobile Header (Logo, Search, Bag) */}
      <HeaderMobile onOpenSearch={() => setSearchPaletteOpen(true)} />

      {/* 4. Mobile Bottom Tab Bar with layoutId pill */}
      <MobileTabBar onOpenSearch={() => setSearchPaletteOpen(true)} />

      {/* 5. Command Palette Search Overlay */}
      <CommandPalette
        isOpen={searchPaletteOpen}
        onClose={() => setSearchPaletteOpen(false)}
      />
    </>
  );
};
