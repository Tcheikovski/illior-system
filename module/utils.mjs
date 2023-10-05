/* -------------------------------------------- */
/*  Formulas                                    */
/* -------------------------------------------- */

/**
 * Convert a bonus value to a simple integer for displaying on the sheet.
 * @param {number|string|null} bonus  Bonus formula.
 * @param {object} [data={}]          Data to use for replacing @ strings.
 * @returns {number}                  Simplified bonus as an integer.
 * @protected
 */
export function simplifyBonus(bonus, data = {}) {
  if (!bonus) return 0;
  if (Number.isNumeric(bonus)) return Number(bonus);
  try {
    const roll = new Roll(bonus, data);
    return roll.isDeterministic ? Roll.safeEval(roll.formula) : 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

/* -------------------------------------------- */
/*  Object Helpers                              */
/* -------------------------------------------- */

/**
 * Sort the provided object by its values or by an inner sortKey.
 * @param {object} obj        The object to sort.
 * @param {string} [sortKey]  An inner key upon which to sort.
 * @returns {object}          A copy of the original object that has been sorted.
 */
export function sortObjectEntries(obj, sortKey) {
  let sorted = Object.entries(obj);
  if (sortKey)
    sorted = sorted.sort((a, b) => a[1][sortKey].localeCompare(b[1][sortKey]));
  else sorted = sorted.sort((a, b) => a[1].localeCompare(b[1]));
  return Object.fromEntries(sorted);
}

/* -------------------------------------------- */

/**
 * Retrieve the indexed data for a Document using its UUID. Will never return a result for embedded documents.
 * @param {string} uuid  The UUID of the Document index to retrieve.
 * @returns {object}     Document's index if one could be found.
 */
export function indexFromUuid(uuid) {
  const parts = uuid.split(".");
  let index;

  // Compendium Documents
  if (parts[0] === "Compendium") {
    const [, scope, packName, id] = parts;
    const pack = game.packs.get(`${scope}.${packName}`);
    index = pack?.index.get(id);
  }

  // World Documents
  else if (parts.length < 3) {
    const [docName, id] = parts;
    const collection = CONFIG[docName].collection.instance;
    index = collection.get(id);
  }

  return index || null;
}

/* -------------------------------------------- */

/**
 * Creates an HTML document link for the provided UUID.
 * @param {string} uuid  UUID for which to produce the link.
 * @returns {string}     Link to the item or empty string if item wasn't found.
 */
export function linkForUuid(uuid) {
  return TextEditor._createContentLink(["", "UUID", uuid]).outerHTML;
}

/* -------------------------------------------- */
/*  Validators                                  */
/* -------------------------------------------- */

/**
 * Ensure the provided string contains only the characters allowed in identifiers.
 * @param {string} identifier
 * @returns {boolean}
 */
function isValidIdentifier(identifier) {
  return /^([a-z0-9_-]+)$/i.test(identifier);
}

export const validators = {
  isValidIdentifier: isValidIdentifier,
};

/* -------------------------------------------- */
/*  Handlebars Template Helpers                 */
/* -------------------------------------------- */

/**
 * Define a set of template paths to pre-load. Pre-loaded templates are compiled and cached for fast access when
 * rendering. These paths will also be available as Handlebars partials by using the file name
 * (e.g. "illior.actor-traits").
 * @returns {Promise}
 */
export async function preloadHandlebarsTemplates() {
  const partials = [
    /* // Shared Partials
    "systems/illior/templates/actors/parts/active-effects.hbs",
    "systems/illior/templates/apps/parts/trait-list.hbs",

    // Actor Sheet Partials
    "systems/illior/templates/actors/parts/actor-traits.hbs",
    "systems/illior/templates/actors/parts/actor-inventory.hbs",
    "systems/illior/templates/actors/parts/actor-features.hbs",
    "systems/illior/templates/actors/parts/actor-spellbook.hbs",
    "systems/illior/templates/actors/parts/actor-warnings.hbs",

    // Item Sheet Partials
    "systems/illior/templates/items/parts/item-action.hbs",
    "systems/illior/templates/items/parts/item-activation.hbs",
    "systems/illior/templates/items/parts/item-advancement.hbs",
    "systems/illior/templates/items/parts/item-description.hbs",
    "systems/illior/templates/items/parts/item-mountable.hbs",
    "systems/illior/templates/items/parts/item-spellcasting.hbs",
    "systems/illior/templates/items/parts/item-summary.hbs",

    // Journal Partials
    "systems/illior/templates/journal/parts/journal-table.hbs",

    // Advancement Partials
    "systems/illior/templates/advancement/parts/advancement-ability-score-control.hbs",
    "systems/illior/templates/advancement/parts/advancement-controls.hbs",
    "systems/illior/templates/advancement/parts/advancement-spell-config.hbs", */
  ];

  const paths = {};
  for (const path of partials) {
    paths[path.replace(".hbs", ".html")] = path;
    paths[`illior.${path.split("/").pop().replace(".hbs", "")}`] = path;
  }

  return loadTemplates(paths);
}

/* -------------------------------------------- */

/**
 * A helper that fetch the appropriate item context from root and adds it to the first block parameter.
 * @param {object} context  Current evaluation context.
 * @param {object} options  Handlebars options.
 * @returns {string}
 */
function itemContext(context, options) {
  if (arguments.length !== 2)
    throw new Error("#illior-itemContext requires exactly one argument");
  if (foundry.utils.getType(context) === "function")
    context = context.call(this);

  const ctx = options.data.root.itemContext?.[context.id];
  if (!ctx) {
    const inverse = options.inverse(this);
    if (inverse) return options.inverse(this);
  }

  return options.fn(context, { data: options.data, blockParams: [ctx] });
}

/* -------------------------------------------- */

/**
 * Register custom Handlebars helpers used by 5e.
 */
export function registerHandlebarsHelpers() {
  Handlebars.registerHelper({
    getProperty: foundry.utils.getProperty,
    "illior-linkForUuid": linkForUuid,
    "illior-itemContext": itemContext,
  });
}

/* -------------------------------------------- */
/*  Config Pre-Localization                     */
/* -------------------------------------------- */

/**
 * Storage for pre-localization configuration.
 * @type {object}
 * @private
 */
const _preLocalizationRegistrations = {};

/**
 * Mark the provided config key to be pre-localized during the init stage.
 * @param {string} configKeyPath          Key path within `CONFIG.ILLIOR` to localize.
 * @param {object} [options={}]
 * @param {string} [options.key]          If each entry in the config enum is an object,
 *                                        localize and sort using this property.
 * @param {string[]} [options.keys=[]]    Array of localization keys. First key listed will be used for sorting
 *                                        if multiple are provided.
 * @param {boolean} [options.sort=false]  Sort this config enum, using the key if set.
 */
export function preLocalize(
  configKeyPath,
  { key, keys = [], sort = false } = {}
) {
  if (key) keys.unshift(key);
  _preLocalizationRegistrations[configKeyPath] = { keys, sort };
}

/* -------------------------------------------- */

/**
 * Execute previously defined pre-localization tasks on the provided config object.
 * @param {object} config  The `CONFIG.ILLIOR` object to localize and sort. *Will be mutated.*
 */
export function performPreLocalization(config) {
  for (const [keyPath, settings] of Object.entries(
    _preLocalizationRegistrations
  )) {
    const target = foundry.utils.getProperty(config, keyPath);
    _localizeObject(target, settings.keys);
    if (settings.sort)
      foundry.utils.setProperty(
        config,
        keyPath,
        sortObjectEntries(target, settings.keys[0])
      );
  }
}

/* -------------------------------------------- */

/**
 * Localize the values of a configuration object by translating them in-place.
 * @param {object} obj       The configuration object to localize.
 * @param {string[]} [keys]  List of inner keys that should be localized if this is an object.
 * @private
 */
function _localizeObject(obj, keys) {
  for (const [k, v] of Object.entries(obj)) {
    const type = typeof v;
    if (type === "string") {
      obj[k] = game.i18n.localize(v);
      continue;
    }

    if (type !== "object") {
      console.error(
        new Error(
          `Pre-localized configuration values must be a string or object, ${type} found for "${k}" instead.`
        )
      );
      continue;
    }
    if (!keys?.length) {
      console.error(
        new Error(
          "Localization keys must be provided for pre-localizing when target is an object."
        )
      );
      continue;
    }

    for (const key of keys) {
      if (!v[key]) continue;
      v[key] = game.i18n.localize(v[key]);
    }
  }
}
