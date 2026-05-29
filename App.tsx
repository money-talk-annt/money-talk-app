import { useFonts } from "expo-font";
import Navigation from "./src/navigation";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { initDatabase } from "./src/database/initDatabase";

const App = () => {
  const [loaded] = useFonts({
    "Hanken-Regular": require("./assets/fonts/HankenGrotesk-Regular.ttf"),
    "Hanken-Medium": require("./assets/fonts/HankenGrotesk-Medium.ttf"),
    "Hanken-SemiBold": require("./assets/fonts/HankenGrotesk-SemiBold.ttf"),
    "Hanken-Bold": require("./assets/fonts/HankenGrotesk-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  initDatabase();

  return (
    <I18nextProvider i18n={i18next}>
      <Navigation />
    </I18nextProvider>
  );
};

export default App;
