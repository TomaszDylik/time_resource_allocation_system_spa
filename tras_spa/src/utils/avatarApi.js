export async function fetchIconSvg() {
  try {
    const response = await fetch('https://api.iconify.design/streamline-emojis:barber-pole.svg');
    const svgCode = await response.text(); 
    return svgCode;
  } catch (error) {
    return null;
  }
}