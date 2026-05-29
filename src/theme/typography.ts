import { FONT_MAP } from "../constants/fontMap";

export const TYPOGRAPHY = {
  displayLg: {
    fontSize: 40,
    fontFamily: FONT_MAP['700'],
    lineHeight: 48,
  },
  headlineLg: {
    fontSize: 28,
    fontFamily: FONT_MAP['600'],
    lineHeight: 36,
  },
  headlineMd: {
    fontSize: 22,
    fontFamily: FONT_MAP['600'],
    lineHeight: 28,
  },
  bodyLg: {
    fontSize: 18,
    fontFamily: FONT_MAP['400'],
    lineHeight: 26,
  },
  bodyLgBold: {
    fontSize: 18,
    fontFamily: FONT_MAP['700'],
    lineHeight: 26,
  },
  bodyMdBold: {
    fontSize: 16,
    fontFamily: FONT_MAP['700'],
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 16,
    fontFamily: FONT_MAP['400'],
    lineHeight: 24,
  },
  labelMdBold: {
    fontSize: 14,
    fontFamily: FONT_MAP['700'],
    lineHeight: 20,
  },
  labelMd: {
    fontSize: 14,
    fontFamily: FONT_MAP['500'],
    lineHeight: 20,
  },
  labelSm: {
    fontSize: 12,
    fontFamily: FONT_MAP['600'],
    lineHeight: 16,
  },
} as const;
