import ILLIOR from "./module/config.mjs";
import registerSystemSettings from "./module/settings.mjs";

import * as documents from "./module/documents/_module.mjs";
import * as utils from "./module/utils.mjs";

globalThis.illior = {
  config: ILLIOR,
  documents,
  utils,
};

Hooks.once("init", function () {
  globalThis.illior = game.illior = Object.assign(
    game.system,
    globalThis.illior
  );
  console.log(
    `Illior | Initializing the Illior Game System - Version ${illior.version}\n${ILLIOR.ASCII}`
  );

  CONFIG.ILLIOR = ILLIOR;
  CONFIG.Actor.documentClass = documents.ActorIllior;

  registerSystemSettings();
});

Hooks.once("setup", () => {});

Hooks.once("i18nInit", () => utils.performPreLocalization(CONFIG.ILLIOR));

Hooks.once("ready", () => {});

Hooks.on("canvasInit", (gameCanvas) => {
  gameCanvas.grid.diagonalRule = game.registerSettings.get(
    "illior",
    "diagonalMovement"
  );
});

export { documents, utils, ILLIOR };
