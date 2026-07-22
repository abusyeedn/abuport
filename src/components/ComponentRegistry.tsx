/**
 * ComponentRegistry — maps component name strings to their lazy-loaded implementations.
 *
 * Used by DynamicRenderer to instantiate duplicated or user-added components at runtime
 * without hard-coded imports at the call site. Adding a new draggable component requires
 * only a single entry here.
 */
import React from 'react';
import HintTooltip from './HintTooltip';
import ScrollReveal from './ScrollReveal';
import MediaElement from './MediaElement';

export const ComponentRegistry: Record<string, React.ComponentType<any>> = {
  MacOSFolder: React.lazy(() => import('./MacOSFolder')),
  VinylDeck: React.lazy(() => import('./VinylDeck')),
  CDPlayer: React.lazy(() => import('./CDPlayer')),
  TiltCard: React.lazy(() => import('./TiltCard')),
  EnvelopesStack: React.lazy(() => import('./EnvelopesStack')),
  CircularGallery: React.lazy(() => import('./CircularGallery')),
  CelestialChatButton: React.lazy(() => import('./CelestialChatButton')),
  HintTooltip: HintTooltip,
  ScrollReveal: ScrollReveal,
  MediaElement: MediaElement,
};
