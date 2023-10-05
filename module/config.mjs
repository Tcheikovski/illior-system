import { preLocalize } from "./utils.mjs";

// Namespace Configuration Values
const ILLIOR = {};

// ASCII Artwork
ILLIOR.ASCII = `
▪  ▄▄▌  ▄▄▌  ▪        ▄▄▄  
██ ██•  ██•  ██ ▪     ▀▄ █·
▐█·██▪  ██▪  ▐█· ▄█▀▄ ▐▀▀▄ 
▐█▌▐█▌▐▌▐█▌▐▌▐█▌▐█▌.▐▌▐█•█▌
▀▀▀.▀▀▀ .▀▀▀ ▀▀▀ ▀█▄▀▪.▀  ▀
`;

ILLIOR.abilities = {
  phy: {
    label: "ILLIOR.AbilityPhy",
    abbreviation: "ILLIOR.AbilityPhyAbbr",
  },
  soc: {
    label: "ILLIOR.AbilitySoc",
    abbreviation: "ILLIOR.AbilitySocAbbr",
  },
  spi: {
    label: "ILLIOR.AbilitySpi",
    abbreviation: "ILLIOR.AbilitySpiAbbr",
  },
  uti: {
    label: "ILLIOR.AbilityUti",
    abbreviation: "ILLIOR.AbilityUtiAbbr",
  },
};
preLocalize("abilities", { keys: ["label", "abbreviation"] });

ILLIOR.currencies = {
  gp: {
    label: "ILLIOR.CurrencyGP",
    abbreviation: "ILLIOR.CurrencyAbbrGP",
    conversion: 1,
  },
  sp: {
    label: "ILLIOR.CurrencySP",
    abbreviation: "ILLIOR.CurrencyAbbrSP",
    conversion: 10,
  },
  cp: {
    label: "ILLIOR.CurrencyCP",
    abbreviation: "ILLIOR.CurrencyAbbrCP",
    conversion: 100,
  },
};
preLocalize("currencies", { keys: ["label", "abbreviation"] });

export default ILLIOR;
