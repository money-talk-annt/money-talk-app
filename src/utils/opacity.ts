export const withOpacity = (opacity: number, color?: string, ) => {
  if (!color) return undefined;
  if (color.startsWith("#")) {
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0");

    return `${color}${alpha}`;
  }

  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }

  return color;
};
