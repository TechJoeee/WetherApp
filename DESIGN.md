# WetherApp design

## Direction

WetherApp is a calm weather instrument rather than a generic dashboard. The current conditions own the first viewport; forecast and detail data stay subordinate.

## Visual language

- Deep ink-blue canvas with mineral blue panels and a cool electric-blue accent.
- Condition-aware ambient glow, grid texture, and simple weather illustration.
- Manrope for utility copy and IBM Plex Sans for the product mark and data display.
- Thin translucent borders, soft depth, and generous spacing; no nested card maze.

## Interaction

- Search refreshes the weather stage with a restrained fade/translate transition.
- Weather data comes from Open-Meteo and the last city/unit preference is stored locally.
- Celsius/Fahrenheit switching updates current, high, low, and feels-like values without refetching.
- Reduced-motion users receive the same states without animated transitions.

## Responsive behavior

- The stage becomes a compact vertical composition on narrow screens.
- Detail metrics collapse into a two-column grid.
- Forecast items become a horizontal scroll strip to preserve readable card width.
