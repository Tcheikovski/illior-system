export default function registerSystemSettings() {
  // Diagonal Movement Rule
  game.settings.register("illior", "diagonalMovement", {
    name: "SETTINGS.IlliorDiagN",
    hint: "SETTINGS.IlliorDiagL",
    scope: "world",
    config: true,
    default: "555",
    type: String,
    choices: {
      555: "SETTINGS.IlliorDiagPHB",
      5105: "SETTINGS.IlliorDiagDMG",
      EUCL: "SETTINGS.IlliorDiagEuclidean",
    },
    onChange: (rule) => (canvas.grid.diagonalRule = rule),
  });
}
