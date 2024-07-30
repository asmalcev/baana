# CHANGELOG

## 0.4.0 (BREAKING CHANGES)

- `LineContextProvider` divided into `ArrowsContextProvider` and `ArrowsContainer`, so now you should `useArrowsContext` instead of `useLineContext`
- Removed `onlyIntegerCoords`
- Removed `arrowClassName` from `ArrowsContextProvider` props: Instead of setting `className` for every arrow, a better way would be to set a CSS selector for each path in `ArrowsContainer` (Example: `.svg-container path`)
