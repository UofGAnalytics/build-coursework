#!/usr/bin/env node

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 1342:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ buildUnit)
/* harmony export */ });
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2037);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4760);
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2930);
/* harmony import */ var _knitr_knitr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3432);
/* harmony import */ var _latex_tex_to_directive__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7633);
/* harmony import */ var _linter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1399);
/* harmony import */ var _linter_assert_no_image_attributes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9051);
/* harmony import */ var _mdast__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1807);
/* harmony import */ var _mdast_combined__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1316);
/* harmony import */ var _pdf__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(495);
/* harmony import */ var _pre_parse__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(8534);
/* harmony import */ var _code_code_to_alias_directive__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(6217);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_hast__WEBPACK_IMPORTED_MODULE_1__, _html__WEBPACK_IMPORTED_MODULE_2__, _knitr_knitr__WEBPACK_IMPORTED_MODULE_3__, _latex_tex_to_directive__WEBPACK_IMPORTED_MODULE_4__, _linter__WEBPACK_IMPORTED_MODULE_5__, _mdast__WEBPACK_IMPORTED_MODULE_7__, _mdast_combined__WEBPACK_IMPORTED_MODULE_8__, _pdf__WEBPACK_IMPORTED_MODULE_9__, _pre_parse__WEBPACK_IMPORTED_MODULE_10__]);
([_hast__WEBPACK_IMPORTED_MODULE_1__, _html__WEBPACK_IMPORTED_MODULE_2__, _knitr_knitr__WEBPACK_IMPORTED_MODULE_3__, _latex_tex_to_directive__WEBPACK_IMPORTED_MODULE_4__, _linter__WEBPACK_IMPORTED_MODULE_5__, _mdast__WEBPACK_IMPORTED_MODULE_7__, _mdast_combined__WEBPACK_IMPORTED_MODULE_8__, _pdf__WEBPACK_IMPORTED_MODULE_9__, _pre_parse__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);












async function buildUnit(unit, ctx) {
  const unifiedFile = await (0,_knitr_knitr__WEBPACK_IMPORTED_MODULE_3__/* .knitr */ .M)(unit, ctx);
  const mdast = await inSituTransforms(unifiedFile, ctx);
  // console.log(mdast);

  await (0,_linter__WEBPACK_IMPORTED_MODULE_5__/* .createReport */ .Z)(unifiedFile, mdast, ctx);
  const result = {
    unit,
    md: combineMdFiles(unifiedFile),
    files: [unifiedFile]
  };
  if (!ctx.options.noHtml) {
    result.html = await syntaxTreeTransforms(mdast, unifiedFile, unit, ctx);
  }
  if (!ctx.options.noPdf) {
    const transformed = await syntaxTreeTransforms(mdast, unifiedFile, unit, ctx, true);
    result.pdf = {
      ...transformed,
      pdf: await (0,_pdf__WEBPACK_IMPORTED_MODULE_9__/* .convertToPdf */ .A)(transformed.html)
    };
  }
  if (!ctx.options.noReport) {
    (0,_linter__WEBPACK_IMPORTED_MODULE_5__/* .reportErrors */ .E)(result.files, ctx);
  }
  return result;
}
async function inSituTransforms(file, ctx) {
  (0,_linter_assert_no_image_attributes__WEBPACK_IMPORTED_MODULE_6__/* .assertNoImageAttributes */ .F)(file);
  (0,_pre_parse__WEBPACK_IMPORTED_MODULE_10__/* .preParsePhase */ .Z)(file);
  await (0,_code_code_to_alias_directive__WEBPACK_IMPORTED_MODULE_11__/* .codeToAliasDirective */ .S)(file, ctx);
  (0,_latex_tex_to_directive__WEBPACK_IMPORTED_MODULE_4__/* .texToAliasDirective */ .T)(file, ctx);
  return (0,_mdast__WEBPACK_IMPORTED_MODULE_7__/* .mdastPhase */ .c)(file, ctx);
}
function combineMdFiles(file) {
  return removeDirectoryLines(file.value);
}
function removeDirectoryLines(md) {
  return md.split(os__WEBPACK_IMPORTED_MODULE_0__.EOL).filter(line => !/^::directory\[.+\]$/.test(line)).join(os__WEBPACK_IMPORTED_MODULE_0__.EOL);
}
async function syntaxTreeTransforms(_mdast, file, unit, ctx, targetPdf) {
  const mdast = await (0,_mdast_combined__WEBPACK_IMPORTED_MODULE_8__/* .combinedMdastPhase */ .P)(_mdast, ctx, file, targetPdf);
  const hast = await (0,_hast__WEBPACK_IMPORTED_MODULE_1__/* .hastPhase */ .s)(mdast, ctx, file, targetPdf);
  const html = await (0,_html__WEBPACK_IMPORTED_MODULE_2__/* .htmlPhase */ .D)(hast, mdast, file, unit, ctx, targetPdf);
  return {
    mdast,
    hast,
    html
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 606:
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7564);
/* harmony import */ var figures__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3952);
/* harmony import */ var yargs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2699);
/* harmony import */ var yargs_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1091);
/* harmony import */ var _linter_report__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1110);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9474);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([chalk__WEBPACK_IMPORTED_MODULE_0__, figures__WEBPACK_IMPORTED_MODULE_1__, yargs__WEBPACK_IMPORTED_MODULE_2__, yargs_helpers__WEBPACK_IMPORTED_MODULE_3__, _linter_report__WEBPACK_IMPORTED_MODULE_4__, ___WEBPACK_IMPORTED_MODULE_5__]);
([chalk__WEBPACK_IMPORTED_MODULE_0__, figures__WEBPACK_IMPORTED_MODULE_1__, yargs__WEBPACK_IMPORTED_MODULE_2__, yargs_helpers__WEBPACK_IMPORTED_MODULE_3__, _linter_report__WEBPACK_IMPORTED_MODULE_4__, ___WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






const args = {
  week: {
    type: 'number',
    description: 'Build specific week (1-based index)'
  },
  watch: {
    type: 'boolean',
    description: 'Watch coursework for changes'
  },
  noDoc: {
    type: 'boolean',
    description: 'Only compile content HTML'
  },
  noHtml: {
    type: 'boolean',
    description: "Don't create HTML file"
  },
  noPdf: {
    type: 'boolean',
    description: "Don't create PDF file"
  },
  noSyntaxHighlight: {
    type: 'boolean',
    description: 'No syntax highlighting'
  },
  noReport: {
    type: 'boolean',
    description: 'Bypass linter'
  },
  noEmbedAssets: {
    type: 'boolean',
    description: "Don't embed assets"
  },
  noEmbedAssetUrl: {
    type: 'boolean',
    description: "Don't complete asset Url"
  },
  noCache: {
    type: 'boolean',
    description: 'No cache'
  },
  noTexSvg: {
    type: 'boolean',
    description: 'No Tex Svg'
  },
  noHexagons: {
    type: 'boolean',
    description: 'No cover hexagons'
  },
  spelling: {
    type: 'boolean',
    description: 'Check spelling'
  },
  pythonBin: {
    type: 'string',
    description: 'Custom path to python binary'
  },
  force: {
    type: 'boolean',
    description: 'Compile even with fatal errors'
  },
  verbose: {
    type: 'boolean',
    description: 'Show error stack'
  },
  envPlatform: {
    type: 'string',
    description: 'Specify which environment platform to display'
  },
  envProgram: {
    type: 'string',
    description: 'Specify which environment program to display'
  },
  envLanguage: {
    type: 'string',
    description: 'Specify which environment language to display'
  },
  fileName: {
    type: 'string',
    description: 'Specify name of output file'
  },
  output: {
    type: 'string',
    description: 'output to stdout',
    choices: ['md', 'html']
  }
};
const argv = (0,yargs__WEBPACK_IMPORTED_MODULE_2__["default"])((0,yargs_helpers__WEBPACK_IMPORTED_MODULE_3__.hideBin)(process.argv)).options(args).parseSync();
const dirPath = String(argv._[0] || '.');
const options = {
  week: argv.week,
  watch: argv.watch,
  noDoc: argv.noDoc,
  noHtml: argv.noHtml,
  noPdf: argv.noPdf,
  noSyntaxHighlight: argv.noSyntaxHighlight,
  noReport: argv.noReport,
  noEmbedAssets: argv.noEmbedAssets,
  noEmbedAssetUrl: argv.noEmbedAssetUrl,
  noCache: argv.noCache,
  noTexSvg: argv.noTexSvg,
  noHexagons: argv.noHexagons,
  spelling: argv.spelling,
  pythonBin: argv.pythonBin,
  force: argv.force,
  verbose: argv.verbose,
  envPlatform: argv.envPlatform,
  envProgram: argv.envProgram,
  envLanguage: argv.envLanguage,
  fileName: argv.fileName,
  output: argv.output
};
async function run() {
  try {
    const weeks = await (0,___WEBPACK_IMPORTED_MODULE_5__/* .rMarkdown */ .C)(dirPath, options);
    for (const week of weeks) {
      if (options.output === 'html') {
        console.log((week.html?.html || '').trim());
      }
      if (options.output === 'md') {
        console.log(week.md.trim());
      }
    }

    // correct exit code even when using --force
    for (const week of weeks) {
      if ((0,_linter_report__WEBPACK_IMPORTED_MODULE_4__/* .reportHasFatalErrors */ .wC)(week.files)) {
        process.exit(1);
      }
    }
  } catch (err) {
    console.log(chalk__WEBPACK_IMPORTED_MODULE_0__["default"].red(figures__WEBPACK_IMPORTED_MODULE_1__["default"].cross + ' ' + err.message));
    if (options.verbose) {
      console.error(err);
    }
    process.exit(1);
  }
  process.exit(0);
}
run();
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3021:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   f: () => (/* binding */ aliasDirectiveToCode)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

function aliasDirectiveToCode(ctx) {
  return tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, node => {
      if (node.type === 'leafDirective' && node.name === 'codeBlock') {
        const idx = getStoreIdx(node);
        if (ctx.codeStore === undefined) {
          return;
        }
        const stored = ctx.codeStore[idx];
        if (!stored) {
          return;
        }
        Object.assign(node, {
          type: 'code',
          name: undefined,
          lang: stored.lang,
          meta: stored.meta,
          value: stored.value,
          children: []
        });
      }
      if (node.type === 'textDirective' && node.name === 'codeBlock') {
        const idx = getStoreIdx(node);
        if (ctx.codeStore === undefined) {
          return;
        }
        const stored = ctx.codeStore[idx];
        if (!stored) {
          return;
        }
        Object.assign(node, {
          type: 'inlineCode',
          name: undefined,
          value: stored.value,
          children: []
        });
      }
    });
  };
}
function getStoreIdx(node) {
  const firstChild = node.children[0];
  return Number(firstChild.value || 0);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6217:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ codeToAliasDirective)
/* harmony export */ });
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2037);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_0__);


// The reason for replacing all fenced code blocks with aliases
// temporarily is because of MathJax.  MathJax is designed to look
// for TeX code inside HTML files, and in our case we need to make it
// look inside a Markdown file. This leads to MathJax looking for TeX
// inside code blocks, which can causes problems (especially with SAS
// code syntax).  So this function replaces code blocks with an alias,
// allows MathJax to do it's thing, then adds it back in with
// `aliasDirectiveToCode`.

async function codeToAliasDirective(file, ctx) {
  const store = [];
  file.value = codeBlocksToAlias(file.value, store);
  file.value = inlineCodeToAlias(file.value, store);
  ctx.codeStore = store;
  return file;
}
function codeBlocksToAlias(md, store) {
  const verbatimStore = [];
  return md.replace(/^(~~~.+?^~~~)$/gms, (_, match) => {
    verbatimStore.push(match);
    return `::verbatimStore[${verbatimStore.length - 1}]`;
  }).replace(/^```(.+?)^```$/gms, (_, match) => {
    const lines = match.split(os__WEBPACK_IMPORTED_MODULE_0__.EOL);
    const lang = lines[0];
    const value = lines.slice(1).join(os__WEBPACK_IMPORTED_MODULE_0__.EOL);
    store.push({
      lang,
      value
    });
    return `::codeBlock[${store.length - 1}]`;
  }).replace(/::verbatimStore\[(\d+)\]/g, (_, match) => {
    return verbatimStore[Number(match)];
  });
}
function inlineCodeToAlias(md, store) {
  return md.replace(/`([^\n`]+?)`/g, (_, value) => {
    store.push({
      value
    });
    return `:codeBlock[${store.length - 1}]`;
  });
}

/***/ }),

/***/ 7404:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   k: () => (/* binding */ createContext)
/* harmony export */ });
/* harmony import */ var _course__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(432);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1358);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_course__WEBPACK_IMPORTED_MODULE_0__, _utils_utils__WEBPACK_IMPORTED_MODULE_1__]);
([_course__WEBPACK_IMPORTED_MODULE_0__, _utils_utils__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


async function createContext(dirPath, options = {}) {
  return {
    course: await (0,_course__WEBPACK_IMPORTED_MODULE_0__/* .collectCoursework */ .F)(dirPath),
    dirPath,
    buildDir: (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__/* .getBuildDir */ .kc)(dirPath),
    cacheDir: (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__/* .getCacheDir */ .N5)(dirPath),
    options,
    refStore: {},
    figureCounter: 0
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 432:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ collectCoursework)
/* harmony export */ });
/* unused harmony export getUnitTitles */
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_kebabCase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3908);
/* harmony import */ var to_vfile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1252);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1358);
/* harmony import */ var _load_course__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4897);
/* harmony import */ var _load_unit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2705);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lodash_kebabCase_js__WEBPACK_IMPORTED_MODULE_1__, to_vfile__WEBPACK_IMPORTED_MODULE_2__, _utils_utils__WEBPACK_IMPORTED_MODULE_3__, _load_course__WEBPACK_IMPORTED_MODULE_4__, _load_unit__WEBPACK_IMPORTED_MODULE_5__]);
([lodash_kebabCase_js__WEBPACK_IMPORTED_MODULE_1__, to_vfile__WEBPACK_IMPORTED_MODULE_2__, _utils_utils__WEBPACK_IMPORTED_MODULE_3__, _load_course__WEBPACK_IMPORTED_MODULE_4__, _load_unit__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






async function collectCoursework(dirPath) {
  const course = await (0,_load_course__WEBPACK_IMPORTED_MODULE_4__/* .loadCourseYaml */ .n)(dirPath);
  const coursePath = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), dirPath);
  const units = await Promise.all(course.units.map(unit => collectUnit(unit, course, dirPath)));
  return {
    ...course,
    coursePath,
    units
  };
}
async function collectUnit(unit, course, dirPath) {
  const {
    content,
    ...yaml
  } = await (0,_load_unit__WEBPACK_IMPORTED_MODULE_5__/* .loadUnitYaml */ .o)(dirPath, unit.src);
  const unitPath = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), dirPath, unit.src);
  const files = await Promise.all(content.map(async c => {
    const filePath = path__WEBPACK_IMPORTED_MODULE_0___default().resolve(dirPath, unit.src, '..', c.src);
    if (!(await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__/* .checkLocalFileExists */ .qd)(filePath))) {
      throw new Error(`No Rmd file exists at ${filePath}`);
    }
    return (0,to_vfile__WEBPACK_IMPORTED_MODULE_2__.read)(filePath, 'utf-8');
  }));
  const titles = getUnitTitles({
    courseTitle: course.title,
    unitName: yaml.name,
    unitTitle: yaml.title
  });
  return {
    ...yaml,
    unitPath,
    parts: content,
    files,
    titles
  };
}
function getUnitTitles({
  courseTitle,
  unitName,
  unitTitle
}) {
  return {
    courseTitle,
    unitTitle: `${unitName}: ${unitTitle}`,
    unitName,
    docTitle: `${unitTitle} | ${courseTitle}`,
    fileName: (0,lodash_kebabCase_js__WEBPACK_IMPORTED_MODULE_1__["default"])(unitName)
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4897:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   n: () => (/* binding */ loadCourseYaml)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var js_yaml__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(626);
/* harmony import */ var yup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4962);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1358);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([js_yaml__WEBPACK_IMPORTED_MODULE_1__, yup__WEBPACK_IMPORTED_MODULE_2__, _utils_utils__WEBPACK_IMPORTED_MODULE_3__]);
([js_yaml__WEBPACK_IMPORTED_MODULE_1__, yup__WEBPACK_IMPORTED_MODULE_2__, _utils_utils__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);




// export const validCatalogValues = [
//   'STATS5077',
//   'STATS5078',
//   'STATS5075',
//   'STATS5084',
//   'STATS5074',
//   'STATS5081',
//   'STATS5080',
//   'STATS5073',
//   'STATS5076',
//   'STATS5079',
//   'STATS5082',
//   'STATS5094',
//   'STATS5083',
// ];

const courseSchema = yup__WEBPACK_IMPORTED_MODULE_2__.object().shape({
  title: yup__WEBPACK_IMPORTED_MODULE_2__.string().required(),
  units: yup__WEBPACK_IMPORTED_MODULE_2__.array().of(yup__WEBPACK_IMPORTED_MODULE_2__.object().shape({
    src: yup__WEBPACK_IMPORTED_MODULE_2__.string().required()
  })),
  catalog: yup__WEBPACK_IMPORTED_MODULE_2__.string(),
  authors: yup__WEBPACK_IMPORTED_MODULE_2__.string().required(),
  academic_year: yup__WEBPACK_IMPORTED_MODULE_2__.string().required()
});
async function loadCourseYaml(dirPath) {
  const courseYamlPath = path__WEBPACK_IMPORTED_MODULE_0___default().join(dirPath, 'course.yaml');
  if (!(await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__/* .checkLocalFileExists */ .qd)(courseYamlPath))) {
    throw Error(`No course.yaml file exists in ${path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), dirPath)}`);
  }
  const fileContents = await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__/* .readFile */ .pJ)(courseYamlPath);
  const course = js_yaml__WEBPACK_IMPORTED_MODULE_1__["default"].load(fileContents);
  return courseSchema.validateSync(course);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2705:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   o: () => (/* binding */ loadUnitYaml)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var js_yaml__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(626);
/* harmony import */ var yup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4962);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1358);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([js_yaml__WEBPACK_IMPORTED_MODULE_1__, yup__WEBPACK_IMPORTED_MODULE_2__, _utils_utils__WEBPACK_IMPORTED_MODULE_3__]);
([js_yaml__WEBPACK_IMPORTED_MODULE_1__, yup__WEBPACK_IMPORTED_MODULE_2__, _utils_utils__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);




const unitSchema = yup__WEBPACK_IMPORTED_MODULE_2__.object().shape({
  name: yup__WEBPACK_IMPORTED_MODULE_2__.string().required(),
  title: yup__WEBPACK_IMPORTED_MODULE_2__.string().required(),
  content: yup__WEBPACK_IMPORTED_MODULE_2__.array().of(yup__WEBPACK_IMPORTED_MODULE_2__.object().shape({
    src: yup__WEBPACK_IMPORTED_MODULE_2__.string().required()
  }))
});
async function loadUnitYaml(dirPath, src) {
  const contentsPath = path__WEBPACK_IMPORTED_MODULE_0___default().join(dirPath, src);
  if (!(await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__/* .checkLocalFileExists */ .qd)(contentsPath))) {
    throw Error(`No yaml file exists at ${path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), contentsPath)}`);
  }
  const fileContents = await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__/* .readFile */ .pJ)(contentsPath);
  const unit = js_yaml__WEBPACK_IMPORTED_MODULE_1__["default"].load(fileContents);
  return unitSchema.validateSync(unit);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4760:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   s: () => (/* binding */ hastPhase)
/* harmony export */ });
/* harmony import */ var rehype_raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1871);
/* harmony import */ var remark_rehype__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2509);
/* harmony import */ var unified__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4390);
/* harmony import */ var _inline_files__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1085);
/* harmony import */ var _responsive_tables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5947);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([rehype_raw__WEBPACK_IMPORTED_MODULE_0__, remark_rehype__WEBPACK_IMPORTED_MODULE_1__, unified__WEBPACK_IMPORTED_MODULE_2__, _inline_files__WEBPACK_IMPORTED_MODULE_3__, _responsive_tables__WEBPACK_IMPORTED_MODULE_4__]);
([rehype_raw__WEBPACK_IMPORTED_MODULE_0__, remark_rehype__WEBPACK_IMPORTED_MODULE_1__, unified__WEBPACK_IMPORTED_MODULE_2__, _inline_files__WEBPACK_IMPORTED_MODULE_3__, _responsive_tables__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





async function hastPhase(mdast, ctx, file, targetPdf) {
  const processor = (0,unified__WEBPACK_IMPORTED_MODULE_2__.unified)().use(remark_rehype__WEBPACK_IMPORTED_MODULE_1__["default"], {
    allowDangerousHtml: true
  }).use(rehype_raw__WEBPACK_IMPORTED_MODULE_0__["default"]).use(_responsive_tables__WEBPACK_IMPORTED_MODULE_4__/* .responsiveTables */ .l);
  if (!ctx.options.noEmbedAssets) {
    processor.use(_inline_files__WEBPACK_IMPORTED_MODULE_3__/* .inlineRelativeAssets */ .d, ctx);
  }
  return processor.run(mdast, file);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1085:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: () => (/* binding */ inlineRelativeAssets)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var base64_arraybuffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2845);
/* harmony import */ var image_size__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7632);
/* harmony import */ var mime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3586);
/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6544);
/* harmony import */ var to_vfile__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1252);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6016);
/* harmony import */ var _utils_cache_to_file__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5397);
/* harmony import */ var _utils_get_svg_hast__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(8093);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(343);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1358);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([base64_arraybuffer__WEBPACK_IMPORTED_MODULE_1__, image_size__WEBPACK_IMPORTED_MODULE_2__, mime__WEBPACK_IMPORTED_MODULE_3__, node_fetch__WEBPACK_IMPORTED_MODULE_4__, to_vfile__WEBPACK_IMPORTED_MODULE_5__, unist_util_visit__WEBPACK_IMPORTED_MODULE_6__, _utils_cache_to_file__WEBPACK_IMPORTED_MODULE_7__, _utils_get_svg_hast__WEBPACK_IMPORTED_MODULE_8__, _utils_utils__WEBPACK_IMPORTED_MODULE_10__]);
([base64_arraybuffer__WEBPACK_IMPORTED_MODULE_1__, image_size__WEBPACK_IMPORTED_MODULE_2__, mime__WEBPACK_IMPORTED_MODULE_3__, node_fetch__WEBPACK_IMPORTED_MODULE_4__, to_vfile__WEBPACK_IMPORTED_MODULE_5__, unist_util_visit__WEBPACK_IMPORTED_MODULE_6__, _utils_cache_to_file__WEBPACK_IMPORTED_MODULE_7__, _utils_get_svg_hast__WEBPACK_IMPORTED_MODULE_8__, _utils_utils__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






// import { optimize } from 'svgo';


// import { pdfToSvg } from '../pdf/pdf-to-svg';




function inlineRelativeAssets(ctx) {
  return async (tree, file) => {
    const transformations = [];
    const loadedScripts = [];
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_6__.visit)(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'img') {
        transformations.push(embedFile(node, file, ctx));
      }
      if (node.tagName === 'script' && node.properties?.src) {
        transformations.push(embedScript(node, index, parent, loadedScripts));
      }
    });
    await Promise.all(transformations);
  };
}
async function embedFile(node, file, ctx) {
  const src = getImageSrc(node);
  const parsed = path__WEBPACK_IMPORTED_MODULE_0___default().parse(src);
  try {
    switch (parsed.ext) {
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
        return await embedImage(node, ctx, file);
      case '.svg':
        return await embedSvg(node, ctx);
      case '.pdf':
        // return await embedPdfSvg(node);
        throw new Error(`Unhandled file extension: .pdf (convert to .svg)`);
      case '.html':
        return await embedHtml(node);
      default:
        throw new Error(`Unhandled file extension: ${parsed.ext}`);
    }
  } catch (_err) {
    console.log(_err);
    const err = _err;
    (0,_utils_message__WEBPACK_IMPORTED_MODULE_9__/* .failMessage */ .Ob)(file, err?.message || '', node.position);
  }
}
async function embedImage(node, ctx, file) {
  const src = getImageSrc(node);
  const mime = mime__WEBPACK_IMPORTED_MODULE_3__["default"].getType(path__WEBPACK_IMPORTED_MODULE_0___default().extname(src));
  try {
    const image = await getImage(src, ctx);
    const {
      width
    } = (0,image_size__WEBPACK_IMPORTED_MODULE_2__["default"])(Buffer.from(image, 'base64'));
    node.properties = {
      ...node.properties,
      src: `data:${mime};base64,${image}`,
      style: [`max-width: ${width}px`]
    };
  } catch (err) {
    console.log(err);
    (0,_utils_message__WEBPACK_IMPORTED_MODULE_9__/* .failMessage */ .Ob)(file, `Image not found: ${src}`);
  }
}
async function embedSvg(imgNode, ctx) {
  const src = getImageSrc(imgNode);
  const contents = await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_10__/* .readFile */ .pJ)(src);
  const idx = contents.indexOf('<svg');
  const svg = idx === -1 ? contents : contents.slice(idx);
  // const optimised = optimize(svg, { multipass: true }).data;
  // const svgNode = getAssetHast(svg) as Element;

  const svgNode = (0,_utils_get_svg_hast__WEBPACK_IMPORTED_MODULE_8__/* .getSvgHast */ .v)(svg);
  const svgProperties = svgNode.properties || {};

  // helps to ensure the svg is responsive
  delete svgProperties.width;
  delete svgProperties.height;
  const className = 'knitr-svg';
  const properties = {
    ...imgNode.properties,
    ...svgProperties,
    className: [className, ...getNodeClassNames(imgNode, className), ...getNodeClassNames(svgNode, className)]
  };
  delete properties.src;
  Object.assign(imgNode, svgNode, {
    properties
  });
}
function getNodeClassNames(node, removeClass) {
  const classes = node.properties?.className;
  if (typeof classes === 'string' && classes !== removeClass) {
    return [classes];
  }
  if (Array.isArray(classes)) {
    return classes.map(x => String(x)).filter(s => s !== removeClass);
  }
  return [];
}
function getImageSrc(node) {
  const properties = node.properties || {};
  if (!properties.src) {
    throw new Error('Image has no src');
  }
  return properties.src;
}
async function getImage(src, ctx) {
  if (src.startsWith('http')) {
    return (0,_utils_cache_to_file__WEBPACK_IMPORTED_MODULE_7__/* .cacheToFile */ .G)({
      ctx,
      prefix: 'youtube',
      key: src,
      execFn: getImageDataFromWeb
    });
  }
  return (0,_utils_utils__WEBPACK_IMPORTED_MODULE_10__/* .readFile */ .pJ)(src, 'base64');
}
async function getImageDataFromWeb(src) {
  const response = await (0,node_fetch__WEBPACK_IMPORTED_MODULE_4__["default"])(src);
  const buffer = await response.arrayBuffer();
  return (0,base64_arraybuffer__WEBPACK_IMPORTED_MODULE_1__.encode)(buffer);
}

// async function embedPdfSvg(imgNode: Element) {
//   const src = getImageSrc(imgNode);
//   const svgNode = (await pdfToSvg(src)) as Element;
//   console.log('hey!');
//   console.log(svgNode);

//   const properties = {
//     ...imgNode.properties,
//     ...svgNode.properties,
//   } as Properties;

//   delete properties.src;

//   Object.assign(imgNode, svgNode, { properties });
// }

async function embedHtml(imgNode) {
  const src = getImageSrc(imgNode);
  const value = await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_10__/* .readFile */ .pJ)(src);
  const vfile = (0,to_vfile__WEBPACK_IMPORTED_MODULE_5__.toVFile)({
    value
  });
  const parsed = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_10__/* .rehypeParser */ .G5)().parse(vfile);
  Object.assign(imgNode, {
    tagName: 'div',
    properties: {
      className: 'interactive-element'
    },
    children: parsed.children
  });
}
async function embedScript(node, index, parent, loadedScripts) {
  if (!node.properties?.src) {
    return;
  }
  const src = node.properties.src;
  if (loadedScripts.includes(src)) {
    // script already inlined, remove tag
    const parentChildren = parent?.children || [];
    parentChildren.splice(index || 0, 1);
    return;
  }
  loadedScripts.push(src);
  delete node.properties.src;
  const response = await (0,node_fetch__WEBPACK_IMPORTED_MODULE_4__["default"])(src);
  const value = await response.text();
  node.children = [{
    type: 'text',
    value: `// ${src}\n${value}\n`
  }];
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 5947:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ responsiveTables)
/* harmony export */ });
/* harmony import */ var lodash_cloneDeep_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8971);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lodash_cloneDeep_js__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__]);
([lodash_cloneDeep_js__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


function responsiveTables() {
  return function (tree) {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_1__.visit)(tree, 'element', (node, idx, _parent) => {
      if (node.tagName !== 'table') {
        return;
      }
      const parent = _parent;
      const properties = parent?.properties || {};
      const className = properties.className || [];
      if (!className.includes('table-wrapper')) {
        Object.assign(node, {
          tagName: 'div',
          properties: {
            className: 'table-wrapper'
          },
          children: [(0,lodash_cloneDeep_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)]
        });
      }
    });
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2930:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ htmlPhase)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_startCase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9659);
/* harmony import */ var rehype_document__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6271);
/* harmony import */ var rehype_format__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2920);
/* harmony import */ var rehype_stringify__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5390);
/* harmony import */ var unified__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4390);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1358);
/* harmony import */ var _pdf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1270);
/* harmony import */ var _wrapper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1591);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lodash_startCase_js__WEBPACK_IMPORTED_MODULE_1__, rehype_document__WEBPACK_IMPORTED_MODULE_2__, rehype_format__WEBPACK_IMPORTED_MODULE_3__, rehype_stringify__WEBPACK_IMPORTED_MODULE_4__, unified__WEBPACK_IMPORTED_MODULE_5__, _utils_utils__WEBPACK_IMPORTED_MODULE_6__, _pdf__WEBPACK_IMPORTED_MODULE_7__, _wrapper__WEBPACK_IMPORTED_MODULE_8__]);
([lodash_startCase_js__WEBPACK_IMPORTED_MODULE_1__, rehype_document__WEBPACK_IMPORTED_MODULE_2__, rehype_format__WEBPACK_IMPORTED_MODULE_3__, rehype_stringify__WEBPACK_IMPORTED_MODULE_4__, unified__WEBPACK_IMPORTED_MODULE_5__, _utils_utils__WEBPACK_IMPORTED_MODULE_6__, _pdf__WEBPACK_IMPORTED_MODULE_7__, _wrapper__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);









async function htmlPhase(hast, mdast, file, unit, ctx, targetPdf) {
  const processor = (0,unified__WEBPACK_IMPORTED_MODULE_5__.unified)().use(rehype_stringify__WEBPACK_IMPORTED_MODULE_4__["default"], {
    allowDangerousHtml: true
  });
  if (ctx.options.format) {
    // hangs in some scenarios so off by default, useful in tests
    processor.use(rehype_format__WEBPACK_IMPORTED_MODULE_3__["default"]);
  }
  if (!ctx.options.noDoc) {
    const cssPath = path__WEBPACK_IMPORTED_MODULE_0___default().join((0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__/* .getTemplateDir */ .Ur)(), 'template.css');
    const docOptions = {
      title: unit.titles.docTitle,
      style: `\n${await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__/* .readFile */ .pJ)(cssPath)}\n`
    };
    if (!targetPdf) {
      const jsPath = path__WEBPACK_IMPORTED_MODULE_0___default().join((0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__/* .getTemplateDir */ .Ur)(), 'template.js2');
      docOptions.script = `\n${await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__/* .readFile */ .pJ)(jsPath)}\n`;
      processor.use(_wrapper__WEBPACK_IMPORTED_MODULE_8__/* .htmlWrapper */ .B, unit, mdast, ctx);
    } else {
      processor.use(_pdf__WEBPACK_IMPORTED_MODULE_7__/* .pdfWrapper */ .g, unit, ctx);
    }
    processor.use(rehype_document__WEBPACK_IMPORTED_MODULE_2__["default"], docOptions);
  }
  const transformed = await processor.run(hast, file);
  const result = processor.stringify(transformed, file);
  return postTransforms(result, ctx);
}
function postTransforms(html, ctx) {
  let result = '';
  result = referenceTransform(html, ctx.refStore);
  return result;
}
function referenceTransform(html, refStore) {
  return html.replace(/ref:\/\/(\w+)/gms, (...match) => {
    const key = match[1];
    const link = refStore[key];
    const name = (0,lodash_startCase_js__WEBPACK_IMPORTED_MODULE_1__["default"])(link);
    return `<a href="#${link}">${name}</a>`;
  });
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1270:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g: () => (/* binding */ pdfWrapper)
/* harmony export */ });
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1879);
/* harmony import */ var _wrapper_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2258);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_icons__WEBPACK_IMPORTED_MODULE_0__, _wrapper_main__WEBPACK_IMPORTED_MODULE_1__]);
([_utils_icons__WEBPACK_IMPORTED_MODULE_0__, _wrapper_main__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// import { UnitTitles } from '../course/types';


function pdfWrapper(unit, ctx) {
  return async tree => {
    const main = await (0,_wrapper_main__WEBPACK_IMPORTED_MODULE_1__/* .createMain */ .C)(unit.titles, ctx, tree.children);
    const iconDefs = (0,_utils_icons__WEBPACK_IMPORTED_MODULE_0__/* .createDefs */ .B)();
    return {
      type: 'root',
      children: [{
        type: 'element',
        tagName: 'div',
        properties: {
          id: 'root',
          className: ['hide-sidebar', 'font-default', 'pdf']
        },
        children: [iconDefs, main]
      }]
    };
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1591:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ htmlWrapper)
/* harmony export */ });
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1879);
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2258);
/* harmony import */ var _sidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3335);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_icons__WEBPACK_IMPORTED_MODULE_0__, _main__WEBPACK_IMPORTED_MODULE_1__, _sidebar__WEBPACK_IMPORTED_MODULE_2__]);
([_utils_icons__WEBPACK_IMPORTED_MODULE_0__, _main__WEBPACK_IMPORTED_MODULE_1__, _sidebar__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



function htmlWrapper(unit, mdast, ctx) {
  return async tree => {
    const hamburgerIcon = (0,_utils_icons__WEBPACK_IMPORTED_MODULE_0__/* .createSvg */ .W)('hamburger-icon');
    const sidebar = await (0,_sidebar__WEBPACK_IMPORTED_MODULE_2__/* .createSidebar */ .x)(mdast);
    const main = await (0,_main__WEBPACK_IMPORTED_MODULE_1__/* .createMain */ .C)(unit.titles, ctx, tree.children);
    const iconDefs = (0,_utils_icons__WEBPACK_IMPORTED_MODULE_0__/* .createDefs */ .B)();
    return {
      type: 'root',
      children: [{
        type: 'element',
        tagName: 'div',
        properties: {
          id: 'root',
          className: ['hide-sidebar']
        },
        children: [iconDefs, main, hamburgerIcon, sidebar]
      }]
    };
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2258:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ createMain)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
/* harmony import */ var _assets_dag_logo_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7407);
/* harmony import */ var _assets_hexagons_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(934);
/* harmony import */ var _utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3609);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__, _utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_1__]);
([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__, _utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);




async function createMain(titles, ctx, content) {
  const children = [];
  if (ctx.options.noHexagons) {
    children.push(createH1(titles));
  } else {
    children.push(createCover(titles, ctx.course));
  }
  children.push(...content);
  return {
    type: 'element',
    tagName: 'main',
    children: [{
      type: 'element',
      tagName: 'div',
      properties: {
        className: 'wrapper'
      },
      children
    }]
  };
}
function createCover(titles, course) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'cover'
    },
    children: [createH1(titles), {
      type: 'element',
      tagName: 'div',
      properties: {
        className: 'logos'
      },
      children: [createCoverHexagons(course.catalog || ''), (0,_utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_1__/* .getAssetHast */ .j)(_assets_dag_logo_svg__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)]
    }]
  };
}
function createH1(titles) {
  return {
    type: 'element',
    tagName: 'h1',
    children: [{
      type: 'text',
      value: titles.courseTitle
    }, {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'unit'
      },
      children: [{
        type: 'text',
        value: titles.unitTitle
      }]
    }]
  };
}
function createCoverHexagons(catalog) {
  const hexagons = (0,_utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_1__/* .getAssetHast */ .j)(_assets_hexagons_svg__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z);
  if (catalog !== '') {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(hexagons, 'element', node => {
      if (node.tagName === 'g') {
        const properties = node.properties || {};
        const [className] = properties.className || [];
        if (catalog === className) {
          properties.className = ['active'];
        } else {
          properties.className = [];
        }
        node.properties = properties;
      }
    });
  }
  return hexagons;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3335:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   x: () => (/* binding */ createSidebar)
/* harmony export */ });
/* harmony import */ var mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1037);
/* harmony import */ var mdast_util_toc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6864);
/* harmony import */ var _assets_crest_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9114);
/* harmony import */ var _assets_uofg_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8328);
/* harmony import */ var _utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3609);
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1879);
/* harmony import */ var _view_options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8263);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__, mdast_util_toc__WEBPACK_IMPORTED_MODULE_1__, _utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_2__, _utils_icons__WEBPACK_IMPORTED_MODULE_3__]);
([mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__, mdast_util_toc__WEBPACK_IMPORTED_MODULE_1__, _utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_2__, _utils_icons__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







async function createSidebar(mdast) {
  const logo = await createLogo();
  const toc = (0,mdast_util_toc__WEBPACK_IMPORTED_MODULE_1__.toc)(mdast, {
    maxDepth: 3
  }).map;
  const tocChildren = toc === undefined ? [] : [(0,mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__.toHast)(toc)];
  printTableOfContents(toc);
  return {
    type: 'element',
    tagName: 'aside',
    children: [logo, (0,_view_options__WEBPACK_IMPORTED_MODULE_4__/* .createViewOptionsButton */ .t)(), {
      type: 'element',
      tagName: 'nav',
      properties: {
        id: 'toc'
      },
      children: tocChildren
    }, {
      type: 'element',
      tagName: 'div',
      properties: {
        id: 'view-options'
      },
      children: (0,_view_options__WEBPACK_IMPORTED_MODULE_4__/* .createViewOptions */ .g)()
    }]
  };
}
async function createLogo() {
  const crest = (0,_utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_2__/* .getAssetHast */ .j)(_assets_crest_svg__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z);
  const uofg = (0,_utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_2__/* .getAssetHast */ .j)(_assets_uofg_svg__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z);
  const hamburgerIcon = (0,_utils_icons__WEBPACK_IMPORTED_MODULE_3__/* .createSvg */ .W)('hamburger-icon');
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'logo'
    },
    children: [{
      type: 'element',
      tagName: 'div',
      properties: {
        className: 'logo-wrapper'
      },
      children: [crest, uofg]
    }, hamburgerIcon]
  };
}
function printTableOfContents(toc) {
  // toc?.children.forEach((a) => {
  //   a.children.forEach((b) => {
  //     if (b.type === 'paragraph') {
  //       // @ts-ignore
  //       console.log(`- [ ] ${b.children[0].children[0].value}`);
  //     }
  //     if (b.type === 'list') {
  //       b.children.forEach((c) => {
  //         c.children.forEach((d) => {
  //           if (d.type === 'paragraph') {
  //             // @ts-ignore
  //             console.log(`  - [ ] ${d.children[0].children[0].value}`);
  //           }
  //         });
  //       });
  //     }
  //   });
  // });
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8263:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  g: () => (/* binding */ createViewOptions),
  t: () => (/* binding */ createViewOptionsButton)
});

;// CONCATENATED MODULE: ./src/html/wrapper/view-options/readability.ts
const options = [{
  value: 'fontSize',
  label: 'Font-size',
  min: 0.6,
  max: 2,
  increment: 0.1
}, {
  value: 'lineSpacing',
  label: 'Line spacing',
  min: 0.6,
  max: 2,
  increment: 0.1
}, {
  value: 'letterSpacing',
  label: 'Letter spacing',
  min: -0.1,
  max: 0.2,
  increment: 0.05
}, {
  value: 'lineWidth',
  label: 'Line width',
  min: 0.6,
  max: 1.2,
  increment: 0.05
}];
function createReadabilityList() {
  return {
    type: 'element',
    tagName: 'ul',
    properties: {
      id: 'readability'
    },
    children: options.map(createOption)
  };
}
function createOption(item) {
  return {
    type: 'element',
    tagName: 'li',
    properties: {
      className: [item.value],
      'data-min': item.min,
      'data-max': item.max,
      'data-increment': item.increment
    },
    children: [{
      type: 'element',
      tagName: 'span',
      properties: {
        className: ['label']
      },
      children: [{
        type: 'text',
        value: item.label
      }]
    }, {
      type: 'element',
      tagName: 'span',
      properties: {
        className: ['actions']
      },
      children: [{
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['btn', 'minus']
        },
        children: [{
          type: 'text',
          value: '−'
        }]
      }, {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['btn', 'plus']
        },
        children: [{
          type: 'text',
          value: '+'
        }]
      }, {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['btn', 'reset']
        },
        children: [{
          type: 'text',
          value: 'Reset'
        }]
      }]
    }]
  };
}
;// CONCATENATED MODULE: ./src/html/wrapper/view-options/theme.ts
const themes = [{
  value: 'light',
  label: 'Light'
}, {
  value: 'dark',
  label: 'Dark'
}, {
  value: 'yellow-on-black',
  label: 'Yellow on Black'
}, {
  value: 'black-on-yellow',
  label: 'Black on Yellow'
}, {
  value: 'black-on-red',
  label: 'Black on Red'
}, {
  value: 'black-on-blue',
  label: 'Black on Blue'
}];
function createThemeList() {
  return {
    type: 'element',
    tagName: 'ul',
    properties: {
      id: 'themes'
    },
    children: themes.map(createThemeButton)
  };
}
function createThemeButton(theme) {
  return {
    type: 'element',
    tagName: 'li',
    properties: {
      className: [theme.value]
    },
    children: [{
      type: 'text',
      value: theme.label
    }]
  };
}
;// CONCATENATED MODULE: ./src/html/wrapper/view-options/index.ts
// import { createFontList } from './font';


function createViewOptionsButton() {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      id: 'view-options-toggle'
    },
    children: [{
      type: 'text',
      value: 'View options'
    }]
  };
}
function createViewOptions() {
  return [createTitle('Theme'), createThemeList(),
  // createTitle('Font'),
  // createFontList(),
  createTitle('Readability'), createReadabilityList()];
}
function createTitle(value) {
  return {
    type: 'element',
    tagName: 'h3',
    children: [{
      type: 'text',
      value
    }]
  };
}

/***/ }),

/***/ 9474:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ rMarkdown)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7564);
/* harmony import */ var _build_unit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1342);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7404);
/* harmony import */ var _utils_check_for_latest_version__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2192);
/* harmony import */ var _utils_timer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1642);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1358);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([chalk__WEBPACK_IMPORTED_MODULE_1__, _build_unit__WEBPACK_IMPORTED_MODULE_2__, _context__WEBPACK_IMPORTED_MODULE_3__, _utils_check_for_latest_version__WEBPACK_IMPORTED_MODULE_4__, _utils_utils__WEBPACK_IMPORTED_MODULE_5__]);
([chalk__WEBPACK_IMPORTED_MODULE_1__, _build_unit__WEBPACK_IMPORTED_MODULE_2__, _context__WEBPACK_IMPORTED_MODULE_3__, _utils_check_for_latest_version__WEBPACK_IMPORTED_MODULE_4__, _utils_utils__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







async function rMarkdown(dirPath, options = {}) {
  if (!options.output) {
    await (0,_utils_check_for_latest_version__WEBPACK_IMPORTED_MODULE_4__/* .checkForLatestVersion */ .m)();
  }
  const timer = (0,_utils_timer__WEBPACK_IMPORTED_MODULE_6__/* .createTimer */ .e)();
  const ctx = await (0,_context__WEBPACK_IMPORTED_MODULE_3__/* .createContext */ .k)(dirPath, options);
  const result = [];
  if (ctx.options.week) {
    // write single week
    const idx = ctx.options.week - 1;
    const input = ctx.course.units[idx];
    if (input === undefined) {
      const courseYaml = path__WEBPACK_IMPORTED_MODULE_0___default().join(ctx.dirPath, 'course.yaml');
      throw new Error(`Week ${ctx.options.week} not found in ${courseYaml}`);
    }
    const built = await (0,_build_unit__WEBPACK_IMPORTED_MODULE_2__/* .buildUnit */ ._)(input, ctx);
    await writeUnit(built, ctx, timer);
    result.push(built);
  } else {
    // write full course
    for (const input of ctx.course.units) {
      const built = await (0,_build_unit__WEBPACK_IMPORTED_MODULE_2__/* .buildUnit */ ._)(input, ctx);
      await writeUnit(built, ctx, timer);
      result.push(built);
    }
  }
  return result;
}
async function writeUnit(built, ctx, timer) {
  if (ctx.options.noWrite) {
    return;
  }
  await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_5__/* .mkdir */ .i$)(ctx.buildDir);
  const fileName = ctx.options.fileName ? ctx.options.fileName : built.unit.titles.fileName;
  const filePath = path__WEBPACK_IMPORTED_MODULE_0___default().join(ctx.buildDir, fileName);
  if (built.html) {
    await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_5__/* .writeFile */ .NC)(filePath + '.html', built.html.html);
    if (!ctx.options.output) {
      const status = chalk__WEBPACK_IMPORTED_MODULE_1__["default"].green.bold(`Complete in ${timer.seconds()}s`);
      console.log(`✨ ${status} ${filePath}.html`);
    }
  }
  if (built.pdf) {
    await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_5__/* .writeFile */ .NC)(filePath + '.pdf', built.pdf.pdf);

    // debug
    // await writeFile(filePath + '.pdf.html', built.pdf.html);

    if (!ctx.options.output) {
      const status = chalk__WEBPACK_IMPORTED_MODULE_1__["default"].green.bold(`Complete in ${timer.seconds()}s`);
      console.log(`✨ ${status} ${filePath}.pdf`);
    }
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3432:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ knitr)
/* harmony export */ });
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2081);
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2037);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7310);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7564);
/* harmony import */ var hash_sum__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2386);
/* harmony import */ var vfile__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6107);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(343);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1358);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([chalk__WEBPACK_IMPORTED_MODULE_4__, hash_sum__WEBPACK_IMPORTED_MODULE_5__, vfile__WEBPACK_IMPORTED_MODULE_6__, _utils_utils__WEBPACK_IMPORTED_MODULE_8__]);
([chalk__WEBPACK_IMPORTED_MODULE_4__, hash_sum__WEBPACK_IMPORTED_MODULE_5__, vfile__WEBPACK_IMPORTED_MODULE_6__, _utils_utils__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);










// bypass knitr for debugging
// export async function knitr(unit: Unit, ctx: Context) {
//   const file = new VFile();
//   file.value = unit.files.reduce((acc, o) => {
//     return acc + EOL + EOL + o.value;
//   }, '');
//   return file;
// }

async function knitr(unit, ctx) {
  const parentFile = await createParentFile(unit, ctx);
  // console.log(parentFile.value);

  const result = await execKnitr(parentFile, ctx, unit.unitPath);
  // console.log(result);
  parentFile.value = result;
  return parentFile;
}

// creating a temporary file which includes all child files allows
// R/Python state to be shared across multiple .Rmd files
// https://yihui.org/knitr/options/#child-documents
async function createParentFile(unit, ctx) {
  const file = new vfile__WEBPACK_IMPORTED_MODULE_6__.VFile();
  let value = '';

  // pass path to custom python binary to reticulate
  // https://rstudio.github.io/reticulate/articles/r_markdown.html
  if (ctx.options.pythonBin) {
    const reticulate = `reticulate::use_python("${ctx.options.pythonBin}")`;
    value += `\`\`\`{r, echo=FALSE}${os__WEBPACK_IMPORTED_MODULE_1__.EOL}${reticulate}${os__WEBPACK_IMPORTED_MODULE_1__.EOL}\`\`\`${os__WEBPACK_IMPORTED_MODULE_1__.EOL}${os__WEBPACK_IMPORTED_MODULE_1__.EOL}`;
  }
  value += unit.files.reduce((acc, o) => {
    const [filePath] = o.history;

    // directory directive is used to ensure external assets
    // can have relative paths to the .Rmd document.
    // used in embed-asset-url mdast transform
    const fileDir = path__WEBPACK_IMPORTED_MODULE_2___default().parse(filePath).dir;
    const directive = `::directory[${fileDir}]`;

    // child document
    // convert all file paths to forward slash (windows anaconda/knitr bug)
    const formattedPath = path__WEBPACK_IMPORTED_MODULE_2___default().relative(ctx.cacheDir, filePath).replace(/\\/g, '/');
    const childCodeBlock = `\`\`\`{r, child='${formattedPath}'}${os__WEBPACK_IMPORTED_MODULE_1__.EOL}\`\`\``;
    return acc + directive + os__WEBPACK_IMPORTED_MODULE_1__.EOL + os__WEBPACK_IMPORTED_MODULE_1__.EOL + childCodeBlock + os__WEBPACK_IMPORTED_MODULE_1__.EOL + os__WEBPACK_IMPORTED_MODULE_1__.EOL;
  }, '');

  // console.log(value);

  file.value = value;
  return file;
}
async function execKnitr(file, ctx, unitPath) {
  const md = file.value;
  const uniqueId = getUniqueId(md);
  const cachedFile = path__WEBPACK_IMPORTED_MODULE_2___default().join(ctx.cacheDir, `${uniqueId}.Rmd`);
  const cacheDir = path__WEBPACK_IMPORTED_MODULE_2___default().join(ctx.cacheDir, uniqueId);
  await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_8__/* .mkdir */ .i$)(cacheDir);
  await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_8__/* .writeFile */ .NC)(cachedFile, md);
  return new Promise((resolve, reject) => {
    const cmd = createKnitrCommand(ctx, uniqueId, unitPath);
    (0,child_process__WEBPACK_IMPORTED_MODULE_0__.exec)(cmd, async (err, response, stdErr) => {
      if (stdErr) {
        if (!ctx.options.output) {
          console.log(chalk__WEBPACK_IMPORTED_MODULE_4__["default"].grey(`[knitr] ${stdErr.trim()}`));
        }
        if (isFailingStdErr(stdErr)) {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_7__/* .failMessage */ .Ob)(file, stdErr);
        }
      }
      if (err) {
        console.error('ERROR', err);
        reject(err);
      } else {
        reportErrors(response, file, ctx);
        resolve(formatResponse(response));
      }
      await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_8__/* .rmFile */ .gr)(cachedFile);
    });
  });
}
function getUniqueId(md) {
  const hash = (0,hash_sum__WEBPACK_IMPORTED_MODULE_5__["default"])(md);
  const ts = new Date().getTime().toString();
  return `knitr-${hash}-${ts}`;
}
function createKnitrCommand(ctx, uniqueId, unitPath) {
  const rFileDir = getKnitrFileDir();
  const rFile = path__WEBPACK_IMPORTED_MODULE_2___default().join(rFileDir, 'knitr.R');
  const baseDir = path__WEBPACK_IMPORTED_MODULE_2___default().parse(unitPath).dir;
  const cachedFile = path__WEBPACK_IMPORTED_MODULE_2___default().join(ctx.cacheDir, `${uniqueId}.Rmd`);
  const cacheDir = path__WEBPACK_IMPORTED_MODULE_2___default().join(ctx.cacheDir, uniqueId);

  // spawn args
  // return [rFile, cachedFile, baseDir, cacheDir];

  return `Rscript "${rFile}" "${cachedFile}" "${baseDir}" "${cacheDir}"`;
}
function getKnitrFileDir() {
  // temporary hack until this PR is merged
  // https://github.com/webpack/webpack/pull/15246
  if (true) {
    return __dirname;
  }
  return path__WEBPACK_IMPORTED_MODULE_2___default().dirname((0,url__WEBPACK_IMPORTED_MODULE_3__.fileURLToPath)("file:///Users/staff/Work/build-coursework/compiler/src/knitr/knitr.ts"));
}
function isFailingStdErr(stdErr) {
  // console.log({ stdErr });
  return /status 1\d*$/.test(stdErr.trim());
}
function reportErrors(response, file, ctx) {
  const lines = response.split(os__WEBPACK_IMPORTED_MODULE_1__.EOL).filter(s => !s.startsWith(':directory'));
  const trimmed = lines.join(os__WEBPACK_IMPORTED_MODULE_1__.EOL).trim();

  // Warning at the start of a document
  if (trimmed.startsWith('WARNING -')) {
    const match = trimmed.match(/^WARNING - (.+?)[\r\n]{2,}/ms);

    // Check the original file doesn't start with WARNING
    const original = String(ctx.course.units[0].files[0].value).split(os__WEBPACK_IMPORTED_MODULE_1__.EOL).filter(s => !s.startsWith(':directory')).join(os__WEBPACK_IMPORTED_MODULE_1__.EOL).trim();
    if (match !== null && !original.startsWith('WARNING -')) {
      (0,_utils_message__WEBPACK_IMPORTED_MODULE_7__/* .warnMessage */ .KU)(file, match[1], {
        start: {
          line: 1,
          column: 0
        },
        end: {
          line: 1,
          column: lines[0].length
        }
      });
    }

    // Python binary path
  } else if (trimmed.startsWith('$python [1]')) {
    const match = trimmed.match(/^\$python\s\[1\]\s("\S+")/);
    if (match !== null) {
      (0,_utils_message__WEBPACK_IMPORTED_MODULE_7__/* .infoMessage */ .ei)(file, match[1], {
        start: {
          line: 1,
          column: 0
        },
        end: {
          line: 1,
          column: lines[0].length
        }
      });
    }
  }

  // Errors throughout document
  lines.forEach((line, idx) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('## Error')) {
      (0,_utils_message__WEBPACK_IMPORTED_MODULE_7__/* .warnMessage */ .KU)(file, trimmedLine.replace('## ', ''), {
        start: {
          line: idx + 1,
          column: 0
        },
        end: {
          line: idx + 1,
          column: line.length
        }
      });
    }
  });
}
async function formatResponse(response) {
  let md = response;
  md = removeCustomPythonBinNotice(md);
  md = removePythonWarningMessage(md);
  md = addErrorCodeBlock(md);
  md = removeHashSigns(md);
  md = removeEmptyLog(md);
  md = addNewLineAfterKable(md);
  return md;
}
function removeCustomPythonBinNotice(md) {
  return md.replace(/^\$python\s\[1\]\s"\S+"/, '');
}
function removePythonWarningMessage(md) {
  return md.replace(/^WARNING - .+?[\r\n]+/m, '');
}
function removeHashSigns(md) {
  let insideCodeResponse = false;
  let openingLine = '';
  return md.split('\n').reduce((acc, line) => {
    if (line.startsWith('```')) {
      insideCodeResponse = !insideCodeResponse;
      openingLine = insideCodeResponse ? line : '';
    }
    if (insideCodeResponse && openingLine.endsWith('-output}')) {
      acc.push(line.replace(/^##\s+/, ''));
    } else {
      acc.push(line);
    }
    return acc;
  }, []).join('\n');
}
function removeEmptyLog(md) {
  return md.replace(/\[1\]\s""$/gm, '').trim();
}
function addErrorCodeBlock(md) {
  return md.split('\n').reduce((acc, line, idx) => {
    if (idx > 0 && acc[idx - 1].startsWith('```')) {
      if (line.startsWith('## Error') || line.startsWith('## fatal')) {
        acc[acc.length - 1] = `\`\`\`{.error-output}`;
      }
    }
    acc.push(line);
    return acc;
  }, []).join('\n');
}
function addNewLineAfterKable(md) {
  return md.split('\n').reduce((acc, line, idx) => {
    if (acc[idx - 1]?.startsWith('|') && !line.startsWith('|')) {
      acc.push('', line);
    } else {
      acc.push(line);
    }
    return acc;
  }, []).join('\n');
}

// experimental streaming output
// async function spawnKnitr(file: VFile, ctx: Context, unitPath: string) {
//   const md = file.value as string;
//   const uniqueId = getUniqueId(md);
//   const cachedFile = path.join(ctx.cacheDir, `${uniqueId}.Rmd`);
//   const cacheDir = path.join(ctx.cacheDir, uniqueId);
//   await mkdir(cacheDir);
//   await writeFile(cachedFile, md);

//   return new Promise<string>((resolve, reject) => {
//     const args = createKnitrCommand(ctx, uniqueId, unitPath);
//     const knitr = spawn('Rscript', args);
//     const result: string[] = [];

//     knitr.stdout.on('data', (data) => {
//       const str = data.toString();
//       console.log(str);
//       result.push(str);
//     });

//     knitr.stdout.on('end', () => {
//       console.log('STDOUT END');
//       const end = result.join('');
//       console.log('END', end);
//       reportErrors(end, file);
//       resolve(formatResponse(end));
//     });

//     knitr.stdout.on('error', (err) => {
//       console.log('STDOUT ERROR', err, err.toString());
//       reject();
//     });

//     knitr.stderr.on('data', (data) => {
//       const str = data.toString();
//       console.log('STDERR ERROR', str);
//     });
//   }).then(async (result) => {
//     await rmFile(cachedFile);
//     return result;
//   });
// }
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4686:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ aliasDirectiveToLatexSvg)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1358);
/* harmony import */ var _mathjax_tex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(689);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__, _utils_utils__WEBPACK_IMPORTED_MODULE_1__, _mathjax_tex__WEBPACK_IMPORTED_MODULE_2__]);
([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__, _utils_utils__WEBPACK_IMPORTED_MODULE_1__, _mathjax_tex__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



function aliasDirectiveToLatexSvg(ctx) {
  return tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'textDirective', node => {
      if (!ctx.mmlStore || ctx.options.noTexSvg) {
        return;
      }
      switch (node.name) {
        case 'inlineMath':
        case 'blockMath':
          {
            const idx = getTexIdx(node);
            const mml = ctx.mmlStore[idx];
            const svg = renderSvg(mml);
            const properties = {
              ...svg.properties,
              className: node.name === 'inlineMath' ? 'inline-math' : 'block-math',
              id: getRefId(mml)
            };
            node.data = {
              hName: svg.tagName,
              hProperties: properties,
              hChildren: svg.children
            };
          }
      }
    });
  };
}
function getTexIdx(node) {
  const firstChild = node.children[0];
  return Number(firstChild.value || 0);
}
function getRefId(mml) {
  const match = mml.match(/<mtd.+?id="(.*?)"/);
  if (match === null) {
    return undefined;
  }
  return match[1];
}
function renderSvg(mml) {
  const label = (0,_mathjax_tex__WEBPACK_IMPORTED_MODULE_2__/* .mmlToSpeech */ .yN)(mml);
  const svg = (0,_mathjax_tex__WEBPACK_IMPORTED_MODULE_2__/* .mmlToSvg */ .g3)(mml);
  return createAccessibleSvg(svg, label);
}
function createAccessibleSvg(mathjaxSvg, label = '') {
  const tree = _utils_utils__WEBPACK_IMPORTED_MODULE_1__/* .rehypeParser */ .G5.parse(mathjaxSvg);
  // @ts-expect-error
  const parent = tree.children[0];
  const svg = parent.children[0];
  const properties = svg.properties;
  const newProperties = {
    width: properties.width,
    height: properties.height,
    viewBox: properties.viewBox,
    role: 'img'
  };
  if (label !== '') {
    const uniqueId = `math-${Math.random().toString(16).slice(2)}`;
    newProperties['aria-labelledby'] = uniqueId;
    svg.children.unshift({
      type: 'element',
      tagName: 'title',
      properties: {
        id: uniqueId
      },
      children: [{
        type: 'text',
        value: label
      }]
    });
  }
  svg.properties = newProperties;
  return svg;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 689:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g3: () => (/* binding */ mmlToSvg),
/* harmony export */   yN: () => (/* binding */ mmlToSpeech)
/* harmony export */ });
/* unused harmony export texToMml */
/* harmony import */ var mathjax_full_js_adaptors_liteAdaptor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2424);
/* harmony import */ var mathjax_full_js_core_MathItem_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4076);
/* harmony import */ var mathjax_full_js_core_MmlTree_SerializedMmlVisitor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4559);
/* harmony import */ var mathjax_full_js_handlers_html_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5395);
/* harmony import */ var mathjax_full_js_handlers_html_HTMLDocument_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4124);
/* harmony import */ var mathjax_full_js_input_mathml_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1210);
/* harmony import */ var mathjax_full_js_input_tex_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7771);
/* harmony import */ var mathjax_full_js_input_tex_AllPackages_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2547);
/* harmony import */ var mathjax_full_js_mathjax_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2338);
/* harmony import */ var mathjax_full_js_output_svg_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(1192);
/* harmony import */ var speech_rule_engine__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1150);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([mathjax_full_js_adaptors_liteAdaptor_js__WEBPACK_IMPORTED_MODULE_0__, mathjax_full_js_core_MathItem_js__WEBPACK_IMPORTED_MODULE_1__, mathjax_full_js_core_MmlTree_SerializedMmlVisitor_js__WEBPACK_IMPORTED_MODULE_2__, mathjax_full_js_handlers_html_js__WEBPACK_IMPORTED_MODULE_3__, mathjax_full_js_handlers_html_HTMLDocument_js__WEBPACK_IMPORTED_MODULE_4__, mathjax_full_js_input_mathml_js__WEBPACK_IMPORTED_MODULE_5__, mathjax_full_js_input_tex_js__WEBPACK_IMPORTED_MODULE_6__, mathjax_full_js_input_tex_AllPackages_js__WEBPACK_IMPORTED_MODULE_7__, mathjax_full_js_mathjax_js__WEBPACK_IMPORTED_MODULE_8__, mathjax_full_js_output_svg_js__WEBPACK_IMPORTED_MODULE_9__, speech_rule_engine__WEBPACK_IMPORTED_MODULE_10__]);
([mathjax_full_js_adaptors_liteAdaptor_js__WEBPACK_IMPORTED_MODULE_0__, mathjax_full_js_core_MathItem_js__WEBPACK_IMPORTED_MODULE_1__, mathjax_full_js_core_MmlTree_SerializedMmlVisitor_js__WEBPACK_IMPORTED_MODULE_2__, mathjax_full_js_handlers_html_js__WEBPACK_IMPORTED_MODULE_3__, mathjax_full_js_handlers_html_HTMLDocument_js__WEBPACK_IMPORTED_MODULE_4__, mathjax_full_js_input_mathml_js__WEBPACK_IMPORTED_MODULE_5__, mathjax_full_js_input_tex_js__WEBPACK_IMPORTED_MODULE_6__, mathjax_full_js_input_tex_AllPackages_js__WEBPACK_IMPORTED_MODULE_7__, mathjax_full_js_mathjax_js__WEBPACK_IMPORTED_MODULE_8__, mathjax_full_js_output_svg_js__WEBPACK_IMPORTED_MODULE_9__, speech_rule_engine__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);










// @ts-expect-error

function texToMml(tex = '') {
  const adaptor = liteAdaptor();
  //  Busproofs requires an output jax, which we aren't using
  const packages = AllPackages.filter(name => name !== 'bussproofs');
  const input = new TeX({
    packages
  });
  const doc = new HTMLDocument('', adaptor, {
    InputJax: input
  });
  const node = doc.convert(tex, {
    end: STATE.CONVERT
  });
  const visitor = new SerializedMmlVisitor();
  return visitor.visitTree(node);
}
function mmlToSvg(mml) {
  const adaptor = (0,mathjax_full_js_adaptors_liteAdaptor_js__WEBPACK_IMPORTED_MODULE_0__.liteAdaptor)();
  (0,mathjax_full_js_handlers_html_js__WEBPACK_IMPORTED_MODULE_3__.RegisterHTMLHandler)(adaptor);
  const input = new mathjax_full_js_input_mathml_js__WEBPACK_IMPORTED_MODULE_5__.MathML();
  const output = new mathjax_full_js_output_svg_js__WEBPACK_IMPORTED_MODULE_9__.SVG({
    fontCache: 'local'
  });
  const doc = mathjax_full_js_mathjax_js__WEBPACK_IMPORTED_MODULE_8__.mathjax.document('', {
    InputJax: input,
    OutputJax: output
  });
  const node = doc.convert(mml, {
    em: 25
  });
  return adaptor.outerHTML(node);
}
function mmlToSpeech(mml) {
  return speech_rule_engine__WEBPACK_IMPORTED_MODULE_10__["default"].toSpeech(mml);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7633:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ texToAliasDirective)
/* harmony export */ });
/* harmony import */ var mathjax_full_js_adaptors_liteAdaptor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2424);
/* harmony import */ var mathjax_full_js_core_MathItem_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4076);
/* harmony import */ var mathjax_full_js_core_MmlTree_SerializedMmlVisitor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4559);
/* harmony import */ var mathjax_full_js_handlers_html_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5395);
/* harmony import */ var mathjax_full_js_input_tex_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7771);
/* harmony import */ var mathjax_full_js_input_tex_AllPackages_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2547);
/* harmony import */ var mathjax_full_js_mathjax_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2338);
/* harmony import */ var _linter_assert_no_tex_tabular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2658);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(343);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([mathjax_full_js_adaptors_liteAdaptor_js__WEBPACK_IMPORTED_MODULE_0__, mathjax_full_js_core_MathItem_js__WEBPACK_IMPORTED_MODULE_1__, mathjax_full_js_core_MmlTree_SerializedMmlVisitor_js__WEBPACK_IMPORTED_MODULE_2__, mathjax_full_js_handlers_html_js__WEBPACK_IMPORTED_MODULE_3__, mathjax_full_js_input_tex_js__WEBPACK_IMPORTED_MODULE_4__, mathjax_full_js_input_tex_AllPackages_js__WEBPACK_IMPORTED_MODULE_5__, mathjax_full_js_mathjax_js__WEBPACK_IMPORTED_MODULE_6__]);
([mathjax_full_js_adaptors_liteAdaptor_js__WEBPACK_IMPORTED_MODULE_0__, mathjax_full_js_core_MathItem_js__WEBPACK_IMPORTED_MODULE_1__, mathjax_full_js_core_MmlTree_SerializedMmlVisitor_js__WEBPACK_IMPORTED_MODULE_2__, mathjax_full_js_handlers_html_js__WEBPACK_IMPORTED_MODULE_3__, mathjax_full_js_input_tex_js__WEBPACK_IMPORTED_MODULE_4__, mathjax_full_js_input_tex_AllPackages_js__WEBPACK_IMPORTED_MODULE_5__, mathjax_full_js_mathjax_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);










// This custom MathJax implementation has had to diverge from the provided demos found
// here: https://github.com/mathjax/MathJax-demos-node, because they are all focused on
// either converting LaTeX on its own or (referencing "page" demos) LaTeX embedded in
// HTML, whereas at this stage in the processor we're dealing with LaTeX embedded in
// Markdown. Due to TeX/LaTeX making heavy use of the backslash (\) character, we need
// to deal with it early as it conflicts with other libraries used later.

// I use the MathJax "page" process as it will pick up LaTeX even without delimiters
// and stores context required for numbered references (based on direct/tex2mml-page).
// However this has a naive HTML handler which will munge HTML (and Python) in some
// cases so I am careful to only mutate TeX and leave the rest of the Markdown alone.

// I replace the TeX with a placeholder formatted as a Markdown directive, for example
// :inlineMath[21] or :blockMath[42].

// I convert the TeX to MathML and store it memory for use later (in directive-to-svg.ts).

function texToAliasDirective(file, ctx) {
  // simple regex tests
  (0,_linter_assert_no_tex_tabular__WEBPACK_IMPORTED_MODULE_7__/* .assertNoTexTabular */ .d)(file);
  const md = file.value;
  const store = [];
  const adaptor = (0,mathjax_full_js_adaptors_liteAdaptor_js__WEBPACK_IMPORTED_MODULE_0__.liteAdaptor)();
  const visitor = new mathjax_full_js_core_MmlTree_SerializedMmlVisitor_js__WEBPACK_IMPORTED_MODULE_2__.SerializedMmlVisitor();
  (0,mathjax_full_js_handlers_html_js__WEBPACK_IMPORTED_MODULE_3__.RegisterHTMLHandler)(adaptor);
  const doc = mathjax_full_js_mathjax_js__WEBPACK_IMPORTED_MODULE_6__.mathjax.document(md, {
    InputJax: new mathjax_full_js_input_tex_js__WEBPACK_IMPORTED_MODULE_4__.TeX({
      // Bussproofs requires an output jax
      packages: mathjax_full_js_input_tex_AllPackages_js__WEBPACK_IMPORTED_MODULE_5__.AllPackages.filter(name => name !== 'bussproofs'),
      // Allow numbered references
      tags: 'ams',
      // Allow single $ delimiters
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], [`\\[`, `\\]`]]
    }),
    // wrap verbatim latex with <div class="mathjax-ignore"></div>
    ignoreHtmlClass: 'mathjax-ignore',
    renderActions: {
      typeset: [mathjax_full_js_core_MathItem_js__WEBPACK_IMPORTED_MODULE_1__.STATE.TYPESET, ({
        math
      }) => {
        for (const item of Array.from(math)) {
          let newMarkdown = '';

          // convert to MathML
          const mml = visitor.visitTree(item.root);
          assertNoMmlError(mml, file);

          // escaped dollar sign...
          if (item.math === '$') {
            newMarkdown = '$';
          }

          // double backslash...
          else if (item.math === '\\') {
            newMarkdown = '\\\\';
          }

          // reference link...
          else if (isReferenceLink(item.math)) {
            const refNum = extractRefNumFromMml(mml, item.math, file);
            const anchor = extractAnchorLinkFromMml(mml, item.math, file);
            newMarkdown = `[${refNum}](${anchor})`;
          }

          // normal use case (math notation)...
          else {
            store.push(mml);
            const type = item.display ? 'blockMath' : 'inlineMath';
            newMarkdown = `:${type}[${store.length - 1}]`;
          }
          const tree = adaptor.parse(newMarkdown, 'text/html');
          item.typesetRoot = adaptor.firstChild(adaptor.body(tree));
        }
      }]
    }
  });

  // add store to ctx
  ctx.mmlStore = store;
  doc.render();

  // replace md in VFile
  const result = adaptor.innerHTML(adaptor.body(doc.document));
  file.value = postParse(result);
  return file;
}
function assertNoMmlError(mml, file) {
  const match = mml.match(/<merror.*?title="(.+?)"/);
  if (match !== null) {
    (0,_utils_message__WEBPACK_IMPORTED_MODULE_8__/* .failMessage */ .Ob)(file, `LaTeX error: "${match[1]}".`);
  }
}
function isReferenceLink(tex) {
  return /^\\ref\{(.+)\}$/.test(tex);
}
function extractRefNumFromMml(mml, tex, file) {
  const match = mml.match(/<mtext>(.+)<\/mtext>/);
  if (match === null) {
    (0,_utils_message__WEBPACK_IMPORTED_MODULE_8__/* .failMessage */ .Ob)(file, `Invalid reference: ${tex}`);
    return;
  }
  if (match[1] === '???') {
    (0,_utils_message__WEBPACK_IMPORTED_MODULE_8__/* .failMessage */ .Ob)(file, `Invalid reference: ${tex}. You may only reference numbered sections.`);
  }
  return match[1];
}
function extractAnchorLinkFromMml(mml, tex, file) {
  const match = mml.match(/<mrow href="(.+)" class="MathJax_ref">/);
  if (match === null) {
    (0,_utils_message__WEBPACK_IMPORTED_MODULE_8__/* .failMessage */ .Ob)(file, `Reference has no anchor link: ${tex}`);
    return;
  }
  return decodeURIComponent(match[1] || '');
}
function postParse(html) {
  let result = html.trim();
  result = unprotectHtml(result);
  result = removeUnresolvedLabels(result);
  result = removeHTMLClosingTags(result);
  return result;
}

// https://github.com/mathjax/MathJax-src/blob/41565a97529c8de57cb170e6a67baf311e61de13/ts/adaptors/lite/Parser.ts#L399-L403
function unprotectHtml(html) {
  return html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
function removeUnresolvedLabels(html) {
  return html.replace(/\\label{def:.*?}/gm, '');
}
function removeHTMLClosingTags(html) {
  return html.replace(/(<\/\S+>)+$/, '');
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 5362:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ assertAssetExists)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(343);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1358);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__, _utils_utils__WEBPACK_IMPORTED_MODULE_2__]);
([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__, _utils_utils__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



function assertAssetExists() {
  async function getAssetUrl(node, file) {
    const url = node.url || '';
    if (!file.dirname) {
      throw new Error('VFile dirname undefined');
    }
    if (!url.startsWith('http')) {
      const exists = await (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__/* .checkLocalFileExists */ .qd)(url);
      if (!exists) {
        (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, `No asset found at ${url}`, node.position);
      }
    }
  }
  return async (tree, file) => {
    const transformations = [];
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'image', node => {
      transformations.push(getAssetUrl(node, file));
    });
    await Promise.all(transformations);
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9386:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ assertColumnStructure)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(343);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


function assertColumnStructure() {
  return (tree, file) => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'containerDirective', (node, index, _parent) => {
      if (node.name === 'columns') {
        const children = node.children;
        const columns = children.filter(o => o.name === 'column');
        if (columns.length < 2) {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'Columns must contain at least 2 columns', node.position);
        }
      }
      if (node.name === 'column') {
        const parent = _parent;
        if (!parent || parent.name !== 'columns') {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'Column must be nested inside columns', node.position);
        }
      }
    });
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2364:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: () => (/* binding */ assertNoH1)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(343);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


function assertNoH1() {
  return (tree, file) => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'heading', node => {
      if (node.depth === 1) {
        (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'Level 1 heading found. Only one Level 1 heading can be used in the document and it is automatically generated from .yaml file and should not be found in .Rmd file.  Please use Level 2 (## Example) and below.', node.position);
        return;
      }
    });
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9051:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ assertNoImageAttributes)
/* harmony export */ });
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(343);

function assertNoImageAttributes(file) {
  const md = file.value;
  md.split('\n').forEach((line, idx) => {
    const match = line.match(/!\[.*\]\(.*\)({.+})/);
    if (match !== null) {
      (0,_utils_message__WEBPACK_IMPORTED_MODULE_0__/* .warnMessage */ .KU)(file, `image attributes are not supported: ${match[1]}`, {
        start: {
          line: idx + 1,
          column: 0
        },
        end: {
          line: idx + 1,
          column: line.length
        }
      });
    }
  });
}

/***/ }),

/***/ 2658:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: () => (/* binding */ assertNoTexTabular)
/* harmony export */ });
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(343);


// TODO: could possibly try converting to array here
// https://stackoverflow.com/questions/51803244

function assertNoTexTabular(file) {
  const md = file.value;
  md.split('\n').forEach((line, idx) => {
    if (line.includes('\\begin{tabular}')) {
      (0,_utils_message__WEBPACK_IMPORTED_MODULE_0__/* .failMessage */ .Ob)(file, 'LaTeX tables are not allowed, please use Markdown syntax', {
        start: {
          line: idx + 1,
          column: 0
        },
        end: {
          line: idx + 1,
          column: line.length
        }
      });
    }
  });
}

/***/ }),

/***/ 9941:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ assertProgramSwitcherStructure)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(343);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


function assertProgramSwitcherStructure() {
  return (tree, file) => {
    let count = 0;
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'containerDirective', (node, index, _parent) => {
      if (node.name === 'task') {
        count++;
        const children = node.children;
        const answers = children.filter(o => o.name === 'answer');
        if (answers.length < 1) {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, `Task ${count} has no answer`, node.position);
        }
        if (answers.length > 1) {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'Task has multiple answers', node.position);
        }
      }
      if (node.name === 'answer') {
        const parent = _parent;
        if (!parent || parent.name !== 'task') {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'Answer must be nested inside task', node.position);
        }
      }
    });
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3339:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ assertTaskAnswerStructure)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(343);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


function assertTaskAnswerStructure() {
  return (tree, file) => {
    let count = 0;
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'containerDirective', (node, index, _parent) => {
      if (node.name === 'task') {
        count++;
        const children = node.children;
        const answers = children.filter(o => o.name === 'answer');
        if (answers.length < 1) {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, `Task ${count} has no answer`, node.position);
        }
        if (answers.length > 1) {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'Task has multiple answers', node.position);
        }
      }
      if (node.name === 'answer') {
        const parent = _parent;
        if (!parent || parent.name !== 'task') {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'Answer must be nested inside task', node.position);
        }
      }
    });
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7977:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ assertVideoAttributes)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(343);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


function assertVideoAttributes() {
  return async (tree, file) => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'leafDirective', node => {
      if (node.name === 'video') {
        if (!node.attributes?.id) {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'id attribute is required', node.position);
        }
        if (!node.attributes?.duration) {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'duration attribute is required', node.position);
        }
        const title = getTitle(node);
        if (!title) {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'title is required', node.position);
        }
      }
    });
  };
}
function getTitle(node) {
  const children = node.children;
  const firstChild = children[0];
  return firstChild?.value || '';
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7767:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ assertWeblinkTarget)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(343);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


function assertWeblinkTarget() {
  return (tree, file) => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'containerDirective', node => {
      if (node.name === 'weblink') {
        if (node.attributes?.target === undefined) {
          (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'Weblink has no target attribute', node.position);
        }
      }
    });
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1399:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   E: () => (/* binding */ reportErrors),
/* harmony export */   Z: () => (/* binding */ createReport)
/* harmony export */ });
/* harmony import */ var _double_great_remark_lint_alt_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6433);
/* harmony import */ var _mapbox_remark_lint_link_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5921);
/* harmony import */ var unified__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4390);
/* harmony import */ var _assert_asset_exists__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5362);
/* harmony import */ var _assert_columns__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9386);
/* harmony import */ var _assert_no_h1__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2364);
/* harmony import */ var _assert_program_switcher__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9941);
/* harmony import */ var _assert_task_answer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3339);
/* harmony import */ var _assert_video_attributes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7977);
/* harmony import */ var _assert_weblink_target__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7767);
/* harmony import */ var _lint_latex__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1622);
/* harmony import */ var _report__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(1110);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_double_great_remark_lint_alt_text__WEBPACK_IMPORTED_MODULE_0__, _mapbox_remark_lint_link_text__WEBPACK_IMPORTED_MODULE_1__, unified__WEBPACK_IMPORTED_MODULE_2__, _assert_asset_exists__WEBPACK_IMPORTED_MODULE_3__, _assert_columns__WEBPACK_IMPORTED_MODULE_4__, _assert_no_h1__WEBPACK_IMPORTED_MODULE_5__, _assert_program_switcher__WEBPACK_IMPORTED_MODULE_6__, _assert_task_answer__WEBPACK_IMPORTED_MODULE_7__, _assert_video_attributes__WEBPACK_IMPORTED_MODULE_8__, _assert_weblink_target__WEBPACK_IMPORTED_MODULE_9__, _lint_latex__WEBPACK_IMPORTED_MODULE_10__, _report__WEBPACK_IMPORTED_MODULE_11__]);
([_double_great_remark_lint_alt_text__WEBPACK_IMPORTED_MODULE_0__, _mapbox_remark_lint_link_text__WEBPACK_IMPORTED_MODULE_1__, unified__WEBPACK_IMPORTED_MODULE_2__, _assert_asset_exists__WEBPACK_IMPORTED_MODULE_3__, _assert_columns__WEBPACK_IMPORTED_MODULE_4__, _assert_no_h1__WEBPACK_IMPORTED_MODULE_5__, _assert_program_switcher__WEBPACK_IMPORTED_MODULE_6__, _assert_task_answer__WEBPACK_IMPORTED_MODULE_7__, _assert_video_attributes__WEBPACK_IMPORTED_MODULE_8__, _assert_weblink_target__WEBPACK_IMPORTED_MODULE_9__, _lint_latex__WEBPACK_IMPORTED_MODULE_10__, _report__WEBPACK_IMPORTED_MODULE_11__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);

// @ts-expect-error

// import dictionary from 'dictionary-en-gb';
// import remark2retext from 'remark-retext';
// import english from 'retext-english';
// import spell from 'retext-spell';










function reportErrors(files, ctx) {
  if (!ctx.options.noReport) {
    (0,_report__WEBPACK_IMPORTED_MODULE_11__/* .printReport */ .IC)(files, ctx);
  }
  if ((0,_report__WEBPACK_IMPORTED_MODULE_11__/* .reportHasFatalErrors */ .wC)(files)) {
    if (ctx.options.noReport) {
      (0,_report__WEBPACK_IMPORTED_MODULE_11__/* .printReport */ .IC)(files, {
        ...ctx,
        options: {
          ...ctx.options,
          reportOnlyErrors: true
        }
      });
    }
    console.log('Report has fatal errors');
    if (ctx.options.force) {
      console.log('Compiling using force option...');
    } else {
      process.exit(1);
    }
  }
}
async function createReport(file, mdast, ctx) {
  const processor = (0,unified__WEBPACK_IMPORTED_MODULE_2__.unified)().use(_assert_asset_exists__WEBPACK_IMPORTED_MODULE_3__/* .assertAssetExists */ .c).use(_assert_video_attributes__WEBPACK_IMPORTED_MODULE_8__/* .assertVideoAttributes */ .c).use(_assert_task_answer__WEBPACK_IMPORTED_MODULE_7__/* .assertTaskAnswerStructure */ .A).use(_assert_program_switcher__WEBPACK_IMPORTED_MODULE_6__/* .assertProgramSwitcherStructure */ .F).use(_assert_columns__WEBPACK_IMPORTED_MODULE_4__/* .assertColumnStructure */ .C).use(_assert_weblink_target__WEBPACK_IMPORTED_MODULE_9__/* .assertWeblinkTarget */ .F).use(_assert_no_h1__WEBPACK_IMPORTED_MODULE_5__/* .assertNoH1 */ .N).use(_lint_latex__WEBPACK_IMPORTED_MODULE_10__/* .lintLatex */ .I)
  // @ts-expect-error
  .use(_double_great_remark_lint_alt_text__WEBPACK_IMPORTED_MODULE_0__["default"]).use(_mapbox_remark_lint_link_text__WEBPACK_IMPORTED_MODULE_1__["default"]);

  // if (ctx.options.spelling) {
  //   const retextProcessor = unified()
  //     .use(english)
  //     .use(spell, { dictionary, max: 1 });
  //   processor.use(remark2retext, retextProcessor);
  // }

  processor.run(mdast, file);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1622:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ lintLatex)
/* harmony export */ });
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2081);
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_1__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


function lintLatex() {
  return async (tree, file) => {
    const transformations = [];
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_1__.visit)(tree, 'math', node => {
      transformations.push(chktex(node, file));
    });
    await Promise.all(transformations);
    return tree;
  };
}
async function chktex(node, file) {
  return new Promise((resolve, reject) => {
    (0,child_process__WEBPACK_IMPORTED_MODULE_0__.exec)(`chktex -q <<< "${node.value}"`, (err, response) => {
      if (err) {
        reject(err);
      } else {
        const messages = formatResponse(response);
        const position = node.position;
        messages.forEach(({
          line,
          column,
          message
        }) => {
          file.message(message, {
            line: position.start.line + line,
            column: position.start.column + column
          });
        });
        resolve();
      }
    });
  });
}
function formatResponse(response) {
  if (response.trim() === '') {
    return [];
  }
  function formatMessage(message) {
    return message.replace(/'/g, '').replace(/`/g, '');
  }
  return response.split(/Warning \d+ in stdin line /).filter(Boolean).reduce((acc, s) => {
    const [key, value] = s.split(':');
    const line = Number(key);
    const trimmed = value.trim();
    const match = trimmed.match(/(.*)\n(.*)\n(\s*)\^/m);
    if (Array.isArray(match)) {
      const message = formatMessage(match[1]);
      acc.push({
        line,
        column: match[3].length,
        message: `${message}\n\n${match[2]}\n${match[3]}^`
      });
    } else {
      acc.push({
        line,
        column: 0,
        message: formatMessage(trimmed)
      });
    }
    return acc;
  }, []);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1110:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IC: () => (/* binding */ printReport),
/* harmony export */   wC: () => (/* binding */ reportHasFatalErrors)
/* harmony export */ });
/* unused harmony export reportHasWarnings */
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7564);
/* harmony import */ var figures__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3952);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(343);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([chalk__WEBPACK_IMPORTED_MODULE_0__, figures__WEBPACK_IMPORTED_MODULE_1__]);
([chalk__WEBPACK_IMPORTED_MODULE_0__, figures__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



function printReport(files, ctx) {
  const {
    reportOnlyErrors,
    shouldFail
  } = ctx.options;
  if (reportOnlyErrors && shouldFail) {
    return;
  }
  for (const file of files) {
    // console.log(file.messages);
    const messages = reportOnlyErrors ? failingMessages(file.messages) : file.messages;
    if (messages.length !== 0) {
      // if (file.path !== undefined) {
      //   console.log(`\n${getFilePath(file.path)}`);
      // }
      messages.forEach(message => {
        printMessage(message);
      });
    }
  }
}
function reportHasFatalErrors(files) {
  return files.some(file => {
    const messages = file.messages;
    return messages.some(message => message.status === _utils_message__WEBPACK_IMPORTED_MODULE_2__/* .MessageStatus */ .rJ.fail);
  });
}
function reportHasWarnings(files) {
  return files.some(file => {
    const messages = file.messages;
    return messages.some(message => message.status === MessageStatus.warning);
  });
}
function failingMessages(_messages) {
  const messages = _messages;
  return messages.filter(o => o.status === _utils_message__WEBPACK_IMPORTED_MODULE_2__/* .MessageStatus */ .rJ.fail);
}
function printMessage(_message) {
  const message = _message;
  // console.log(message);
  const status = message.status;
  const position = chalk__WEBPACK_IMPORTED_MODULE_0__["default"].grey(`${message.line}:${message.column}`);
  const reason = formatReason(message.reason, status);
  console.log(`${formatStatus(status)}  ${position}  ${reason}`);
}

// function getFilePath(filePath: string) {
//   return path.isAbsolute(filePath)
//     ? filePath
//     : path.join(process.cwd(), filePath);
// }

function formatStatus(status) {
  const statusColour = getStatusColour(status);
  switch (status) {
    case _utils_message__WEBPACK_IMPORTED_MODULE_2__/* .MessageStatus */ .rJ.fail:
      return statusColour(figures__WEBPACK_IMPORTED_MODULE_1__["default"].cross);
    default:
      return statusColour(figures__WEBPACK_IMPORTED_MODULE_1__["default"].warning);
    // TODO: fail on unsupported status?
  }
}
function formatReason(reason, status) {
  const statusColour = getStatusColour(status);
  const [first, ...rest] = reason.split('\n');
  const formattedFirst = statusColour(first);
  const formattedRest = rest.map(line => chalk__WEBPACK_IMPORTED_MODULE_0__["default"].grey(line));
  return [formattedFirst, ...formattedRest].join('\n');
}
function getStatusColour(status) {
  switch (status) {
    case _utils_message__WEBPACK_IMPORTED_MODULE_2__/* .MessageStatus */ .rJ.fail:
      return chalk__WEBPACK_IMPORTED_MODULE_0__["default"].red;
    default:
      return chalk__WEBPACK_IMPORTED_MODULE_0__["default"].yellow;
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6112:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   q: () => (/* binding */ boxouts)
/* harmony export */ });
/* unused harmony export createBoxout */
/* harmony import */ var lodash_startCase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9659);
/* harmony import */ var mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1037);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6016);
/* harmony import */ var _utils_counter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2098);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lodash_startCase_js__WEBPACK_IMPORTED_MODULE_0__, mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_1__, unist_util_visit__WEBPACK_IMPORTED_MODULE_2__]);
([lodash_startCase_js__WEBPACK_IMPORTED_MODULE_0__, mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_1__, unist_util_visit__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);




function boxouts(refStore) {
  const counter = (0,_utils_counter__WEBPACK_IMPORTED_MODULE_3__/* .createCounter */ .G)();
  return async tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_2__.visit)(tree, 'containerDirective', node => {
      switch (node.name) {
        case 'example':
        case 'error':
        case 'supplement':
        case 'background':
        case 'definition':
        case 'weblink':
        case 'theorem':
        case 'task':
        case 'proposition':
        case 'answer':
          {
            const name = node.name;
            const count = counter.increment(name);
            node.data = {
              hProperties: createAttributes(node, count, refStore),
              hChildren: createBoxout(node, count)
            };
          }
      }
    });
  };
}
function createAttributes(node, count, refStore) {
  const name = node.name;
  const id = `${name}-${count}`;
  const attributes = node.attributes;
  const className = ['boxout', name];
  if (attributes.icon) {
    className.push(`${attributes.icon}-icon`);
  }
  if (node.attributes?.label !== undefined && node.attributes?.label !== null) {
    refStore[node.attributes.label] = id;
  }
  return {
    className,
    id
  };
}
function createBoxout(node, count) {
  const typeTitle = createBoxoutType(node, count);
  const titles = [typeTitle];
  const titleValue = getTitleValue(node);
  if (titleValue.length > 0) {
    const title = createTitle(node);
    titles.push(title);
  }
  const children = node.children;
  const content = children
  // @ts-expect-error
  .filter(o => !o.data?.directiveLabel).filter(o => o.type !== 'containerDirective' && o.name !== 'answer').map(o => (0,mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_1__.toHast)(o, {
    allowDangerousHtml: true
  })).filter(Boolean);
  if (node.name === 'task') {
    const answer = children.find(o => o.type === 'containerDirective' && o.name === 'answer');
    if (answer) {
      const answerHast = createAnswer(answer, count);
      content.push(answerHast);
    }
  }
  return [...titles, ...content];
}
function createAnswer(node, count) {
  const {
    children
  } = (0,mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_1__.toHast)(node);
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['answer']
    },
    children: [{
      type: 'element',
      tagName: 'span',
      properties: {
        className: ['answer-trigger'],
        'data-answer-id': count
      },
      children: [{
        type: 'text',
        value: 'Show answer'
      }]
    }, {
      type: 'element',
      tagName: 'div',
      properties: {
        className: ['answer-reveal'],
        id: `answer-${count}`
      },
      children
    }]
  };
}
function createBoxoutType(node, count) {
  const name = node.name;
  const label = (0,lodash_startCase_js__WEBPACK_IMPORTED_MODULE_0__["default"])(name);
  let value = `${label} ${count}`;
  if (node.attributes?.optional !== undefined) {
    value += ` (Optional)`;
  }
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['type']
    },
    children: [{
      type: 'text',
      value
    }]
  };
}
function createTitle(node) {
  return {
    type: 'element',
    tagName: 'h3',
    children: createTitleValue(node),
    properties: {}
  };
}
function createTitleValue(node) {
  const name = node.name;
  const newRoot = {
    type: 'root',
    children: getTitleValue(node)
  };
  const {
    children = []
  } = (0,mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_1__.toHast)(newRoot);
  if (name !== 'weblink') {
    return children;
  }
  const {
    target
  } = node.attributes;
  return [{
    type: 'element',
    tagName: 'a',
    properties: {
      href: target,
      target: '_blank',
      className: ['target']
    },
    children
  }];
}
function getTitleValue(node) {
  const children = node.children || [];
  const parent = children[0] || {};

  // @ts-expect-error
  if (!parent.data?.directiveLabel) {
    if (node.name === 'weblink') {
      const attributes = node.attributes;
      return [{
        type: 'text',
        value: attributes.target
      }];
    }
    return [];
  }
  return parent.children || [];
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 719:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ browserWindow)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(343);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


function browserWindow() {
  return (tree, file) => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'leafDirective', node => {
      if (node.name === 'browser') {
        template(node, file);
      }
    });
  };
}
function template(node, file) {
  const url = node.attributes?.url || '';
  const alt = node.attributes?.alt || '';
  const imagePath = getImagePath(node, file);
  const browser = createBrowserWindow(imagePath, url, alt);
  const caption = createCaption(alt);
  Object.assign(node, {
    type: 'browser-window',
    data: {
      hName: 'figure',
      hProperties: {
        className: ['browser']
      },
      hChildren: [browser, caption]
    }
  });
}
function createBrowserWindow(imagePath, url, alt) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'browser-window'
    },
    children: [{
      type: 'text',
      value: '\n'
    }, {
      type: 'element',
      tagName: 'div',
      properties: {
        className: 'browser-window-wrapper'
      },
      children: [createBrowserHeader(url), {
        type: 'text',
        value: '\n'
      }, {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'browser-window-content'
        },
        children: [{
          type: 'element',
          tagName: 'img',
          properties: {
            src: imagePath,
            alt
          },
          children: []
        }]
      }, {
        type: 'text',
        value: '\n'
      }]
    }]
  };
}
function createBrowserHeader(url) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'browser-window-header'
    },
    children: [{
      type: 'element',
      tagName: 'div',
      properties: {
        className: 'browser-window-address-bar'
      },
      children: [{
        type: 'text',
        value: url?.trim() || ''
      }]
    }]
  };
}
function createCaption(alt) {
  if (alt.trim() === '') {
    return null;
  }
  return {
    type: 'element',
    tagName: 'figcaption',
    properties: {},
    children: [{
      type: 'element',
      tagName: 'a',
      properties: {},
      children: [{
        type: 'text',
        value: ` ${alt}`
      }]
    }]
  };
}
function getImagePath(node, file) {
  const children = node.children;
  const firstChild = children[0];
  const title = firstChild?.value || '';
  if (title.trim() === '') {
    (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'Video has no title', node.position);
  }
  return title;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8997:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: () => (/* binding */ codeBlocks)
/* harmony export */ });
/* harmony import */ var refractor_lib_all_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1139);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([refractor_lib_all_js__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__]);
([refractor_lib_all_js__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


function codeBlocks(ctx) {
  return async (tree, file) => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_1__.visit)(tree, 'code', node => {
      customCode(node, ctx, file);
    });
  };
}
function customCode(node, ctx, file) {
  const language = parseLanguage(node);
  const klass = parseClass(node);
  const codeProps = {};
  const children = [];
  const trimmed = node.value.trim();
  if (ctx.options.noSyntaxHighlight || language === '') {
    children.push({
      type: 'text',
      value: trimmed
    });
  } else {
    const highlighted = refractor_lib_all_js__WEBPACK_IMPORTED_MODULE_0__.refractor.highlight(trimmed, language);
    children.push(...highlighted.children);
  }
  Object.assign(node, {
    type: 'custom-code',
    data: {
      hName: 'div',
      hProperties: {
        className: ['code-wrapper', klass]
      },
      hChildren: [addConsoleHeading(klass), {
        type: 'element',
        tagName: 'pre',
        children: [{
          type: 'element',
          tagName: 'code',
          properties: codeProps,
          children
        }]
      }]
    }
  });
}
function addConsoleHeading(klass) {
  if (klass === 'r-output' || klass === 'r-error-output') {
    return {
      type: 'element',
      tagName: 'h6',
      properties: {
        className: 'console-heading'
      },
      children: [{
        type: 'text',
        value: 'R Console'
      }]
    };
  }
  if (klass === 'python-output' || klass === 'python-error-output') {
    return {
      type: 'element',
      tagName: 'h6',
      properties: {
        className: 'console-heading'
      },
      children: [{
        type: 'text',
        value: 'Python Console'
      }]
    };
  }
  return null;
}
function parseLanguage(node) {
  const lang = node.lang || '';
  if (lang === 'plaintext') {
    return '';
  }
  if (lang.startsWith('{')) {
    const match = lang.match(/.lang-(\w+)/);
    if (match === null) {
      return '';
    }
    return match[1].toLowerCase();
  }
  return lang.toLowerCase();
}
function parseClass({
  lang,
  meta
}) {
  const m = !meta || meta === 'null' ? '' : meta;
  const combined = `${lang || ''} ${m}`.trim();
  if (!combined.startsWith('{.')) {
    return '';
  }
  return combined.slice(1, -1).replace(/\./g, '');
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8943:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: () => (/* binding */ columns)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

function columns() {
  return tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'containerDirective', node => {
      if (node.name === 'columns') {
        node.data = {
          hProperties: {
            className: 'columns'
          }
        };
      } else if (node.name === 'column') {
        node.data = {
          hProperties: {
            className: 'column'
          }
        };
        if (node.attributes?.imgsrc) {
          const altText = getAltText(node);
          const img = {
            type: 'image',
            url: node.attributes.imgsrc,
            alt: altText
          };
          if (altText) {
            Object.assign(node.children[0], img);
          } else {
            node.children.unshift(img);
          }
        }
      }
    });
  };
}
function getAltText(column) {
  const firstChild = column.children[0];
  if (!firstChild) {
    return false;
  }
  const firstChildChildren = firstChild.children;
  if (!Array.isArray(firstChildChildren)) {
    return false;
  }
  const firstChildFirstChild = firstChildChildren[0];
  if (!firstChildFirstChild) {
    return false;
  }
  return firstChildFirstChild.value;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1316:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ combinedMdastPhase)
/* harmony export */ });
/* harmony import */ var unified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4390);
/* harmony import */ var _boxouts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6112);
/* harmony import */ var _move_answers_to_end__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3069);
/* harmony import */ var _program_switcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3324);
/* harmony import */ var _language_switcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4921);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unified__WEBPACK_IMPORTED_MODULE_0__, _boxouts__WEBPACK_IMPORTED_MODULE_1__, _move_answers_to_end__WEBPACK_IMPORTED_MODULE_2__, _program_switcher__WEBPACK_IMPORTED_MODULE_3__, _language_switcher__WEBPACK_IMPORTED_MODULE_4__]);
([unified__WEBPACK_IMPORTED_MODULE_0__, _boxouts__WEBPACK_IMPORTED_MODULE_1__, _move_answers_to_end__WEBPACK_IMPORTED_MODULE_2__, _program_switcher__WEBPACK_IMPORTED_MODULE_3__, _language_switcher__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





async function combinedMdastPhase(mdast, ctx, file, targetPdf) {
  const processor = (0,unified__WEBPACK_IMPORTED_MODULE_0__.unified)().use(_program_switcher__WEBPACK_IMPORTED_MODULE_3__/* .programSwitcher */ .D, ctx).use(_language_switcher__WEBPACK_IMPORTED_MODULE_4__/* .languageSwitcher */ .v, ctx).use(_boxouts__WEBPACK_IMPORTED_MODULE_1__/* .boxouts */ .q, ctx.refStore);
  if (targetPdf) {
    processor.use(_move_answers_to_end__WEBPACK_IMPORTED_MODULE_2__/* .moveAnswersToEnd */ .w);
  }
  return processor.run(mdast, file);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 5660:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ embedAssetUrl)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6016);
/* harmony import */ var unist_util_remove__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9365);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_1__, unist_util_remove__WEBPACK_IMPORTED_MODULE_2__]);
([unist_util_visit__WEBPACK_IMPORTED_MODULE_1__, unist_util_remove__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



function embedAssetUrl(ctx) {
  return async tree => {
    let activeDir = '';

    // nodes need to be visited in the correct order
    // to derive the document directory
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_1__.visit)(tree, (node, index, parent) => {
      // to ensure relative paths to assets across multiple .Rmd files
      if (node.type === 'leafDirective' && node.name === 'directory') {
        const firstChild = node.children[0];
        activeDir = firstChild.value || '';
      }
      if (node.type === 'image') {
        const url = getPath(node.url, activeDir, ctx);
        node.url = url;
      }

      // also fix for browser template
      if (node.type === 'leafDirective' && node.name === 'browser') {
        const firstChild = node.children[0];
        firstChild.value = getPath(firstChild.value, activeDir, ctx);
      }

      // also fix for raw html nodes sometimes output by knitr
      if (node.type === 'html') {
        const props = getProps(node.value);
        if (props !== null && props.src) {
          const {
            src,
            ...otherProps
          } = props;
          Object.assign(node, {
            type: 'image',
            url: getPath(src, activeDir, ctx),
            value: '',
            data: otherProps
          });
        }
      }
    });

    // remove the directory leafDirective node from the tree
    (0,unist_util_remove__WEBPACK_IMPORTED_MODULE_2__.remove)(tree, node => {
      if (node.type === 'leafDirective') {
        const directive = node;
        return directive.name === 'directory';
      }
      return false;
    });
  };
}
function getPath(url, dirname, ctx) {
  if (ctx.options.noEmbedAssetUrl) {
    return url;
  }
  if (path__WEBPACK_IMPORTED_MODULE_0___default().isAbsolute(url) || url.startsWith('http')) {
    return url;
  }
  // pythons matplotlib appears to assign plot images a path
  // relative to the project root, whereas all other libraries use
  // an absolute path.
  if (url.startsWith('cache')) {
    return path__WEBPACK_IMPORTED_MODULE_0___default().join(ctx.cacheDir, url.replace('cache', ''));
  }
  return path__WEBPACK_IMPORTED_MODULE_0___default().join(dirname, url);
}
function getProps(value) {
  const matchImg = value.match(/^<img.*?src="(.+?)".*?>$/);
  if (matchImg !== null) {
    return propsToObject(value.slice(5, -1));
  }
  const matchPdf = value.match(/^<embed.*?src="(.+?)".*?>$/);
  if (matchPdf !== null) {
    return propsToObject(value.slice(7, -1));
  }
  return null;
}
function propsToObject(str) {
  return str.split(/(\w+)="(.*?)"/).filter(s => s.trim() !== '').reduce((acc, value, idx, arr) => {
    if (idx % 2 === 1) {
      const key = arr[idx - 1];
      acc[key] = value;
    }
    return acc;
  }, {});
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6945:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ gitGraph)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

function gitGraph() {
  return tree => {
    let counter = 0;
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'code', node => {
      if (node.lang === 'gitgraph') {
        createGitGraph(node, ++counter);
      }
    });
  };
}
function createGitGraph(node, counter) {
  const id = `gitgraph-${counter}`;
  const options = createDefaultOptions();
  Object.assign(node, {
    type: 'gitgraph',
    data: {
      hName: 'div',
      hProperties: {
        className: 'gitgraph'
      },
      hChildren: [{
        type: 'text',
        value: '\n'
      }, {
        type: 'element',
        tagName: 'div',
        properties: {
          id: `gitgraph-${counter}`
        }
      }, {
        type: 'text',
        value: '\n'
      },
      // this will need to be "singleton" inlined
      {
        type: 'element',
        tagName: 'script',
        properties: {
          src: 'https://cdn.jsdelivr.net/npm/@gitgraph/js'
        },
        children: []
      }, {
        type: 'text',
        value: '\n'
      }, {
        type: 'element',
        tagName: 'script',
        children: [{
          type: 'text',
          value: ['',
          // The global template js (template/src/index.ts) emits a custom event
          // 'template-ready' when initialised.  This is handy as the document
          // gets serveral <html> element classes added to it which causes re-renders.
          // Here, we wait for this custom event before rendering the gitgraphs,
          // and are careful to define all variables inside the the event callback
          `document.documentElement.addEventListener('template-ready', () => {`, '', `const graphContainer = document.getElementById("${id}");`, `const gitgraph = GitgraphJS.createGitgraph(graphContainer, ${options});`, `${node.value}`, '', `})`, ''].join('\n')
        }]
      }, {
        type: 'text',
        value: '\n'
      }]
    }
  });
}
function createDefaultOptions() {
  return JSON.stringify({
    // orientation: 'vertical-reverse',
    template: {
      colors: ['#0075b0', '#00843d', '#7d2239', '#951272', '#7a6855'],
      branch: {
        color: '#ccc',
        lineWidth: 5,
        mergeStyle: 'bezier',
        spacing: 40,
        label: {
          display: true,
          bgColor: 'transparent',
          borderRadius: 10
        }
      },
      arrow: {
        // size: 10,
        // color: '#ccc',
        // offset: -1.5
      },
      commit: {
        spacing: 40,
        hasTooltipInCompactMode: true,
        dot: {
          // size: 8,
          // strokeWidth: 0,
          size: 16,
          strokeWidth: 6,
          strokeColor: 'white'
        },
        message: {
          display: true,
          displayAuthor: false,
          displayHash: false,
          font: 'inherit',
          color: '#333'
        }
      },
      tag: {}
    }
  });
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6365:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ images)
/* harmony export */ });
/* harmony import */ var lodash_kebabCase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3908);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6016);
/* harmony import */ var _utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3609);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lodash_kebabCase_js__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__, _utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_2__]);
([lodash_kebabCase_js__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__, _utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



function images(ctx) {
  return tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_1__.visit)(tree, 'image', node => {
      templateFromImage(node, ++ctx.figureCounter);
    });

    // knitr can output HTML for plots instead of Markdown now
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_1__.visit)(tree, 'html', node => {
      const value = String(node.value);
      if (value.startsWith('<div class="figure">')) {
        const hast = (0,_utils_get_asset_hast__WEBPACK_IMPORTED_MODULE_2__/* .getAssetHast */ .j)(value);
        templateFromHTML(node, hast, ++ctx.figureCounter);
      }
    });
  };
}
function templateFromImage(node, count) {
  const alt = getAltText(node.alt || '');
  const slug = (0,lodash_kebabCase_js__WEBPACK_IMPORTED_MODULE_0__["default"])(alt ? alt : `Figure ${count}`);
  // @ts-expect-error
  createFigure(node, slug, node.url, alt, node.data?.width, count);
}
function templateFromHTML(node, hast, count) {
  const children = hast.children;
  const img = children.find(o => o.tagName === 'img');
  const properties = img?.properties || {};
  const src = String(properties.src);
  const alt = getAltText(String(properties.alt));
  const width = properties.width;
  const slug = (0,lodash_kebabCase_js__WEBPACK_IMPORTED_MODULE_0__["default"])(alt ? alt : `Figure ${count}`);
  createFigure(node, slug, src, alt, width, count);
}
function createFigure(node, slug, src, alt, width, count) {
  Object.assign(node, {
    type: 'custom-image',
    data: {
      hName: 'figure',
      hProperties: {
        className: ['img-wrapper'],
        id: slug
      },
      hChildren: [createImage(src, alt, width), createCaption(alt, slug, count)]
    }
  });
}
function createImage(src, alt, width) {
  const image = {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'img-bg'
    },
    children: [{
      type: 'element',
      tagName: 'img',
      properties: {
        src,
        alt
      },
      children: []
    }]
  };
  if (width && /^\d+px/.test(String(width))) {
    image.properties = {
      ...image.properties,
      style: `width: ${width};`
    };
  }
  return image;
}
function createCaption(alt, slug, count) {
  return {
    type: 'element',
    tagName: 'figcaption',
    children: [{
      type: 'element',
      tagName: 'a',
      properties: {
        href: `#${slug}`
      },
      children: createLabel(alt, count)
    }]
  };
}
function createLabel(alt, count) {
  const label = [{
    type: 'element',
    tagName: 'span',
    properties: {
      className: 'caption-count'
    },
    children: [{
      type: 'text',
      value: `Figure ${count}`
    }]
  }];
  if (alt) {
    const elem = label[0];
    const content = elem.children[0];
    content.value += ':';
    label.push({
      type: 'text',
      value: ` ${alt}`
    });
  }
  return label;
}
function getAltText(altText) {
  if (altText.includes('unnamed-chunk')) {
    return '';
  }
  return altText;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1807:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ mdastPhase)
/* harmony export */ });
/* harmony import */ var rehype_autolink_headings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9847);
/* harmony import */ var remark_directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7785);
/* harmony import */ var remark_frontmatter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(222);
/* harmony import */ var remark_gfm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6809);
/* harmony import */ var remark_parse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6688);
/* harmony import */ var rehype_slug__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7752);
/* harmony import */ var unified__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4390);
/* harmony import */ var _latex_directive_to_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4686);
/* harmony import */ var _utils_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1879);
/* harmony import */ var _browser_window__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(719);
/* harmony import */ var _code_blocks__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(8997);
/* harmony import */ var _columns__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(8943);
/* harmony import */ var _embed_asset_url__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(5660);
/* harmony import */ var _gitgraph__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(6945);
/* harmony import */ var _images__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(6365);
/* harmony import */ var _pagebreaks__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(6129);
/* harmony import */ var _remove_empty_paragraphs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(6254);
/* harmony import */ var _styled_terminal__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(7156);
/* harmony import */ var _text_file__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(1863);
/* harmony import */ var _youtube_videos__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(7048);
/* harmony import */ var _code_alias_directive_to_code__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(3021);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([rehype_autolink_headings__WEBPACK_IMPORTED_MODULE_0__, remark_directive__WEBPACK_IMPORTED_MODULE_1__, remark_frontmatter__WEBPACK_IMPORTED_MODULE_2__, remark_gfm__WEBPACK_IMPORTED_MODULE_3__, remark_parse__WEBPACK_IMPORTED_MODULE_4__, rehype_slug__WEBPACK_IMPORTED_MODULE_5__, unified__WEBPACK_IMPORTED_MODULE_6__, _latex_directive_to_svg__WEBPACK_IMPORTED_MODULE_7__, _utils_icons__WEBPACK_IMPORTED_MODULE_8__, _browser_window__WEBPACK_IMPORTED_MODULE_9__, _code_blocks__WEBPACK_IMPORTED_MODULE_10__, _columns__WEBPACK_IMPORTED_MODULE_11__, _embed_asset_url__WEBPACK_IMPORTED_MODULE_12__, _gitgraph__WEBPACK_IMPORTED_MODULE_13__, _images__WEBPACK_IMPORTED_MODULE_14__, _pagebreaks__WEBPACK_IMPORTED_MODULE_15__, _remove_empty_paragraphs__WEBPACK_IMPORTED_MODULE_16__, _styled_terminal__WEBPACK_IMPORTED_MODULE_17__, _text_file__WEBPACK_IMPORTED_MODULE_18__, _youtube_videos__WEBPACK_IMPORTED_MODULE_19__, _code_alias_directive_to_code__WEBPACK_IMPORTED_MODULE_20__]);
([rehype_autolink_headings__WEBPACK_IMPORTED_MODULE_0__, remark_directive__WEBPACK_IMPORTED_MODULE_1__, remark_frontmatter__WEBPACK_IMPORTED_MODULE_2__, remark_gfm__WEBPACK_IMPORTED_MODULE_3__, remark_parse__WEBPACK_IMPORTED_MODULE_4__, rehype_slug__WEBPACK_IMPORTED_MODULE_5__, unified__WEBPACK_IMPORTED_MODULE_6__, _latex_directive_to_svg__WEBPACK_IMPORTED_MODULE_7__, _utils_icons__WEBPACK_IMPORTED_MODULE_8__, _browser_window__WEBPACK_IMPORTED_MODULE_9__, _code_blocks__WEBPACK_IMPORTED_MODULE_10__, _columns__WEBPACK_IMPORTED_MODULE_11__, _embed_asset_url__WEBPACK_IMPORTED_MODULE_12__, _gitgraph__WEBPACK_IMPORTED_MODULE_13__, _images__WEBPACK_IMPORTED_MODULE_14__, _pagebreaks__WEBPACK_IMPORTED_MODULE_15__, _remove_empty_paragraphs__WEBPACK_IMPORTED_MODULE_16__, _styled_terminal__WEBPACK_IMPORTED_MODULE_17__, _text_file__WEBPACK_IMPORTED_MODULE_18__, _youtube_videos__WEBPACK_IMPORTED_MODULE_19__, _code_alias_directive_to_code__WEBPACK_IMPORTED_MODULE_20__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





















async function mdastPhase(file, ctx) {
  // https://github.com/unifiedjs/unified
  // convert markdown to syntax tree: complex transforms
  // should be more robust and straightforward
  const processor = (0,unified__WEBPACK_IMPORTED_MODULE_6__.unified)()
  // third-party plugins:
  .use(remark_parse__WEBPACK_IMPORTED_MODULE_4__["default"]).use(remark_directive__WEBPACK_IMPORTED_MODULE_1__["default"]).use(remark_frontmatter__WEBPACK_IMPORTED_MODULE_2__["default"]).use(remark_gfm__WEBPACK_IMPORTED_MODULE_3__["default"]).use(rehype_slug__WEBPACK_IMPORTED_MODULE_5__["default"]).use(rehype_autolink_headings__WEBPACK_IMPORTED_MODULE_0__["default"], {
    content: (0,_utils_icons__WEBPACK_IMPORTED_MODULE_8__/* .createSvg */ .W)('link-icon'),
    properties: {
      className: 'link'
    }
  })
  // custom plugins:
  .use(() => tree => {}).use(_columns__WEBPACK_IMPORTED_MODULE_11__/* .columns */ .z).use(_embed_asset_url__WEBPACK_IMPORTED_MODULE_12__/* .embedAssetUrl */ .Z, ctx).use(_youtube_videos__WEBPACK_IMPORTED_MODULE_19__/* .youtubeVideos */ .b).use(_code_alias_directive_to_code__WEBPACK_IMPORTED_MODULE_20__/* .aliasDirectiveToCode */ .f, ctx).use(_latex_directive_to_svg__WEBPACK_IMPORTED_MODULE_7__/* .aliasDirectiveToLatexSvg */ .a, ctx).use(_remove_empty_paragraphs__WEBPACK_IMPORTED_MODULE_16__/* .removeEmptyParagraphs */ .j).use(_gitgraph__WEBPACK_IMPORTED_MODULE_13__/* .gitGraph */ .D).use(_text_file__WEBPACK_IMPORTED_MODULE_18__/* .textFile */ .K).use(_browser_window__WEBPACK_IMPORTED_MODULE_9__/* .browserWindow */ .T).use(_code_blocks__WEBPACK_IMPORTED_MODULE_10__/* .codeBlocks */ .r, ctx).use(_styled_terminal__WEBPACK_IMPORTED_MODULE_17__/* .styledTerminal */ .h).use(_images__WEBPACK_IMPORTED_MODULE_14__/* .images */ .W, ctx).use(_pagebreaks__WEBPACK_IMPORTED_MODULE_15__/* .pagebreaks */ .m);
  const parsed = processor.parse(file);
  // @ts-expect-error
  return processor.run(parsed, file);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4921:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: () => (/* binding */ languageSwitcher)
/* harmony export */ });
/* harmony import */ var mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1037);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__]);
([mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


const languages = ['r', 'python'];
const titleCase = ['R', 'Python'];
function languageSwitcher(ctx) {
  const languageFlag = ctx.options.envLanguage;
  if (languageFlag !== undefined && !languages.includes(languageFlag)) {
    throw new Error(`[environment]: envLanguage ${languageFlag} should be one of ${languages}`);
  }
  return tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_1__.visit)(tree, 'containerDirective', node => {
      if (node.name === 'language-switcher') {
        const children = [];
        if (languageFlag === undefined) {
          children.push(processMenu(node));
        }
        children.push(...processChildren(node, languageFlag));
        node.data = {
          hProperties: {
            className: 'language-switcher'
          },
          hChildren: children
        };
      }
    });
  };
}
function processMenu(parent) {
  const children = parent.children;
  return {
    type: 'element',
    tagName: 'ul',
    properties: {},
    children: children.map(node => {
      const element = {
        type: 'element',
        tagName: 'li',
        properties: {
          'data-language': node.name
        },
        children: [{
          type: 'text',
          value: titleCase[languages.indexOf(node.name)]
        }]
      };
      return element;
    })
  };
}
function processChildren(parent, languageFlag) {
  const children = parent.children.map(node => {
    const parent = node;
    if (languages.includes(parent.name)) {
      node.data = {
        hProperties: {
          'data-language': parent.name,
          className: ['language', languageFlag === parent.name ? 'show' : '']
        }
      };
    }
    return node;
  });
  let filtered = children;
  if (languageFlag !== undefined) {
    filtered = filtered.filter(node => {
      const parent = node;
      return languageFlag === parent.name;
    });
  }
  const parentHast = (0,mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__.toHast)({
    type: 'root',
    children: filtered
  });
  return parentHast.children;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3069:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   w: () => (/* binding */ moveAnswersToEnd)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

function moveAnswersToEnd() {
  return tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'containerDirective', (node, _index, _parent) => {
      const index = _index;
      const parent = _parent;

      // remove answer from task rehype
      if (node.name === 'task' && node.data) {
        const children = node.data.hChildren || [];
        const newChildren = children.filter(o => {
          // @ts-expect-error
          return o.name !== 'answer';
        });
        node.data.hChildren = newChildren;
      }
      if (node.name === 'answer') {
        // these nodes have already been moved to the end
        if (node.attributes?.movedToEnd === 'yes') {
          return;
        }

        // remove answer block from task node
        const parentChildren = parent?.children || [];
        parentChildren.splice(index || 0, 1);

        // add to root node
        const treeParent = tree;
        const treeChildren = treeParent.children || [];
        node.attributes = {
          ...(node.attributes || {}),
          movedToEnd: 'yes'
        };
        treeChildren.push(node);
      }
    });
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6129:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ pagebreaks)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

function pagebreaks() {
  return async tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'leafDirective', node => {
      if (node.name === 'pagebreak') {
        node.data = {
          hName: 'hr',
          hProperties: {
            className: 'pagebreak'
          }
        };
      }
    });
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3324:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ programSwitcher)
/* harmony export */ });
/* harmony import */ var mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1037);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__]);
([mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


const programs = ['github-desktop', 'command-line'];
const titleCase = ['GitHub Desktop', 'Command-line'];
function programSwitcher(ctx) {
  const programFlag = ctx.options.envProgram;
  if (programFlag !== undefined && !programs.includes(programFlag)) {
    throw new Error(`[environment]: envProgram ${programFlag} should be one of ${programs}`);
  }
  return tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_1__.visit)(tree, 'containerDirective', node => {
      if (node.name === 'program-switcher') {
        const children = [];
        if (programFlag === undefined) {
          children.push(processMenu(node));
        }
        children.push(...processChildren(node, programFlag));
        node.data = {
          hProperties: {
            className: 'program-switcher'
          },
          hChildren: children
        };
      }
    });
  };
}
function processMenu(parent) {
  const children = parent.children;
  return {
    type: 'element',
    tagName: 'ul',
    properties: {},
    children: children.map(node => {
      const element = {
        type: 'element',
        tagName: 'li',
        properties: {
          'data-program': node.name
        },
        children: [{
          type: 'text',
          value: titleCase[programs.indexOf(node.name)]
        }]
      };
      return element;
    })
  };
}
function processChildren(parent, programFlag) {
  const children = parent.children.map(node => {
    const parent = node;
    if (programs.includes(parent.name)) {
      node.data = {
        hProperties: {
          'data-program': parent.name,
          className: ['program', programFlag === parent.name ? 'show' : '']
        }
      };
    }
    return node;
  });
  let filtered = children;
  if (programFlag !== undefined) {
    filtered = filtered.filter(node => {
      const parent = node;
      return programFlag === parent.name;
    });
  }
  const parentHast = (0,mdast_util_to_hast__WEBPACK_IMPORTED_MODULE_0__.toHast)({
    type: 'root',
    children: filtered
  });
  return parentHast.children;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6254:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: () => (/* binding */ removeEmptyParagraphs)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

function removeEmptyParagraphs() {
  return async tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'paragraph', (node, _index, _parent) => {
      const index = _index;
      const parent = _parent;
      if (node.children.length === 0) {
        const parentChildren = parent?.children || [];
        parentChildren.splice(index || 0, 1);
      }
    });
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7156:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ styledTerminal)
/* harmony export */ });
/* harmony import */ var ansicolor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9742);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ansicolor__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__]);
([ansicolor__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


function styledTerminal() {
  return tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_1__.visit)(tree, 'custom-code', (node, index, parent) => {
      if (node.lang === 'bash') {
        wrapInStyledTerminal(node, index, parent);
      }
    });
  };
}
function wrapInStyledTerminal(code, index, parent) {
  const codeChildren = code.data?.hChildren || [];
  const responseChildren = [];
  const nextIdx = index + 1;
  const nextNode = parent.children[nextIdx];
  if (nextNode && nextNode.type === 'custom-code') {
    const response = nextNode;
    if (response.lang === '{.knitr-output}' || response.lang === '{.knitr-error-output}') {
      const children = response.data?.hChildren || [];
      const responseWithColours = ansiToHast(children);
      responseChildren.push(...responseWithColours);

      // remove response element
      parent.children.splice(nextIdx, 1);
    }
  }
  code.data = {
    hProperties: {
      className: 'terminal'
    },
    hChildren: [...codeChildren, ...responseChildren]
  };
}
function ansiToHast(children) {
  const pre = children[1];
  const code = pre.children[0];
  const text = code.children[0];
  const parsed = ansicolor__WEBPACK_IMPORTED_MODULE_0__["default"].parse(text.value);
  const hast = parsed.spans.map(o => {
    const text = {
      type: 'text',
      value: o.text
    };
    if (!o.color) {
      return text;
    } else {
      return {
        type: 'element',
        tagName: 'span',
        properties: {
          className: [o.color.name || '', o.bold ? 'bold' : '', o.color.bright ? 'bright' : ''].filter(Boolean)
        },
        children: [text]
      };
    }
  });
  code.children = hast;
  return children;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1863:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   K: () => (/* binding */ textFile)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

function textFile() {
  return tree => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'code', node => {
      if (node.lang === 'textfile') {
        createTextFile(node);
      }
    });
  };
}
function createTextFile(node) {
  Object.assign(node, {
    type: 'text-file',
    data: {
      hName: 'div',
      hProperties: {
        className: 'text-file'
      },
      hChildren: [{
        type: 'text',
        value: '\n'
      }, {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'text-file-wrapper'
        },
        children: [{
          type: 'element',
          tagName: 'div',
          properties: {
            className: 'text-file-header'
          },
          children: [{
            type: 'text',
            value: node.meta?.trim() || ''
          }]
        }, {
          type: 'text',
          value: '\n'
        }, {
          type: 'element',
          tagName: 'div',
          properties: {
            className: 'text-file-content'
          },
          children: [{
            type: 'text',
            value: node.value
          }]
        }, {
          type: 'text',
          value: '\n'
        }]
      }]
    }
  });
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7048:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   b: () => (/* binding */ youtubeVideos)
/* harmony export */ });
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6016);
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(343);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([unist_util_visit__WEBPACK_IMPORTED_MODULE_0__]);
unist_util_visit__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


function youtubeVideos() {
  return async (tree, file) => {
    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_0__.visit)(tree, 'leafDirective', node => {
      if (node.name === 'video') {
        const attributes = node.attributes;
        const title = getTitle(node, file);
        node.data = {
          hName: 'a',
          hProperties: {
            className: ['boxout', 'video'],
            href: getYoutubeUrl(attributes?.id || ''),
            title: attributes?.title || null,
            target: '_blank'
          },
          hChildren: [{
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'content'
            },
            children: [{
              type: 'element',
              tagName: 'span',
              properties: {
                className: 'type'
              },
              children: [{
                type: 'text',
                value: 'Video'
              }]
            }, {
              type: 'element',
              tagName: 'span',
              properties: {
                className: 'title'
              },
              children: [{
                type: 'text',
                value: title
              }]
            }, {
              type: 'element',
              tagName: 'span',
              properties: {
                className: 'duration'
              },
              children: [{
                type: 'element',
                tagName: 'strong',
                properties: {},
                children: [{
                  type: 'text',
                  value: 'Duration'
                }]
              }, {
                type: 'text',
                value: formatDuration(attributes?.duration || '')
              }]
            }]
          }, {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'thumbnail'
            },
            children: [{
              type: 'element',
              tagName: 'img',
              properties: {
                src: getYoutubeThumbnailUrl(attributes?.id || ''),
                alt: ''
              },
              children: []
            }]
          }]
        };
      }
    });
  };
}
function getTitle(node, file) {
  const children = node.children;
  const firstChild = children[0];
  const title = firstChild?.value || '';
  if (title.trim() === '') {
    (0,_utils_message__WEBPACK_IMPORTED_MODULE_1__/* .failMessage */ .Ob)(file, 'Video has no title', node.position);
  }
  return title;
}
function getYoutubeUrl(id) {
  return `https://youtu.be/${id}`;
}
function getYoutubeThumbnailUrl(id) {
  return `http://img.youtube.com/vi/${id}/mqdefault.jpg`;
}
function formatDuration(duration = '') {
  const match = duration.match(/^(\d+)m(\d+)s$/);
  if (match === null) {
    return '';
  }
  return `${match[1]}:${match[2].padStart(2, '0')}`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 495:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ convertToPdf)
/* harmony export */ });
/* harmony import */ var puppeteer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5462);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([puppeteer__WEBPACK_IMPORTED_MODULE_0__]);
puppeteer__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


// const footerTemplate = `
//   <div style="font-size: 14px; padding-top: 20px; text-align: center; width: 100%;">
//     Page <span class="pageNumber"></span> of <span class="totalPages"></span>
//   </div>
// `;

async function convertToPdf(html) {
  const browser = await puppeteer__WEBPACK_IMPORTED_MODULE_0__["default"].launch({
    headless: true,
    args: [
    // attempted fix for windows https://stackoverflow.com/questions/59979188#66549119
    '--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote']
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.setContent(html);
  await page.evaluateHandle('document.fonts.ready');
  const pdf = await page.pdf({
    format: 'a4',
    printBackground: true,
    // displayHeaderFooter: true,
    // footerTemplate,
    margin: {
      top: '20px',
      left: '40px',
      right: '40px',
      bottom: '40px'
    }
  });
  await browser.close();
  return pdf;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8275:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ allowNoWhitespaceBeforeHeading)
/* harmony export */ });
function allowNoWhitespaceBeforeHeading(contents) {
  return contents.split('\n').map(line => {
    const match = line.match(/^(#+)(\w)(.*?)$/);
    if (match !== null) {
      return `${match[1]} ${match[2]}${match[3]}`;
    }
    return line;
  }).join('\n');
}

/***/ }),

/***/ 6773:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ convertEmptyMBoxToDirective),
/* harmony export */   u: () => (/* binding */ convertNewPageToDirective)
/* harmony export */ });
const blockList = ['\\newpage', '\\pagebreak'];
function convertNewPageToDirective(contents) {
  return contents.split('\n').map(a => blockList.some(b => a.includes(b)) ? '::pagebreak' : a).join('\n');
}
function convertEmptyMBoxToDirective(contents) {
  return contents.split('\n').map(line => {
    if (line.includes('\\mbox') && line.replace('{', '').replace('}', '').trim() === '\\mbox') {
      return '::pagebreak';
    }
    return line;
  }).join('\n');
}

/***/ }),

/***/ 8938:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ convertTextBfToMd),
/* harmony export */   c: () => (/* binding */ convertUrlToMd)
/* harmony export */ });
function convertTextBfToMd(contents) {
  const pattern = /\\textbf\{(.*?)\}/g;
  return contents.replace(pattern, (_, str) => `**${str}**`);
}
function convertUrlToMd(contents) {
  const pattern = /\\url\{(.*?)\}/g;
  return contents.replace(pattern, (_, str) => str);
}

/***/ }),

/***/ 4120:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ convertMacroToDirective)
/* harmony export */ });
function convertMacroToDirective(contents) {
  return contents.split('\n').map(line => {
    const container = parseCustomContainer(line);
    if (container !== null) {
      return renderContainerDirective(container);
    }
    return line;
  }).join('\n');
}
function parseCustomContainer(line) {
  const match = line.match(/^#{1,6}\s*\[(\D.+)](.*)/);
  if (!Array.isArray(match)) {
    return null;
  }
  const [, attributeStr = '', extra = ''] = match;
  const [name, ...attributesArr] = attributeStr.split(',').map(s => s.trim());
  const title = extra.trim();
  const attributes = transformAttributes(name, attributesArr);
  return {
    name,
    title,
    attributes
  };
}
function renderContainerDirective({
  name,
  title,
  attributes
}) {
  const colons = getColons(name);
  if (name.startsWith('/')) {
    return colons;
  }
  const newTitle = title ? `[${title}]` : '';
  const newAttributes = attributes ? `{${attributes}}` : '';
  return colons + name + newTitle + newAttributes;
}
function getColons(name) {
  switch (name.replace('/', '')) {
    case 'task':
    case 'columns':
      return '::::';
    case 'video':
      return '::';
    default:
      return ':::';
  }
}
function transformAttributes(containerName, attributesArr) {
  return attributesArr.map(attribute => {
    const [key, value] = attribute.split('=').map(s => s.trim());
    if (containerName === 'video' && key === 'videoid') {
      return `id=${value}`;
    }
    return attribute;
  }).join(' ');
}

/***/ }),

/***/ 8534:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ preParsePhase)
/* harmony export */ });
/* harmony import */ var _allow_no_whitespace_before_heading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8275);
/* harmony import */ var _convert_block_tex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6773);
/* harmony import */ var _convert_inline_tex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8938);
/* harmony import */ var _convert_macro_to_directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4120);
/* harmony import */ var _reformat_pandoc_simple_tables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9543);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_reformat_pandoc_simple_tables__WEBPACK_IMPORTED_MODULE_0__]);
_reformat_pandoc_simple_tables__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];






// Some of the original coursework syntax can't easily be parsed by
// existing plugins for unified.js, so in a "pre-parse" phase
// I transform some syntax using regex so it can be parsed.
// A successful generic approach I found is to convert problem syntax to a
// custom markdown directive: https://github.com/remarkjs/remark-directive

function preParsePhase(file) {
  let result = file.value;
  result = removeCommentedSections(result);
  // result = escapeDollarsInCodeBlocks(result);
  result = (0,_allow_no_whitespace_before_heading__WEBPACK_IMPORTED_MODULE_1__/* .allowNoWhitespaceBeforeHeading */ .Q)(result);
  result = (0,_convert_macro_to_directive__WEBPACK_IMPORTED_MODULE_2__/* .convertMacroToDirective */ .W)(result);
  result = (0,_convert_inline_tex__WEBPACK_IMPORTED_MODULE_3__/* .convertTextBfToMd */ ._)(result);
  result = (0,_convert_inline_tex__WEBPACK_IMPORTED_MODULE_3__/* .convertUrlToMd */ .c)(result);
  result = (0,_convert_block_tex__WEBPACK_IMPORTED_MODULE_4__/* .convertNewPageToDirective */ .u)(result);
  result = (0,_convert_block_tex__WEBPACK_IMPORTED_MODULE_4__/* .convertEmptyMBoxToDirective */ .c)(result);
  result = (0,_reformat_pandoc_simple_tables__WEBPACK_IMPORTED_MODULE_0__/* .reformatPandocSimpleTables */ .C)(result);
  file.value = result;
  return file;
}
function removeCommentedSections(md) {
  return md.replace(/<!--[^-][\s\S]*?-->/g, '').replace(/<!---/g, '<!--');
}

// function escapeDollarsInCodeBlocks(md: string) {
//   return md.replace(/(```.+?```)/gms, (match) => {
//     return '\n' + match.replace(/\$/g, '\\$') + '\n';
//   });
// }
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9543:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ reformatPandocSimpleTables)
/* harmony export */ });
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2037);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var markdown_table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4922);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([markdown_table__WEBPACK_IMPORTED_MODULE_1__]);
markdown_table__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


function reformatPandocSimpleTables(contents) {
  const lines = contents.split(os__WEBPACK_IMPORTED_MODULE_0__.EOL);

  // operate on array backwards preserving index in loop,
  // as length may change with transformation
  for (var idx = lines.length - 1; idx >= 0; idx--) {
    if (isValidPandocSimpleTableSeparator(lines, idx)) {
      const {
        startIdx,
        count
      } = getTableBounds(lines, idx);
      const currentLines = lines.slice(startIdx, startIdx + count + 1);
      const newLines = convertLines(currentLines);
      lines.splice(startIdx, count + 1, ...newLines, '');
    }
  }
  return lines.join(os__WEBPACK_IMPORTED_MODULE_0__.EOL);
}
function isValidPandocSimpleTableSeparator(lines, idx, isEnd) {
  const line = lines[idx] || '';
  if (idx === 0 || !/-{2,}/g.test(line) || !/^[\s|-]+$/.test(line)) {
    return false;
  }
  if (getColumnIndexes(line).length <= 1) {
    return false;
  }
  if (!isEnd) {
    const nextLine = lines[idx + 1] || '';
    if (nextLine.trim() === '') {
      return false;
    }
  }
  return true;
}
function getTableBounds(arr, idx) {
  const startIdx = idx - 1;
  const endIdx = arr.slice(startIdx).findIndex(l => l.trim() === '');
  const count = endIdx === -1 ? arr.length - 1 : endIdx;
  return {
    startIdx,
    count
  };
}
function convertLines(lines) {
  const table = parseTable(lines);
  const align = getColumnAlignment(table[0]);
  const result = (0,markdown_table__WEBPACK_IMPORTED_MODULE_1__.markdownTable)(table, {
    align
  });
  return result.split(os__WEBPACK_IMPORTED_MODULE_0__.EOL);
}
function parseTable(lines) {
  const [titles, separator, ...body] = lines;
  const columnIndexes = getColumnIndexes(separator);
  const titleCells = parseTitleRow(titles, columnIndexes);
  const rows = body.map(line => parseBodyRow(line, columnIndexes));
  const endSeparatorIdx = getEndSeparatorIdx(body);
  if (endSeparatorIdx !== -1) {
    return [titleCells, ...rows.slice(0, endSeparatorIdx)];
  }
  const multilineRows = rows.reduce(multilineReducer, []);
  return [titleCells, ...multilineRows];
}
function getColumnIndexes(line) {
  return line.split('').reduce((acc, str, idx) => {
    if (str === '-' && (idx === 0 || line[idx - 1] === ' ')) {
      acc.push([idx]);
    } else if (idx !== line.length - 1 && str === ' ' && line[idx - 1] === '-') {
      acc[acc.length - 1].push(idx);
    }
    return acc;
  }, []);
}
function getColumnAlignment(titleCells) {
  return titleCells.map(title => {
    if (title[0] === ' ') {
      if (title[title.length - 1] === ' ') {
        return 'center';
      }
      return 'right';
    }
    return 'left';
  });
}
function parseTitleRow(line, columnIndexes) {
  return columnIndexes.map(tuple => line.slice(...tuple));
}
function parseBodyRow(line, columnIndexes) {
  return columnIndexes.map(tuple => {
    const end = tuple[1] === undefined ? tuple[1] : tuple[1] + 1;
    return line.slice(tuple[0], end).trim();
  });
}
function getEndSeparatorIdx(lines) {
  for (let idx = lines.length - 1; idx > 0; idx--) {
    const line = lines[idx];
    if (line.trim() !== '') {
      if (isValidPandocSimpleTableSeparator(lines, idx, true)) {
        return idx;
      } else {
        return -1;
      }
    }
  }
  return -1;
}
function multilineReducer(acc, row) {
  if (row.some(cell => cell.trim() === '')) {
    const prevIdx = acc.length - 1;
    acc[prevIdx].forEach((cell, i) => {
      const trimmed = row[i].trim();
      if (trimmed !== '') {
        acc[prevIdx][i] = cell + ' ' + trimmed;
      }
    });
  } else {
    acc.push(row.slice());
  }
  return acc;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 5397:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ cacheToFile)
/* harmony export */ });
/* unused harmony export cacheJsonToFile */
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var hash_sum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2386);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1358);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([hash_sum__WEBPACK_IMPORTED_MODULE_1__, _utils__WEBPACK_IMPORTED_MODULE_2__]);
([hash_sum__WEBPACK_IMPORTED_MODULE_1__, _utils__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



async function cacheToFile(options) {
  const {
    ctx,
    prefix,
    key,
    execFn,
    json
  } = options;
  if (ctx.options.noCache === true) {
    return execFn(key);
  }
  const filePath = `${prefix}-${(0,hash_sum__WEBPACK_IMPORTED_MODULE_1__["default"])(key)}.txt`;
  const cachedFilePath = path__WEBPACK_IMPORTED_MODULE_0___default().join(ctx.cacheDir, filePath);
  const exists = await (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .checkLocalFileExists */ .qd)(cachedFilePath);
  if (exists) {
    const str = await (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .readFile */ .pJ)(cachedFilePath);

    // ignore cache if json is corrupt
    if (json) {
      try {
        return JSON.parse(str);
      } catch (err) {
        return execAndCache(options, cachedFilePath);
      }
    }
    return str;
  }
  return execAndCache(options, cachedFilePath);
}
async function cacheJsonToFile(options) {
  return cacheToFile({
    ...options,
    json: true
  });
}
async function execAndCache({
  ctx,
  key,
  execFn,
  json
}, cachedFilePath) {
  const out = await execFn(key);
  const str = json ? JSON.stringify(out, null, 2) : out;
  await (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .mkdir */ .i$)(ctx.cacheDir);
  await (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .writeFile */ .NC)(cachedFilePath, str);
  return out;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2192:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ checkForLatestVersion)
/* harmony export */ });
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2081);
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7564);
/* harmony import */ var figures__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3952);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([chalk__WEBPACK_IMPORTED_MODULE_1__, figures__WEBPACK_IMPORTED_MODULE_2__]);
([chalk__WEBPACK_IMPORTED_MODULE_1__, figures__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



const repo = 'UofGAnalytics/build-coursework';
async function checkForLatestVersion() {
  if (false) {}
  const currentVersion = "1.1.69";
  try {
    const tags = await listRemoteGitTags();
    const latestTag = parseLatestTag(tags);
    if (latestTag !== currentVersion) {
      console.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow.bold('New version available'));
      console.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow(`Current version: ${currentVersion}`));
      console.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow(`Latest version: ${latestTag}`));
      console.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow(`Run the following command to update:`));
      console.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow(`npm install -g ${repo}`));
      console.log('');
    } else {
      // console.log(chalk.yellow(`Up to date :)`));
    }
  } catch (err) {
    const message = `Can't read latest version from Github`;
    console.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow.bold(`${figures__WEBPACK_IMPORTED_MODULE_2__["default"].warning}  ${message}`));
    console.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow(`Current version: ${currentVersion}`));
    console.log('');
  }
}

// https://stackoverflow.com/questions/10649814#12704727
async function listRemoteGitTags() {
  return new Promise((resolve, reject) => {
    const cmd = `git -c "versionsort.suffix=-" ls-remote --tags --sort="v:refname" "git@github.com:${repo}.git"`;
    (0,child_process__WEBPACK_IMPORTED_MODULE_0__.exec)(cmd, async (err, response, stdErr) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
function parseLatestTag(tags) {
  const lines = tags.trim().split('\n');
  const lastLine = lines[lines.length - 1];
  const match = lastLine.match(/tags\/v(\d+.\d+.\d+)/);
  if (match === null) {
    const message = `can't extract version from line: "${lastLine}"`;
    console.error('[get-latest-version]:', message);
    throw new Error(message);
  }
  return match[1];
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2098:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ createCounter)
/* harmony export */ });
function createCounter() {
  const store = {};
  return {
    increment(key) {
      const value = (store[key] || 0) + 1;
      store[key] = value;
      return value;
    }
  };
}

/***/ }),

/***/ 3609:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: () => (/* binding */ getAssetHast)
/* harmony export */ });
/* harmony import */ var to_vfile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1252);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1358);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([to_vfile__WEBPACK_IMPORTED_MODULE_0__, _utils_utils__WEBPACK_IMPORTED_MODULE_1__]);
([to_vfile__WEBPACK_IMPORTED_MODULE_0__, _utils_utils__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



// export async function getAssetHast(name: string) {
//   const contents = await getAsset(name);
//   const vfile = toVFile({ contents }) as VFile;
//   const parsed = rehypeParser().parse(vfile) as Parent;
//   return parsed.children[0];
// }

function getAssetHast(value) {
  const vfile = (0,to_vfile__WEBPACK_IMPORTED_MODULE_0__.toVFile)({
    value
  });
  const parsed = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__/* .rehypeParser */ .G5)().parse(vfile);
  return parsed.children[0];
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8093:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: () => (/* binding */ getSvgHast)
/* harmony export */ });
/* harmony import */ var hash_sum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2386);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6016);
/* harmony import */ var _get_asset_hast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3609);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([hash_sum__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__, _get_asset_hast__WEBPACK_IMPORTED_MODULE_2__]);
([hash_sum__WEBPACK_IMPORTED_MODULE_0__, unist_util_visit__WEBPACK_IMPORTED_MODULE_1__, _get_asset_hast__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);




// ensure SVG ids will not collide when inlined
function getSvgHast(svg) {
  const svgNode = (0,_get_asset_hast__WEBPACK_IMPORTED_MODULE_2__/* .getAssetHast */ .j)(svg);
  const hash = (0,hash_sum__WEBPACK_IMPORTED_MODULE_0__["default"])(svg);
  (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_1__.visit)(svgNode, 'element', node => {
    if (!node.properties) {
      return;
    }
    if (node.properties.id) {
      node.properties.id = `${node.properties.id}-${hash}`;
    }
    for (const [key, value] of Object.entries(node.properties)) {
      const valueStr = String(value);
      if (isIdRef(valueStr)) {
        node.properties[key] = `${value}-${hash}`;
      } else if (isUrlIdRef(valueStr)) {
        node.properties[key] = `url(${extractUrlIdRef(valueStr)}-${hash})`;
      }
    }
  });
  return svgNode;
}
function isIdRef(value) {
  return !isHexColour(value) && /^#[\w\d\-_]+$/.test(value);
}
function isHexColour(value) {
  return /^#([0-9a-f]{3}){1,2}$/i.test(value);
}
function isUrlIdRef(value) {
  return /^url\(#[\w\d-_]+\)$/.test(value);
}
function extractUrlIdRef(value) {
  const match = value.match(/^url\((#[\w\d-_]+)\)$/);
  return match && match[1];
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1879:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ createDefs),
/* harmony export */   W: () => (/* binding */ createSvg)
/* harmony export */ });
/* harmony import */ var _assets_hamburger_icon_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(757);
/* harmony import */ var _assets_link_icon_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2439);
/* harmony import */ var _get_asset_hast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3609);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_get_asset_hast__WEBPACK_IMPORTED_MODULE_0__]);
_get_asset_hast__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



function getSvgs() {
  return [createStoredSvg('hamburger-icon', _assets_hamburger_icon_svg__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z), createStoredSvg('link-icon', _assets_link_icon_svg__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)];
}
function createSvg(name) {
  const {
    id,
    viewBox
  } = getSvg(name);
  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      className: ['icon', id],
      viewBox
    },
    children: [{
      type: 'element',
      tagName: 'use',
      properties: {
        href: `#${id}`
      },
      children: []
    }]
  };
}
function createDefs() {
  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      style: 'display: none'
    },
    children: [{
      type: 'element',
      tagName: 'defs',
      children: getSvgs().map(createGroup)
    }]
  };
}
function createStoredSvg(id, svg) {
  const hast = (0,_get_asset_hast__WEBPACK_IMPORTED_MODULE_0__/* .getAssetHast */ .j)(svg);
  const children = hast.children;
  const properties = hast.properties || {};
  const viewBox = properties.viewBox;
  return {
    id,
    viewBox,
    children
  };
}
function getSvg(id) {
  const stored = getSvgs().find(o => o.id === id);
  if (stored === undefined) {
    throw new Error(`svg icon not found: ${id}`);
  }
  return stored;
}
function createGroup({
  id,
  children
}) {
  return {
    type: 'element',
    tagName: 'g',
    properties: {
      id
    },
    children
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 343:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KU: () => (/* binding */ warnMessage),
/* harmony export */   Ob: () => (/* binding */ failMessage),
/* harmony export */   ei: () => (/* binding */ infoMessage),
/* harmony export */   rJ: () => (/* binding */ MessageStatus)
/* harmony export */ });
let MessageStatus = /*#__PURE__*/function (MessageStatus) {
  MessageStatus["fail"] = "fail";
  MessageStatus["warning"] = "warning";
  MessageStatus["info"] = "info";
  return MessageStatus;
}({});
function failMessage(file, message, position) {
  const status = MessageStatus.fail;
  return messageWithStatus(file, message, position, status);
}
function warnMessage(file, message, position) {
  const status = MessageStatus.warning;
  return messageWithStatus(file, message, position, status);
}
function infoMessage(file, message, position) {
  const status = MessageStatus.info;
  return messageWithStatus(file, message, position, status);
}
function messageWithStatus(file, message, position, status) {
  // console.log(message);
  const msg = file.message(message, position);
  msg.status = status;
  return msg;
}

/***/ }),

/***/ 1642:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ createTimer)
/* harmony export */ });
function createTimer() {
  const start = process.hrtime();
  return {
    seconds() {
      const hrtime = process.hrtime(start);
      return (hrtime[0] + hrtime[1] / 1e9).toFixed(3);
    }
  };
}

/***/ }),

/***/ 1358:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G5: () => (/* binding */ rehypeParser),
/* harmony export */   N5: () => (/* binding */ getCacheDir),
/* harmony export */   NC: () => (/* binding */ writeFile),
/* harmony export */   Ur: () => (/* binding */ getTemplateDir),
/* harmony export */   gr: () => (/* binding */ rmFile),
/* harmony export */   i$: () => (/* binding */ mkdir),
/* harmony export */   kc: () => (/* binding */ getBuildDir),
/* harmony export */   pJ: () => (/* binding */ readFile),
/* harmony export */   qd: () => (/* binding */ checkLocalFileExists)
/* harmony export */ });
/* unused harmony exports rmdir, combineMdastTrees, inspect */
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var rehype_parse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1345);
/* harmony import */ var rehype_stringify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5390);
/* harmony import */ var unified__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4390);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([rehype_parse__WEBPACK_IMPORTED_MODULE_2__, rehype_stringify__WEBPACK_IMPORTED_MODULE_3__, unified__WEBPACK_IMPORTED_MODULE_4__]);
([rehype_parse__WEBPACK_IMPORTED_MODULE_2__, rehype_stringify__WEBPACK_IMPORTED_MODULE_3__, unified__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





// import { visit } from 'unist-util-visit';

const rehypeParser = (0,unified__WEBPACK_IMPORTED_MODULE_4__.unified)().use(rehype_parse__WEBPACK_IMPORTED_MODULE_2__["default"], {
  fragment: true
}).use(rehype_stringify__WEBPACK_IMPORTED_MODULE_3__["default"]);
function readFile(filePath, encoding = 'utf-8') {
  return fs__WEBPACK_IMPORTED_MODULE_0___default().promises.readFile(filePath, encoding);
}
function writeFile(filePath, value) {
  return fs__WEBPACK_IMPORTED_MODULE_0___default().promises.writeFile(filePath, value);
}
async function checkLocalFileExists(filePath) {
  try {
    await fs__WEBPACK_IMPORTED_MODULE_0___default().promises.access(filePath, (fs__WEBPACK_IMPORTED_MODULE_0___default().constants).F_OK);
    return true;
  } catch (err) {
    return false;
  }
}
async function rmFile(filePath) {
  return fs__WEBPACK_IMPORTED_MODULE_0___default().promises.unlink(filePath);
}
function mkdir(dirPath) {
  return fs__WEBPACK_IMPORTED_MODULE_0___default().promises.mkdir(dirPath, {
    recursive: true
  });
}
function rmdir(dirPath) {
  return fs.promises.rmdir(dirPath, {
    recursive: true
  });
}
function getBuildDir(dirPath) {
  return path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), dirPath, 'build');
}
function getCacheDir(dirPath) {
  return path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), dirPath, 'cache');
}
function getTemplateDir() {
  if (true) {
    return __dirname;
  }
  return path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), 'template', 'build');
}
function combineMdastTrees(mdasts) {
  const children = mdasts.flatMap(mdast => mdast.children || []);
  return {
    type: 'root',
    children
  };
}
function inspect() {
  return tree => {
    console.log(JSON.stringify(tree, null, 2));
    // console.dir(tree, { depth: null });
    // visit(tree, 'leafDirective', (node) => {
    //   console.log('---------------------');
    //   console.dir(node, { depth: null });
    // });
    return tree;
  };
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9114:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 483.08 738.15\" class=\"crest\">\n  <path fill=\"#13385E\"\n    d=\"M477.26 392.43c0 119.82-147.87 251.55-236.25 256.22C143.28 641 5.19 503.76 5.19 393.71V6.19h472.08c-.01 0 .42 223.93-.01 386.24zM18.66 634.45c15.73-8.5 39.97-13.61 53.15-31.89 4.68 18.71-7.23 31.4-6.8 58.62l351.64-.01c2.64-13.83-11.46-40.33-6.35-58.61 13.18 18.28 37 23.39 52.73 31.89 13.61 7.23 14.03 11.06 14.03 34.87v48.48c0 9.36-11.06 14.88-23.81 14.46H27.59c-12.76.43-23.39-5.1-23.39-14.46v-48.48c0-22.96 0-28.06 14.46-34.87z\" />\n  <path fill=\"#9ADAF8\"\n    d=\"M447.72 661.24h-31.5c.27-1.43.58-2.93.89-4.6.01.68.01 1.36 0 2.05 11.48-20.84 2.13-26.36 3.83-36.14 8.93 11.48 22.54 13.18 32.32 18.28 11.89 6.38 19.55 20.41-5.54 20.41zm-83.06-204.65c12.75-12.32 21.67 0 19.12 9.35 0 .42-.42.85-.42 1.27-14.87 42.92-52.26 71.38-95.61 83.71 2.12 4.25 8.5 8.5 15.3 13.17-33.99 5.52-61.19-2.12-73.08-6.37-32.29-1.27-64.16-10.62-89.23-29.32-26.77-14.87-35.69-31.02-47.59-55.66-1.27-2.97-3.82-5.95-6.8-11.05-1.7-3.4-2.12-9.35 6.8-6.37 8.07 2.55 18.27 4.67 21.67.42.42-.85.42-1.27.42-1.7-.42-1.27 2.12-4.25 5.52-2.55 5.95-2.12 9.35-5.95 11.05-8.07 2.97.85 5.95 1.27 9.35 2.55 11.05 4.25 33.14 15.3 38.67 36.97 0-16.15-6.37-25.49-12.75-30.59 26.39.31 49.75 5.74 70.96 11.81v-15.89c6.31 2.82 11.45 6.33 14.87 8.99v11.3c2.29.69 4.56 1.38 6.8 2.06 8.07-.85 26.77-2.55 48.44.42-2.12 2.12-5.1 6.37-6.37 8.92 17.85 1.7 34.84-1.27 52.26-12.75 19.55-12.75-15.3-22.52-15.3-70.54 18.27 15.3 35.27 8.5 49.29 17.42 15.3-8.92 39.09-18.27 63.31-5.95-26.34 8.07-45.89 29.32-60.76 49.29 3.83-16.13-14.87-27.61-25.92-.84zm-237.52 19.55c-2.55 0-4.67 2.12-4.67 4.25 0 2.12 2.12 3.82 4.67 3.82s4.67-1.7 4.67-3.82c0-2.13-2.12-4.25-4.67-4.25zm110.9-307.21h14.87v24.52h-14.87v-24.52zm14.87 250.42h-14.87v-60.12c6.38 2.91 11.53 6.5 14.87 9.13v50.99zm-14.87-147.88c6.46 3 11.62 6.67 14.87 9.28v51.23h-14.87v-60.51zm2.97-141.21s-28.89-15.3-60.34-4.67c-.85-3.4-2.55-11.47-3.82-14.02 21.25-5.52 54.39-1.7 64.59 7.65 10.2-8.92 43.34-12.75 63.74-7.65-1.27 2.55-2.97 10.62-3.82 14.02-31.03-10.63-60.35 4.67-60.35 4.67zm-7.22-24.22c-3.4-2.55-8.5-5.1-15.3-5.95 10.62-20.4 11.47-27.62 14.87-62.46 3.82 2.12 5.95 5.1 8.07 8.92v7.22s-10.19 22.95-7.64 52.27zm-118.98 342.9c-2.55-.85-8.5-2.55-15.3-2.55-5.1 0-9.77-2.97-9.77-4.67.43-.85 1.7-1.7 3.82-1.7 4.67-.85 15.3 0 26.77 1.7-.84 2.55-2.54 5.1-5.52 7.22zM29.86 640.83c9.36-5.1 23.39-6.8 32.32-18.71 1.67 9.59-7.28 14.7 3.2 34.94.17 1.44.42 2.84.78 4.18H35.82c-25.94 0-18.29-14.03-5.96-20.41zm223.05-65.69h-14.87v-6.74c5.45 1.51 10.59 2.5 14.87 3.16v3.58z\" />\n  <path fill=\"#FFF\"\n    d=\"m445.32 712.41-1.56-5.63h-12.13l-1.64 5.63h-8.49l10.83-31.35h10.7l10.82 31.35h-8.53zm-6.58-22c-.12-.53-.46-1.94-1.02-4.24-.61 2.3-.95 3.71-1.09 4.24l-3.14 10.31h8.46l-3.21-10.31zm-26.92 22h-8.52v-23.93h-6.95v-7.42h22.49v7.42h-7.02v23.93zm-28.04-275.79c-1.7-9.35 4.25-26.77 30.17-30.17-12.32 4.25-24.22 17.43-30.17 30.17zm5.95 275.79h-8.63v-31.35h8.63v31.35zm-60.76-200.58c-28.47 7.65-75.63 20.4-145.32 2.97-18.7-4.67-62.46-16.15-80.31-39.09-3.4-4.67-4.67-13.17-4.67-14.45 0-1.7.85-2.55 4.67-1.7 12.32 2.12 14.45-2.55 19.12-7.65 5.52-.85 22.95-3.82 36.97 5.52 15.3 10.2 20.4 25.07 20.4 25.07s5.1-12.75-2.12-22.52c14.02-3.82 38.24 2.12 59.91 10.62 31.87 12.32 56.09 16.57 80.31 12.32s36.97-9.35 45.04-21.25c4.25-6.37 16.57-5.1 13.17 4.67-3.4 9.8-18.7 37.42-47.17 45.49zm-201.83-35.69c-2.55 0-4.67 2.12-4.67 4.25 0 2.12 2.12 3.82 4.67 3.82s4.67-1.7 4.67-3.82c0-2.13-2.12-4.25-4.67-4.25zm232.85-65.86c5.95 14.87 6.8 33.57 6.8 33.57s-14.45-23.37-6.8-33.57zm-15.3-3.83c6.8 10.2 16.57 41.22 16.57 41.22s-21.67-23.37-16.57-41.22zM241.44 111.57V46.56c11.05-21.67 26.77-5.1 54.39-13.6 5.1 22.52 9.77 62.89 11.05 70.11-20.83 5.95-39.1-16.15-65.44 8.5zm-.06-64.93-.01-.21.06.12c-.03.13-.05.28-.08.42.02-.12.03-.24.03-.33zm-1.25 6.7c.2-.91.54-2.45.81-3.85-.21 1.4-.36 2.59-.36 2.59s-.16.44-.45 1.26zm-5.07 393.7c1.12.43 2.22.89 3.27 1.36v16.83c-1.08-.31-2.18-.62-3.27-.92v-17.27zm0-89.03h.1c1.08.43 2.14.88 3.17 1.35v58.98h-3.27v-60.33zm0-87.83c1.13.46 2.21.94 3.27 1.44v60.35h-3.27v-61.79zm0-101.25h3.27v24.52h-3.27v-24.52zm-13.56-68.48c5.23.99 9.32 2.98 12.28 5.05 0 .04 0 .07.01.11-4.3-2.75-8.37-4.34-12.29-5.16zm-45.5 2.62c1.27-7.22 6.37-47.59 11.05-70.11 22.04 6.78 36.49-2.11 47.05 4.8-3.39 34.72-4.25 41.96-14.85 62.31-15.63-2.15-28.8 7.26-43.25 3zm-61.75 609.34h-8.5l-1.55-5.63H92.07l-1.65 5.63h-8.48l10.8-31.35h10.7l10.81 31.35zm-15.06-22c-.14-.53-.51-1.94-1.05-4.24-.57 2.3-.96 3.71-1.1 4.24l-3.17 10.31h8.52l-3.2-10.31zm-31.29-9.35h8.67v31.35H67.9v-31.35zm-24.54 31.35-13.15-31.35h9.05l6.29 17.53c.14.39.48 1.79 1.02 4.22.6-2.44.98-3.83 1.14-4.22l6.14-17.53h9.11l-13.12 31.35h-6.48zm103.14-13.82c.14.39.45 1.79 1.04 4.22.55-2.44.96-3.83 1.08-4.22l6.24-17.53h9.05l-13.11 31.35h-6.49l-13.16-31.35h9.09l6.26 17.53zm41.33-10.63h-10.89v5.44h10.26v6.68h-10.26v5.35h10.89v6.99h-19.19v-31.35h19.19v6.89zm17.28-6.9c4.32 0 7.67.04 10.37 2.13 2.24 1.76 3.47 4.42 3.47 7.68 0 4.83-2.44 7.93-6.99 8.92l8.54 12.63h-9.65l-7.19-12.28v12.28h-8.01v-31.35h8.93c.19-.01.35-.01.53-.01zm-1.46 14.83h1.61c3.56 0 5.28-1.13 5.28-3.92 0-3.27-1.61-4.27-5.18-4.27h-1.72v8.19zm31.12 16.52h-8.64v-31.35h8.64v31.35zm3.57-137.27h-3.27v-7.61c1.1.34 2.19.65 3.27.95v6.66zm25.54 113.33h-7.02v23.93h-8.52v-23.93h-6.98v-7.42h22.52v7.42zm24.14-7.41 10.82 31.35h-8.46l-1.61-5.63h-12.11l-1.6 5.63h-8.52l10.83-31.35h10.65zM287 700.72l-3.2-10.31c-.13-.53-.48-1.94-1.05-4.24-.55 2.3-.97 3.71-1.11 4.24l-3.14 10.31h8.5zm25.9 5.83c2.32 0 3.89-1.35 3.89-3.21 0-2.51-1.73-3.27-5.28-4.18-5.62-1.47-8.37-3.77-8.37-8.63 0-5.83 4.23-10.17 10.79-10.17 3.51 0 6.58.91 9.26 2.79l-2.66 6.12c-1.97-1.65-4.06-2.48-5.99-2.48-2.1 0-3.49 1.14-3.49 2.6 0 2.27 2.2 2.74 5 3.5 5.55 1.48 8.65 3.51 8.65 9.32 0 6.46-4.66 11.02-11.99 11.02-4.43 0-7.78-1.39-11.13-4.6l3.83-6.33c2.53 2.87 5 4.25 7.49 4.25zm45.84-7.96c.12.39.47 1.79 1.01 4.22.59-2.44.99-3.83 1.11-4.22l6.21-17.53h9.09l-13.15 31.35h-6.47l-13.16-31.35h9.08l6.28 17.53z\" />\n  <path fill=\"#0499D6\"\n    d=\"M374.44 472.74c-29.32 72.66-153.82 91.36-228.18 48.44-25.07-5.52-54.81-57.36-45.47-58.21 4.9-.31 13.11 4.46 22.4 10.17-3.06 1.76-4.87 4.93-4.56 8.1.42 4.25 4.67 7.65 9.35 7.22 5.1-.42 8.5-4.25 8.07-8.92-.42-2.3-1.66-4.18-3.31-5.5 6.31 1.3 9.26 5.53 9.26 10.18 12.32 5.95 23.79 9.35 31.44.85 3.82 7.22 10.62 11.05 17.42 13.6 15.72 3.4 44.19 5.95 47.59 1.7-9.35-12.32-28.47-16.15-44.19-19.55-2.97-4.25-2.55-12.32-8.92-17.85 8.92 2.97 9.77 8.5 13.6 12.75 19.55.85 47.17 12.75 50.14 28.89-7.65 2.97-20.82 3.82-33.57 2.55 15.3 3.82 32.72 5.95 50.14 5.52 42.92-1.27 84.13-7.65 105.38-48.01 4.68-8.93 8.08-2.13 3.41 8.07z\" />\n  <path fill=\"#FFCF39\"\n    d=\"M412.25 312.12h-74.36c-7.22 0-8.07 2.55-17 14.87-2.55 2.97-.42 5.95 4.25 6.37 8.5.43 20.82.85 35.27 1.7-2.55-3.82-2.97-8.5-2.12-11.05 4.25-3.4 10.2-3.4 12.75-3.4-5.52 18.27 17 19.97 18.7 2.55.42 1.27.85 7.65-2.97 12.32 10.62 0 22.1.42 33.99.85-14.02.42-25.92.85-36.54 1.27-2.12 1.27-5.1 2.55-9.35 2.55s-7.22-.85-9.77-2.12c-25.92.42-41.22.42-54.39-.42-6.8-.42-5.95-3.82-5.52-8.07.42-2.55 5.95-47.17 9.77-80.31 2.55-19.55 8.07-42.49 24.64-48.01-2.12-6.37-7.65-19.55-10.62-27.62-4.25-10.62 2.12-19.12 15.72-19.12h52.69c3.82 0 8.92 0 13.17 2.55 5.1 2.97 7.65 8.92 5.1 15.3-4.67 12.32-10.62 27.62-11.05 28.89 6.37 2.97 8.07 4.67 11.05 8.5 9.77 11.9 12.32 31.02 13.17 38.24 3.4 27.19 8.07 64.59 8.92 71.81-1.7-4.67-3.4-7.65-25.5-7.65zm-18.27-145.74h-49.29c-5.52 0-4.25 5.1-1.7 10.62 4.25 9.77 7.65 17.85 10.2 23.37h37.39c2.55-5.1 7.65-17 11.05-25.49 3.82-9.78-3.4-8.5-7.65-8.5zM209.99 607.86c1.27-1.7 6.37-6.8 9.35-9.35-2.12-2.55-3.4-5.52-3.4-9.35 0-7.65 6.37-14.02 14.02-14.02h23.79c7.65 0 14.02 6.37 14.02 14.02 0 3.82-1.27 7.22-3.82 9.77l8.92 8.92c-16.98 6.39-47.15 6.81-62.88.01zm43.77-161.46h-23.79c-7.65 0-14.02-6.37-14.02-14.02s6.37-14.02 14.02-14.02h23.79c7.65.42 14.02 6.37 14.02 14.02s-6.37 14.02-14.02 14.02zm-24.22-116.43h23.8c7.65 0 14.02 5.95 14.02 14.02 0 7.65-6.37 14.02-14.02 14.02h-23.8c-7.65 0-14.02-6.37-14.02-14.02 0-7.65 6.37-14.02 14.02-14.02zm24.22-60.34h-23.79c-7.65 0-14.02-6.37-14.02-14.02s6.37-14.02 14.02-14.02h23.79c7.65 0 14.02 6.37 14.02 14.02s-6.37 14.02-14.02 14.02zm-33.57-78.18h42.49v41.64h-42.49v-41.64zm13.6-40.37h15.3v17.85h-15.3v-17.85zm8.07-16.99 7.22 13.17-15.3.42 8.08-13.59zM114.81 455.32c-3.4 1.27-6.8 1.7-9.77.42-2.97-1.27-5.52-3.4-6.8-6.8-.4-.88-.7-1.8-.95-2.74.72.12 1.47.19 2.23.19 1.34 0 2.64.07 3.9.18.48 1.25 1.72 2.83 3.75 3.64 2.12.85 4.25.43 5.1-.42.64-.27 1.27-.64 1.89-1.06.24.07.46.15.65.21 2.97-2.12 4.67-4.67 5.52-7.22l-.81-.12c.82-2.09 1.23-4.16 1.23-5.83 0-4.25-1.7-7.65-4.67-8.92-2.12-.42-4.25 0-5.52.42-2.97 1.27-5.52 4.25-7.22 8.07-.48 1.45-.78 2.97-.9 4.45-2.15-.11-4.08-.14-5.71-.08.18-2.04.68-4.09 1.51-6.07 2.12-5.52 5.95-9.35 10.2-11.47 3.4-1.27 6.8-1.7 9.77 0 7.22 2.97 10.62 12.75 6.8 22.1-2.12 5.1-5.95 9.35-10.2 11.05z\" />\n  <path fill=\"#E2A034\"\n    d=\"M359.99 227.57c-1.7 12.75-1.7 57.79-2.12 76.91-9.35.42-22.1 0-24.64.85 1.7-19.97 2.97-66.71 3.82-80.73.85-14.45 7.65-17.85 17-17.42h31.87c-10.63.84-24.23 6.36-25.93 20.39zm-104.1 15.29h-28.47c0-.85.43-8.92-7.22-9.77h25.07v-41.64h11.47v41.64h5.95c-7.23 1.7-6.8 7.65-6.8 9.77zm-14.03-91.78h4.67v17.85h-4.67v-17.85zm0-16.99 4.67 13.6-4.67-.42v-13.18zm-110.05-29.32c3.82 27.62-18.27 35.69-25.07 36.12-4.67 1.27-2.12 5.95-2.12 5.95 2.12 2.97 3.82 4.25 11.05 8.92 2.12 2.55-2.97 4.25-2.97 4.25s-9.35-8.92-14.02-11.47c-2.12-.85 1.27-3.82-1.27-4.67-.85-.42-9.35-.85-10.62-1.7 16.15-1.7 41.64-15.72 26.34-35.27 11.47 24.64-31.87 32.72-35.27 33.14-12.75 2.12-21.67 15.3-25.92 11.05-4.67 4.67-14.87 5.52-10.62 2.97 3.82-2.55 17.85-14.02 27.62-27.19 21.25-28.89 39.94-31.02 41.22-36.54 2.55-14.45 26.34-19.12 30.59-2.55 2.12.42 5.1 1.27 8.5 4.25-3.4 0-6.8 0-8.92.85-5.54 2.54-8.94 7.21-8.52 11.89zm2.55-18.7c-1.27 0-2.55 1.27-2.55 2.55 0 1.27 1.27 2.55 2.55 2.55 1.27 0 2.55-.85 2.55-2.55s-1.27-2.97-2.55-2.55zm117.7 510.74c-17.42 1.27-25.92-.42-25.92-.42s23.37-2.55 32.29-14.45c2.13 2.55 3.4 14.02-6.37 14.87zm.85-155.09h-26.34s19.97-1.27 32.29-14.45c3.82 2.13 4.25 14.45-5.95 14.45zm0-88.81h-26.34s19.97-1.27 32.29-14.45c3.4 2.13 4.25 14.45-5.95 14.45zm.43-88.38H227s19.97-1.27 32.29-14.45c3.39 2.13 4.24 14.45-5.95 14.45z\" />\n  <path fill=\"#EE422D\" d=\"M132.66 111.14c0 21.25-16.57 28.04-20.82 28.89 1.28-4.67 8.07-26.76 20.82-28.89\" />\n  <path fill=\"#81C341\"\n    d=\"M174.3 274.31s21.25-10.62 23.37-21.25c-6.37-6.37-22.95-6.8-22.95-6.8s19.12-14.45 18.27-24.64c-9.35-4.25-26.34-1.7-26.34-1.7 7.65-10.62 9.77-19.55 9.77-26.77-9.77-1.7-25.07 4.25-25.07 4.25s5.1-18.27 0-27.62c-8.92-2.55-21.67 13.6-21.67 13.6s-4.67-19.97-15.3-30.17c-10.62 10.62-15.3 30.17-15.3 30.17s-12.75-16.15-22.1-13.6c-5.1 9.35 0 27.62 0 27.62s-15.3-5.95-25.07-4.25c-.42 7.65 2.12 16.15 9.77 26.77 0 0-17-2.55-26.34 1.7-.85 10.62 18.27 24.64 18.27 24.64s-16.57.42-22.95 6.8c2.12 10.62 22.95 21.25 22.95 21.25s-12.32 2.55-20.4 11.47c5.1 6.37 15.72 12.75 24.64 14.02-7.22 5.52-11.47 10.2-13.6 14.02 11.9 9.77 37.39 11.05 62.46 3.4 0 4.67 0 43.77-5.95 61.61h25.49c-5.95-17.85-5.95-56.94-5.95-61.61 25.07 7.65 50.56 6.37 62.46-3.4-1.7-3.4-5.95-8.07-13.6-14.02 8.5-1.27 19.55-7.65 24.22-14.02-6.76-8.92-19.08-11.47-19.08-11.47\" />\n  <path fill=\"#07974B\"\n    d=\"M151.36 274.73c2.55-1.27 14.45-5.1 20.82-16.15-6.37-5.95-20.82-6.37-20.82-6.37s13.17-8.5 17.42-21.25c-11.05-3.4-22.52 0-22.52 0s9.35-13.6 10.62-24.64c-10.62 1.27-22.1 6.8-22.1 6.8 3.4-7.22 4.67-17 3.4-25.49-5.1.85-10.2 7.22-13.17 11.05-2.55-8.5-7.22-11.47-10.62-13.17-5.1 7.65-6.37 12.75-5.52 22.95 1.7-1.7 4.67-4.67 8.92-7.22 2.55 14.87-2.55 25.92-2.55 25.92s6.37-4.25 15.3-5.1c.42 8.07-2.55 17-11.47 26.77 0 0 7.65-4.67 16.57-5.1-1.27 11.47-8.5 19.55-15.72 25.92 4.67-2.12 13.17-2.12 19.12-.42-2.97 8.92-9.77 13.17-19.97 18.7 6.37 0 12.75.85 16.15 3.4-4.25 7.65-14.02 11.05-20.82 13.17 15.72 5.95 31.02 8.5 45.89 5.1-.85-4.67-6.8-9.77-13.17-13.6 5.95-1.27 14.87-3.4 22.95-9.77-4.69-5.97-11.06-9.37-18.71-11.5\" />\n  <path fill=\"#fff\" fill-rule=\"evenodd\" class=\"dark-only\"\n    d=\"M483.06 0 .4.05v390.87c-.09 125.7 152.44 256.62 241.01 261.36l.32.02.33-.02c88.59-4.74 241.11-135.66 241.02-261.35L483.06 0zm-12.2 12.23-458.23.05v378.65c-.08 117.34 146.75 244.4 229.1 249.09 82.37-4.69 229.2-131.77 229.12-249.11.5-145.16.09-341.72.01-378.68zM16.27 636.17s3.41-1.95 3.41-1.98c.02 0 2.13-.92 2.22-.98 0 0 5.82-2.63 6.09-2.71 0 0 6.24-2.89 6.2-2.86 13.22-5.57 28.15-11.85 37.64-24.83l1.12-1.53c.25.98.49 1.85.49 1.85.78 3.13 1.17 6.19 1.17 9.14 0 5.78-1.47 11.25-3.04 17.11-1.7 6.31-3.83 14.16-4.19 24.5l-.05 1.63h348.32l-.05-1.63c-.36-10.36-2.48-18.21-4.29-24.9-1.57-5.92-2.91-11.01-2.91-16.7 0-3.12.39-6.09 1.18-9.13 0 0 .26-.98.48-1.83.57.82 1.07 1.5 1.07 1.5 9.51 12.97 24.46 19.26 37.63 24.8 0 0 5.17 2.32 5 2.18 0 0 .49.29.7.42 0 0 8.74 3.94 8.77 3.95 0 0 7.44 4.72 7.61 4.84 7.71 4.68 12.19 10.28 12.19 24.89 0 0-.19 5.98-.19 6.04l.01 8.42-.05 39.39c0 4.68-1.86 8.99-5.42 12.4-5.44 5.31-14.31 8.25-24.36 7.99H30.13c-10.14.26-19.08-2.68-24.5-7.99-3.56-3.47-5.44-7.72-5.44-12.29l-.02-39.19v-8.33L0 665.37c0-16.97 6.46-23.92 16.27-29.2zm46.72 17.15c-2.06-5.06-3.07-9.42-3.07-13.32 0-3.27.63-5.96 1.17-8.31l.21-1.32.8-5.37-3.32 2.95c-5.94 5.31-13.12 8.01-18.97 10.2 0 0-7.6 3.18-7.8 3.28 0 0-2.55 1.3-2.89 1.48-4.16 2.53-7.27 5.84-8.31 8.77l-.56 1.63 1.65.45c4.14 1.15 9.14 1.73 14.88 1.73h27.13l-.92-2.17zm398.9-2.25c-1.04-2.36-3.32-4.9-6.41-7.01 0 0-6-3.26-6.14-3.33 0 0-6.22-2.56-6.28-2.57-5.77-2.21-12.95-4.92-18.87-10.2l-3.24-2.83.7 5.13s.22 1.38.32 1.8c.53 2.41 1.1 4.91 1.1 7.95 0 3.8-1.03 8.16-3.14 13.32l-.91 2.18h27.13c7.68 0 12.34-1.26 14.89-2.3l1.51-.64-.66-1.5zM11.7 664.69s.2 5.36.2 5.24l-.02 8.72.02 39.09c0 1.48.61 2.75 1.86 3.97 3.05 3.06 9.29 4.84 16.24 4.66h423.17c6.84.18 12.97-1.6 15.96-4.62 1.32-1.21 1.96-2.53 1.96-4.09l.01-48.13.4-9.17-2.58 1.56c-5.65 3.45-13.53 5.28-22.77 5.28H36.79c-9.4 0-17.07-1.38-22.79-4.1l-2.38-1.08.08 2.67z\" />\n  </svg>\n");

/***/ }),

/***/ 7407:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg class=\"dag-logo\" viewBox=\"0 0 400.86 89.38\">\n  <style type=\"text/css\">\n    .primary {\n      stroke: none;\n      fill: #000;\n    }\n\n    .thistle {\n      stroke: none;\n      fill: #951272;\n    }\n\n    .leaf {\n      stroke: none;\n      fill: #00843D;\n    }\n  </style>\n  <path class=\"thistle\" d=\"M302.62,13.21h7.4v18.85c-2.32-1.43-4.78-2.54-7.4-3.33V13.21z M292.84,6.13h7.4v21.97\n\tc-2.35-0.53-4.82-0.82-7.4-0.87V6.13z M283.03,0.65h7.4v26.59c-2.58,0.09-5.05,0.43-7.4,1.01V0.65z M273.18,7.77h7.4v21.18\n\tc-2.62,0.86-5.08,2.03-7.4,3.53V7.77z\" />\n  <path class=\"leaf\" d=\"M276.84,76.99c1.32,1.33,2.75,2.44,4.31,3.33l-2.58,6.17c-2.48-1.27-4.79-2.93-6.9-4.99\n\tc-4.71-4.65-7.4-10.32-8.07-17.01h7.45C271.64,69.52,273.57,73.69,276.84,76.99z M291.95,83.02c1.75,0,3.4-0.17,4.97-0.5l2.56,6.13\n\tc-2.37,0.59-4.88,0.89-7.53,0.89c-2.81,0-5.47-0.34-7.97-1l2.55-6.12C288.24,82.83,290.04,83.02,291.95,83.02z M312.69,64.48h7.54\n\tc-0.67,6.74-3.36,12.41-8.07,17.01c-2.2,2.16-4.61,3.88-7.23,5.17l-2.57-6.15c1.68-0.92,3.22-2.1,4.63-3.53\n\tC310.21,73.69,312.11,69.52,312.69,64.48z\" />\n  <path class=\"primary\" d=\"M383.68,88.98h-8.24l-12.6-45.04l-13.5,45.04l-8.16,0.08l-15.84-55.82h7.76l12.44,47.38l13.57-47.38h8.08\n\tl12.52,47.22l13.17-47.22h7.76L383.68,88.98z M306.98,45.22c-3.94-4.02-8.97-6.03-15.11-6.03c-6.09,0-11.12,2.01-15.11,6.03\n\tc-3.45,3.49-5.39,7.99-5.81,13.5h-7.44c0.48-7.21,3.19-13.21,8.15-18.01c5.49-5.36,12.25-8.04,20.28-8.04\n\tc8.03,0,14.76,2.68,20.2,8.04c4.97,4.8,7.68,10.8,8.16,18.01h-7.52C312.37,53.21,310.44,48.7,306.98,45.22z M228.65,89.46\n\tc-7.7,0-14.3-2.68-19.8-8.04c-5.49-5.36-8.24-12.15-8.24-20.35c0-8.26,2.75-15.04,8.24-20.35c5.49-5.36,12.25-8.04,20.28-8.04\n\tc5.82,0,10.99,1.37,15.51,4.1c4.58,2.73,7.95,6.68,10.1,11.82h-8.89c-3.34-6.27-8.92-9.41-16.73-9.41c-6.09,0-11.12,2.01-15.11,6.03\n\tc-3.93,3.97-5.9,9.25-5.9,15.84c0,6.6,1.97,11.91,5.9,15.92c3.99,4.02,8.92,6.03,14.79,6.03c5.93,0,10.67-1.66,14.22-4.99\n\tc3.61-3.32,5.71-7.83,6.3-13.51h-23.11v-5.79h30.87v5.79c-0.75,7.19-3.74,13.14-8.97,17.86C242.9,87.1,236.41,89.46,228.65,89.46z\n\t M246.82,9.84c0.7,0.26,1.48,0.48,2.34,0.67c0.88,0.19,1.74,0.42,2.59,0.67c0.88,0.23,1.66,0.54,2.37,0.93\n\tc0.71,0.38,1.28,0.95,1.73,1.72c0.45,0.77,0.67,1.71,0.67,2.84c0,1.72-0.66,3.22-1.98,4.49c-1.32,1.28-3.11,1.91-5.38,1.91\n\tc-2.24,0-4.07-0.51-5.47-1.53c-1.41-1.04-2.11-2.45-2.11-4.21h3.11c0.09,1,0.48,1.81,1.18,2.42c0.73,0.61,1.79,0.92,3.2,0.92\n\tc1.41,0,2.53-0.36,3.36-1.08c0.83-0.72,1.25-1.56,1.25-2.52c0-0.98-0.23-1.72-0.67-2.23c-0.45-0.53-1.02-0.92-1.73-1.18\n\tc-0.7-0.25-1.49-0.47-2.37-0.64c-0.85-0.19-1.72-0.41-2.59-0.67c-0.86-0.25-1.63-0.57-2.34-0.96c-0.71-0.4-1.28-0.98-1.73-1.75\n\tc-0.45-0.79-0.67-1.75-0.67-2.9c0-1.87,0.66-3.36,1.98-4.49c1.34-1.15,3.08-1.72,5.22-1.72c2.16,0,3.87,0.5,5.12,1.5\n\tc1.28,0.98,2.02,2.34,2.21,4.08h-3.23c-0.09-0.87-0.5-1.61-1.25-2.23c-0.72-0.62-1.72-0.92-2.97-0.92c-1.24,0-2.25,0.32-3.04,0.95\n\tc-0.79,0.62-1.18,1.53-1.18,2.74c0,0.8,0.23,1.47,0.67,2.01C245.54,9.19,246.11,9.58,246.82,9.84z M227.31,20.48\n\tc1.47,0,2.79-0.32,3.94-0.96c1.15-0.66,2.05-1.59,2.69-2.8h3.52c-0.86,2.04-2.19,3.6-4,4.68c-1.79,1.08-3.84,1.63-6.15,1.63\n\tc-3.18,0-5.86-1.07-8.03-3.19c-2.18-2.12-3.27-4.81-3.27-8.06c0-3.27,1.09-5.96,3.27-8.06c2.18-2.12,4.85-3.19,8.03-3.19\n\tc2.31,0,4.35,0.54,6.15,1.63c1.81,1.08,3.15,2.64,4,4.68h-3.52c-1.32-2.49-3.53-3.73-6.63-3.73c-2.41,0-4.41,0.79-5.99,2.39\n\tc-1.56,1.57-2.34,3.66-2.34,6.28s0.78,4.71,2.34,6.31C222.9,19.68,224.9,20.48,227.31,20.48z M209.47,0.75h2.91v22.08h-2.91V0.75z\n\t M199.75,22.83h-2.92V3.08h-5.86V0.75h14.63v2.33h-5.86V22.83z M181.87,22.83h-2.91v-8.35l-7.24-13.73h3.2l5.47,11.06l5.44-11.06\n\th3.24l-7.21,13.73V22.83z M159.89,0.75h2.91v19.85h7.78v2.23h-10.69V0.75z M172.99,32.67c5.44,0,9.75,1.26,12.93,3.78\n\tc3.24,2.47,5.09,5.9,5.58,10.29h-8.16c-0.22-2.2-1.27-4.07-3.15-5.63c-1.83-1.56-4.33-2.33-7.51-2.33c-3.12,0-5.68,0.81-7.67,2.42\n\tC163,42.75,162,45.06,162,48.11c0,2.04,0.56,3.73,1.7,5.07c1.13,1.34,2.59,2.33,4.37,2.98c1.77,0.64,3.74,1.21,5.9,1.69\n\tc2.21,0.48,4.39,1.05,6.55,1.69c2.21,0.59,4.2,1.37,5.98,2.33c1.78,0.96,3.23,2.41,4.36,4.34c1.13,1.93,1.7,4.31,1.7,7.16\n\tc0,4.34-1.67,8.12-5.01,11.34c-3.34,3.22-7.87,4.82-13.57,4.82c-5.65,0-10.26-1.29-13.82-3.86c-3.56-2.63-5.33-6.17-5.33-10.62h7.84\n\tc0.21,2.52,1.21,4.56,2.99,6.11c1.83,1.56,4.52,2.33,8.08,2.33c3.56,0,6.39-0.91,8.48-2.73c2.1-1.82,3.15-3.94,3.15-6.35\n\tc0-2.47-0.57-4.34-1.7-5.63c-1.13-1.34-2.58-2.33-4.36-2.98c-1.78-0.64-3.77-1.18-5.98-1.61c-2.16-0.48-4.34-1.05-6.55-1.69\n\tc-2.16-0.64-4.12-1.45-5.9-2.41c-1.78-1.02-3.23-2.49-4.36-4.42c-1.13-1.98-1.7-4.43-1.7-7.32c0-4.72,1.67-8.5,5.01-11.34\n\tC163.21,34.12,167.6,32.67,172.99,32.67z M151.33,17.99h-9.86l-1.73,4.84h-2.98l8.07-22.08h3.2l8.03,22.08h-3.01L151.33,17.99z\n\t M146.4,4.29l-4.1,11.4h8.19L146.4,4.29z M118.35,5.31v17.52h-2.91V0.75h2.91l11.72,17.53V0.75h2.91v22.08h-2.91L118.35,5.31z\n\t M106.88,17.99h-9.86l-1.73,4.84h-2.98l8.06-22.08h3.2l8.03,22.08h-3.01L106.88,17.99z M101.95,4.29l-4.1,11.4h8.19L101.95,4.29z\n\t M75.12,17.99h-9.86l-1.73,4.84h-2.98l8.06-22.08h3.2l8.03,22.08h-3.01L75.12,17.99z M70.19,4.29l-4.1,11.4h8.19L70.19,4.29z\n\t M51.82,22.83h-2.92V3.08h-5.86V0.75h14.63v2.33h-5.86V22.83z M35.48,17.99h-9.86l-1.73,4.84h-2.98l8.06-22.08h3.2l8.03,22.08h-3.01\n\tL35.48,17.99z M30.55,4.29l-4.1,11.4h8.19L30.55,4.29z M6.66,22.83h-7.01V0.75h7.01c3.59,0,6.41,1,8.48,3\n\tc2.07,2,3.11,4.72,3.11,8.16c0,3.44-1.04,6.13-3.11,8.06C13.07,21.88,10.25,22.83,6.66,22.83z M13.06,5.5\n\tc-1.47-1.53-3.61-2.29-6.4-2.29h-4.1v17.4h4.1c2.79,0,4.93-0.77,6.4-2.29c1.47-1.53,2.21-3.66,2.21-6.4\n\tC15.27,9.17,14.53,7.03,13.06,5.5z M28.23,32.67c5.82,0,10.99,1.37,15.51,4.1c4.58,2.73,7.95,6.68,10.1,11.82h-8.89\n\tc-3.34-6.27-8.91-9.41-16.72-9.41c-6.09,0-11.12,2.01-15.11,6.03c-3.93,3.97-5.9,9.25-5.9,15.84c0,6.6,1.97,11.91,5.9,15.92\n\tc3.99,4.02,8.92,6.03,14.79,6.03c5.93,0,10.67-1.66,14.22-4.99c3.61-3.32,5.71-7.83,6.3-13.51H25.32v-5.79h30.87v5.79\n\tc-0.75,7.19-3.74,13.14-8.97,17.86C42,87.1,35.51,89.46,27.75,89.46c-7.71,0-14.3-2.68-19.8-8.04c-5.5-5.36-8.24-12.15-8.24-20.35\n\tc0-8.26,2.75-15.04,8.24-20.35C13.45,35.35,20.21,32.67,28.23,32.67z M72.79,83.34h19.64v5.63H65.43V33.23h7.35V83.34z\n\t M126.09,33.23l20.28,55.74h-7.59l-4.36-12.23h-24.89l-4.36,12.23h-7.51l20.36-55.74H126.09z M132.31,70.96l-10.34-28.8l-10.34,28.8\n\tH132.31z\" />\n</svg>\n");

/***/ }),

/***/ 757:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"448\" height=\"392\" viewBox=\"0 0 448 392\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill-rule: evenodd;\n      }\n    </style>\n  </defs>\n  <path id=\"Color_Fill_1\" data-name=\"Color Fill 1\" class=\"cls-1\" d=\"M16,62H432a15.8,15.8,0,0,0,16-16V16A15.8,15.8,0,0,0,432,0H16A15.8,15.8,0,0,0,0,16V46A15.8,15.8,0,0,0,16,62Zm0,165H432a15.8,15.8,0,0,0,16-16V181a15.8,15.8,0,0,0-16-16H16A15.8,15.8,0,0,0,0,181v30A15.8,15.8,0,0,0,16,227Zm0,165H432a15.8,15.8,0,0,0,16-16V346a15.8,15.8,0,0,0-16-16H16A15.8,15.8,0,0,0,0,346v30A15.8,15.8,0,0,0,16,392Z\"/>\n</svg>\n");

/***/ }),

/***/ 934:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg class=\"hexagons\" viewBox=\"0 0 390.67 299.33\">\n  <style type=\"text/css\">\n    .hex {\n      fill: none;\n      stroke: #000;\n    }\n\n    .hex-logo {\n      stroke: none;\n      fill: #000;\n    }\n\n    .active .hex {\n      stroke: none;\n      fill: #000;\n    }\n\n    .active .hex-logo {\n      fill: #fff;\n    }\n  </style>\n\n  <!-- PSM -->\n  <g class=\"STATS5077\">\n    <path class=\"hex\" d=\"M3.76,128.98l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L3.76,128.98z\" />\n    <path class=\"hex-logo\" d=\"M23.1,142.78v-1.51h0.59c8.03,0,12.84-10.72,16.7-19.33c3.01-6.72,5.4-12.03,8.75-12.03\n    c2.98,0,5.17,4.98,7.94,11.28c3.94,8.95,8.85,20.09,17.51,20.09h0.59v1.51H23.1z M57.67,125.39L57.6,141.6h12.73\n    C64.6,139.21,60.78,132.19,57.67,125.39z\" />\n  </g>\n\n  <!-- R -->\n  <g class=\"STATS5078\">\n    <path class=\"hex\" d=\"M76.48,87.22l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L76.48,87.22z\" />\n    <path class=\"hex-logo\" d=\"M136.56,96.71l5.28,8.89l-8.76,0l-3.15-5.9c-1.71,0.51-3.53,0.88-5.43,1.09v4.81l-7.75,0v-4.84\n    c-10.64-1.27-18.73-7.49-18.73-14.97c0-8.4,10.18-15.21,22.73-15.21c12.55,0,22.73,6.81,22.73,15.21\n    C143.48,90.07,140.82,93.94,136.56,96.71z M131.44,87.7c0-2.25-2.18-2.13-2.18-2.13l-4.69,0l0,4.35h4.7\n    C129.26,89.91,131.44,89.9,131.44,87.7z M128.46,97.09c-0.27-0.4-0.59-0.83-0.83-1.03c-0.43-0.35-0.62-0.47-1.04-0.47\n    c-0.29,0-2.08,0-2.08,0v1.73C125.88,97.31,127.2,97.23,128.46,97.09z M124.23,76.52c-9.54,0-17.28,4.66-17.28,10.4\n    c0,4.13,4,7.7,9.8,9.38V80.02h15.57c0,0,7.09,0.13,7.09,6.87c0,6.74-6.78,7.24-6.78,7.24s1.38,0.41,2.18,0.82\n    c0.13,0.07,0.31,0.17,0.5,0.29c3.43-1.68,5.51-4.4,5.51-8.33C140.81,79.7,133.77,76.52,124.23,76.52z\" />\n  </g>\n\n  <!-- LFD -->\n  <g class=\"STATS5075\">\n    <path class=\"hex\" d=\"M149.68,44.98l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L149.68,44.98z\" />\n    <path class=\"hex-logo\" d=\"M199.59,54.99c-0.45-0.57-0.49-2.25-0.07-2.89c0.16-0.23,0.27-0.28,0.63-0.25c0.37,0.03,0.48,0.1,0.65,0.46\n    c0.24,0.48,0.29,1.79,0.08,2.38C200.65,55.35,199.99,55.5,199.59,54.99z M198.67,25.3c-0.26,0.51-0.66,0.62-1.11,0.31\n    c-0.52-0.36-0.64-2.12-0.2-2.96c0.31-0.6,1-0.59,1.31,0.02C198.91,23.13,198.91,24.84,198.67,25.3z M208.14,40.76\n    c-0.44,1.37-1.51,3.46-1.73,3.4c-0.1-0.02-0.36-0.1-0.6-0.17c-0.34-0.09-0.52-0.08-0.86,0.09c-0.63,0.3-0.86,0.85-0.88,2.1\n    c-0.02,1-0.02,1.02-0.45,1.39c-0.38,0.33-0.5,0.37-0.95,0.31l-0.52-0.07l-0.03-1.89l-0.04-1.89l-0.33,0c-0.18,0-0.53,0.03-0.78,0.07\n    c-0.37,0.06-0.45,0.12-0.45,0.35c0,0.25,0.04,0.27,0.39,0.21c0.21-0.04,0.45-0.08,0.51-0.09c0.07-0.01,0.12,0.6,0.12,1.6v1.62\n    l-0.45,0.04c-0.35,0.03-0.45,0.09-0.45,0.27c0,0.21,0.09,0.23,0.98,0.23h0.99l-0.41,0.3c-0.23,0.17-0.45,0.4-0.5,0.51\n    c-0.04,0.11-0.09,0.99-0.09,1.94c-0.02,1.66-0.02,1.71-0.18,1.26c-0.25-0.69-0.67-1.02-1.34-1.02c-0.75,0-1.17,0.43-1.36,1.37\n    c-0.35,1.68,0.36,3.17,1.44,3.04c0.23-0.03,0.53-0.09,0.66-0.15c0.47-0.19-0.59,0.79-1.2,1.12l-0.6,0.32l-5.16,0.02\n    c-4.97,0.03-5.19,0.02-5.8-0.22c-0.69-0.27-1.7-1.14-1.7-1.46c0-0.11-0.05-0.2-0.11-0.2c-0.06,0-0.2-0.25-0.3-0.56\n    c-0.15-0.44-0.19-1.08-0.19-2.93c0-1.3-0.03-2.45-0.07-2.54c-0.04-0.1-0.58-0.57-1.2-1.05l-1.13-0.88v-3.22l-0.73,0.07\n    c-0.86,0.09-0.95,0.13-0.95,0.45c0,0.24,0.09,0.24,0.87,0.03c0.19-0.05,0.21,0.05,0.21,1l0,1.06l-0.48-0.54\n    c-0.75-0.84-1.73-2.36-2.26-3.48c-0.68-1.44-0.69-1.51-0.31-1.7c0.49-0.24,0.76-0.68,0.88-1.45c0.21-1.3-0.22-2.63-0.91-2.8\n    c-0.16-0.04-0.49-0.05-0.73-0.02l-0.44,0.05l0.07-1.39c0.04-0.77,0.11-1.48,0.15-1.6c0.07-0.17,0.23-0.21,0.91-0.21\n    c0.64,0,0.83-0.04,0.83-0.17c0-0.11-0.16-0.19-0.45-0.21l-0.45-0.04l-0.04-1.08c-0.03-0.93,0-1.19,0.28-1.89\n    c0.34-0.88,1.34-2.54,2.04-3.39l0.44-0.54h1.01c0.93,0,1-0.02,1-0.24c0-0.2-0.08-0.24-0.48-0.24c-0.42,0-0.48-0.03-0.48-0.28\n    c0-0.16,0.17-0.43,0.39-0.64c0.48-0.45,1.36-1.12,1.46-1.12c0.04,0,0.07,0.31,0.07,0.69c0,0.9,0.28,1.46,0.89,1.76\n    c0.43,0.21,0.52,0.21,0.96,0.06c0.7-0.24,1.03-0.92,1.03-2.12c0-0.52-0.07-1.06-0.18-1.32c-0.1-0.24-0.14-0.48-0.09-0.52\n    c0.18-0.16,1.41-0.56,2.56-0.84c0.95-0.23,1.48-0.28,3.18-0.28c2.05-0.01,3.3,0.16,4.48,0.59l0.44,0.16l-0.55,0.01\n    c-1.04,0.02-1.43,0.62-1.43,2.19c0,1.24,0.22,1.74,0.89,2.07c0.43,0.21,0.51,0.21,0.96,0.06c0.7-0.24,1.03-0.92,1.03-2.12\n    c0-0.96-0.18-1.53-0.62-1.95l-0.28-0.27l0.3,0.09c0.51,0.15,2.32,1.02,2.55,1.22c0.18,0.16,0.22,0.39,0.22,1.38v1.18h-0.48\n    c-0.4,0-0.48,0.04-0.48,0.24c0,0.22,0.08,0.24,1.2,0.24c1.12,0,1.2-0.02,1.2-0.24c0-0.2-0.08-0.24-0.48-0.24h-0.48v-1.02\n    c0-0.56,0.03-1.02,0.07-1.02c0.16,0,1.11,0.73,1.59,1.22c2.24,2.27,2.61,2.75,3.5,4.51c1.09,2.17,1.58,4.29,1.58,6.8\n    C208.83,37.91,208.63,39.22,208.14,40.76z M183.6,29.32c-1.38-0.71-2.46,0.82-2.03,2.89c0.2,0.95,0.62,1.38,1.34,1.38\n    c0.29,0,0.64-0.09,0.79-0.19c0.49-0.35,0.68-0.87,0.68-1.97C184.39,30.25,184.15,29.61,183.6,29.32z M182.91,36.58\n    c-0.71,0-1.15,0.43-1.35,1.34c-0.28,1.26,0.09,2.57,0.85,2.94c0.39,0.2,0.66,0.19,1.14-0.03c0.61-0.29,0.84-0.87,0.83-2.09\n    C184.37,37.21,183.95,36.58,182.91,36.58z M199.33,48.1c0-0.2-0.08-0.24-0.48-0.24h-0.48v-3.84l-0.33,0c-0.18,0-0.53,0.03-0.78,0.07\n    c-0.37,0.06-0.45,0.12-0.45,0.36c0,0.28,0.13,0.3,0.81,0.09c0.12-0.03,0.15,0.34,0.15,1.63v1.68h-0.48c-0.32,0-0.48,0.05-0.48,0.16\n    c0,0.29,0.15,0.32,1.34,0.32C199.25,48.34,199.33,48.32,199.33,48.1z M189.85,40.42c-0.4,0-0.48,0.04-0.48,0.24\n    c0,0.23,0.08,0.24,1.2,0.24c1.12,0,1.2-0.02,1.2-0.24c0-0.2-0.08-0.24-0.48-0.24h-0.48v-3.87l-0.6,0.08\n    c-0.81,0.11-0.96,0.18-0.96,0.45c0,0.21,0.05,0.23,0.54,0.15l0.54-0.08v3.27H189.85z M191.32,47.84l-0.45-0.04l-0.03-1.89\n    l-0.04-1.89l-0.32,0c-0.18,0-0.53,0.03-0.78,0.07c-0.37,0.06-0.45,0.12-0.45,0.35c0,0.25,0.04,0.27,0.39,0.21\n    c0.21-0.04,0.44-0.08,0.51-0.09c0.07-0.01,0.12,0.6,0.12,1.6v1.62l-0.45,0.04c-0.36,0.03-0.45,0.09-0.45,0.27\n    c0,0.21,0.09,0.23,1.2,0.23c1.11,0,1.2-0.01,1.2-0.23C191.77,47.92,191.67,47.87,191.32,47.84z M187.6,33.08l-0.45-0.04l-0.03-1.89\n    l-0.04-1.89h-0.4c-0.81,0-1.15,0.13-1.15,0.43c0,0.17,0.06,0.26,0.15,0.23c0.08-0.02,0.3-0.08,0.48-0.12l0.33-0.07v3.37h-0.48\n    c-0.35,0-0.48,0.05-0.48,0.18c0,0.15,0.22,0.18,1.26,0.18c1.02,0,1.26-0.04,1.26-0.17C188.05,33.18,187.89,33.11,187.6,33.08z\n    M187.57,40.42h-0.48v-3.87l-0.6,0.08c-0.82,0.11-0.96,0.18-0.96,0.46c0,0.21,0.06,0.23,0.48,0.16l0.48-0.08v3.26h-0.48\n    c-0.4,0-0.48,0.04-0.48,0.24c0,0.23,0.08,0.24,1.26,0.24c1.18,0,1.26-0.02,1.26-0.24C188.05,40.46,187.97,40.42,187.57,40.42z\n    M187.57,47.86h-0.48v-3.84l-0.33,0c-0.18,0-0.53,0.03-0.78,0.07c-0.38,0.06-0.45,0.12-0.45,0.36c0,0.28,0.13,0.3,0.81,0.09\n    c0.11-0.03,0.15,0.34,0.15,1.63v1.68h-0.48c-0.32,0-0.48,0.05-0.48,0.16c0,0.29,0.14,0.32,1.34,0.32c1.1,0,1.18-0.01,1.18-0.24\n    C188.05,47.9,187.97,47.86,187.57,47.86z M187.92,51.71c-0.41,0.43-0.54,0.96-0.52,2.04c0.03,1.58,0.98,2.42,2.09,1.85\n    c0.48-0.25,0.74-0.81,0.81-1.73c0.07-0.98-0.13-1.74-0.57-2.18c-0.28-0.28-0.45-0.34-0.9-0.34\n    C188.36,51.34,188.21,51.4,187.92,51.71z M191.29,25.67h-0.48V21.8l-0.6,0.08c-0.81,0.11-0.96,0.18-0.96,0.44\n    c0,0.19,0.07,0.21,0.54,0.15l0.54-0.07v3.27h-0.48c-0.4,0-0.48,0.04-0.48,0.24c0,0.22,0.08,0.24,1.2,0.24c1.12,0,1.2-0.02,1.2-0.24\n    C191.77,25.71,191.69,25.67,191.29,25.67z M191.26,29.44c-0.32-0.27-0.46-0.31-0.92-0.26c-0.91,0.1-1.33,0.84-1.33,2.3\n    c0,0.82,0.31,1.6,0.73,1.91c0.33,0.23,0.93,0.25,1.37,0.05c0.5-0.23,0.79-0.94,0.8-1.95C191.93,30.43,191.74,29.84,191.26,29.44z\n    M191.79,51.64c-0.5,0.43-0.66,0.98-0.59,2.18c0.06,1.08,0.25,1.51,0.83,1.82c0.4,0.21,1.15,0.1,1.5-0.23\n    c0.16-0.15,0.34-0.46,0.41-0.7c0.17-0.62,0.15-1.99-0.05-2.45C193.51,51.35,192.49,51.05,191.79,51.64z M193.33,48\n    c0.27,0.27,0.45,0.34,0.86,0.34c0.29,0,0.64-0.08,0.79-0.19c0.49-0.34,0.67-0.87,0.68-1.97c0-0.77-0.05-1.13-0.23-1.48\n    c-0.43-0.86-1.49-1.02-2.16-0.33C192.56,45.12,192.59,47.26,193.33,48z M193.69,40.87c0.39,0.2,0.66,0.19,1.14-0.03\n    c0.61-0.29,0.84-0.87,0.83-2.09c-0.01-1.53-0.43-2.16-1.47-2.16c-0.71,0-1.14,0.43-1.34,1.34\n    C192.57,39.18,192.94,40.49,193.69,40.87z M194.03,31.4l-0.04,1.64l-0.45,0.04c-0.29,0.02-0.45,0.1-0.45,0.21\n    c0,0.14,0.24,0.17,1.26,0.17c1.04,0,1.26-0.03,1.26-0.18c0-0.13-0.13-0.18-0.48-0.18h-0.48v-3.84l-0.51,0.01\n    c-0.77,0.02-1.11,0.14-1.11,0.41c0,0.25,0.01,0.25,0.63,0.13l0.39-0.08L194.03,31.4z M195.69,23.66c-0.12-1.27-0.57-1.83-1.46-1.83\n    c-1,0-1.43,0.65-1.43,2.16c0,1.05,0.15,1.53,0.61,1.94c0.49,0.44,1.27,0.37,1.75-0.14C195.59,25.32,195.78,24.58,195.69,23.66z\n    M195.74,51.47c-0.48,0.1-0.61,0.18-0.61,0.37c0,0.22,0.05,0.24,0.54,0.16l0.54-0.08v3.25h-0.48c-0.4,0-0.48,0.04-0.48,0.24\n    c0,0.22,0.08,0.24,1.2,0.24c1.12,0,1.2-0.01,1.2-0.24c0-0.2-0.08-0.24-0.48-0.24h-0.48v-1.92\n    C196.69,51.11,196.76,51.25,195.74,51.47z M198.88,33.08l-0.45-0.04l-0.04-1.89l-0.03-1.89h-0.4c-0.81,0-1.15,0.13-1.15,0.43\n    c0,0.17,0.06,0.26,0.15,0.23c0.09-0.02,0.3-0.08,0.48-0.12l0.33-0.07v3.37h-0.48c-0.35,0-0.48,0.05-0.48,0.18\n    c0,0.15,0.22,0.18,1.26,0.18c1.02,0,1.26-0.04,1.26-0.17C199.33,33.18,199.17,33.11,198.88,33.08z M197.97,36.58\n    c-0.65,0-0.97,0.23-1.22,0.89c-0.29,0.77-0.21,2.44,0.13,2.91c0.47,0.63,1.09,0.79,1.75,0.45c0.51-0.26,0.82-1,0.82-1.97\n    C199.45,37.33,198.97,36.58,197.97,36.58z M201.07,37.24l0.54-0.08v3.27h-0.48c-0.4,0-0.48,0.04-0.48,0.24\n    c0,0.23,0.08,0.24,1.2,0.24c1.12,0,1.2-0.02,1.2-0.24c0-0.2-0.08-0.24-0.48-0.24h-0.48v-3.87l-0.6,0.08\n    c-0.81,0.11-0.96,0.18-0.96,0.45C200.53,37.29,200.59,37.31,201.07,37.24z M202.54,29.44c-0.32-0.27-0.46-0.31-0.92-0.26\n    c-0.91,0.1-1.33,0.84-1.32,2.3c0,0.82,0.3,1.6,0.73,1.91c0.35,0.24,0.97,0.25,1.42,0.02c0.46-0.24,0.75-1,0.75-1.99\n    C203.21,30.41,203.02,29.84,202.54,29.44z M206.73,29.95c-0.52-1.04-1.91-1.07-2.4-0.04c-0.5,1.05-0.31,2.9,0.36,3.42\n    c0.38,0.3,1.19,0.33,1.57,0.06c0.49-0.35,0.68-0.87,0.68-1.97C206.95,30.66,206.9,30.29,206.73,29.95z M205.48,36.58\n    c-0.71,0-1.14,0.43-1.35,1.34c-0.28,1.26,0.09,2.57,0.85,2.94c0.4,0.2,0.66,0.19,1.14-0.03c0.61-0.29,0.84-0.87,0.84-2.09\n    C206.94,37.21,206.51,36.58,205.48,36.58z M205.06,40.33c-0.45-0.5-0.59-1.79-0.29-2.67c0.18-0.52,0.67-0.8,1.05-0.6\n    c0.5,0.26,0.74,1.5,0.52,2.61C206.19,40.43,205.48,40.79,205.06,40.33z M205.55,33.08c-0.37,0.03-0.48-0.01-0.66-0.3\n    c-0.28-0.42-0.31-2.23-0.05-2.72c0.33-0.62,1.12-0.57,1.4,0.1c0.24,0.58,0.22,1.94-0.04,2.46\n    C206.03,32.98,205.92,33.05,205.55,33.08z M202.26,32.92c-0.26,0.27-0.81,0.23-1.08-0.07c-0.33-0.37-0.39-2.15-0.08-2.75\n    c0.18-0.36,0.28-0.42,0.62-0.42c0.55,0,0.83,0.4,0.93,1.32C202.73,31.79,202.56,32.62,202.26,32.92z M197.43,40.24\n    c-0.6-0.77-0.39-2.92,0.31-3.19c0.37-0.14,0.82,0.12,0.99,0.57c0.18,0.47,0.14,2.05-0.06,2.44\n    C198.38,40.63,197.8,40.71,197.43,40.24z M194.77,25.49c-0.33,0.35-0.72,0.38-0.99,0.09c-0.31-0.34-0.45-0.84-0.45-1.6\n    c0-1.3,0.58-2.06,1.25-1.63c0.42,0.28,0.59,0.92,0.53,1.96C195.06,25.02,194.99,25.25,194.77,25.49z M194.54,37.07\n    c0.5,0.26,0.74,1.5,0.52,2.61c-0.15,0.75-0.86,1.12-1.28,0.66c-0.45-0.5-0.59-1.79-0.29-2.67\n    C193.67,37.15,194.16,36.87,194.54,37.07z M193.94,44.46c0.27-0.16,0.74-0.01,0.94,0.3c0.1,0.16,0.19,0.69,0.22,1.23\n    c0.04,0.76,0,1.05-0.17,1.37c-0.26,0.49-0.61,0.64-1.01,0.45C193.13,47.43,193.15,44.95,193.94,44.46z M193.13,55.08\n    c-0.25,0.28-0.79,0.28-1.05,0c-0.27-0.3-0.44-1.43-0.33-2.17c0.11-0.71,0.4-1.08,0.85-1.08c0.18,0,0.42,0.11,0.54,0.24\n    C193.62,52.58,193.61,54.55,193.13,55.08z M190.98,32.92c-0.26,0.27-0.81,0.23-1.08-0.07c-0.34-0.37-0.39-2.15-0.09-2.75\n    c0.18-0.36,0.28-0.42,0.63-0.42c0.55,0,0.83,0.4,0.93,1.32C191.44,31.79,191.27,32.62,190.98,32.92z M189.6,54.68\n    c-0.23,0.66-0.89,0.82-1.29,0.3c-0.45-0.57-0.49-2.25-0.07-2.89c0.16-0.23,0.28-0.28,0.64-0.25c0.37,0.03,0.48,0.1,0.65,0.46\n    C189.76,52.78,189.8,54.09,189.6,54.68z M182.49,40.33c-0.45-0.5-0.59-1.79-0.29-2.67c0.18-0.52,0.67-0.8,1.05-0.6\n    c0.5,0.26,0.74,1.5,0.52,2.61C183.62,40.43,182.91,40.79,182.49,40.33z M182.98,33.08c-0.37,0.03-0.48-0.01-0.66-0.3\n    c-0.27-0.42-0.31-2.23-0.05-2.72c0.34-0.62,1.12-0.57,1.4,0.1c0.25,0.58,0.22,1.94-0.04,2.46\n    C183.46,32.98,183.35,33.05,182.98,33.08z M186.26,25.58c-0.3-0.25-0.56-1.39-0.45-2c0.07-0.35,0.19-0.48,0.74-0.8\n    c0.37-0.21,0.68-0.36,0.7-0.34c0.35,0.41,0.44,2.26,0.14,2.85C187.12,25.82,186.69,25.93,186.26,25.58z M178.93,32.79\n    c0.01-0.14,0.04-0.17,0.07-0.07c0.04,0.09,0.03,0.19-0.01,0.23C178.96,32.99,178.93,32.92,178.93,32.79z M178.86,37.12\n    c0.25-0.17,0.34-0.17,0.63-0.03c0.67,0.32,0.84,2.41,0.26,3.15c-0.41,0.52-0.55,0.39-0.8-0.74c-0.13-0.58-0.27-1.31-0.31-1.62\n    C178.58,37.37,178.6,37.28,178.86,37.12z M189.06,59.36h10.88c1.14,0,2.06,0.82,2.06,1.84c0,1.02-0.92,1.84-2.06,1.84h-10.88\n    c-1.14,0-2.06-0.83-2.06-1.84C187,60.19,187.92,59.36,189.06,59.36z M190.19,64.81h8.74c1.25,0,2.27,0.83,2.27,1.84\n    c0,1.01-1.02,1.84-2.27,1.84h-8.74c-1.25,0-2.27-0.82-2.27-1.84C187.91,65.63,188.93,64.81,190.19,64.81z M205.48,44.41\n    c0.16-0.02,0.39,0.05,0.5,0.16c0.18,0.18,0.16,0.25-0.36,0.9c-0.3,0.39-0.66,0.8-0.79,0.92c-0.25,0.22-0.25,0.21-0.19-0.53\n    C204.7,44.99,205.01,44.46,205.48,44.41z\" />\n  </g>\n\n  <!-- UABC -->\n  <g class=\"STATS5084\">\n    <path class=\"hex\" d=\"M294.88,44.98l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L294.88,44.98z\" />\n    <path class=\"hex-logo\" d=\"M345.71,38.83l-1.68,7.9c-0.28,1.2-0.38,1.93-0.85,3.07c-0.33,0.74-1.37,1.26-2.11,1.27\n    c-0.09-4.12-0.09-8.11-0.01-12.24h0h0l0,0l-18.43,0.11l0.01,12.2c-0.74,0-1.78-0.53-2.11-1.26c-0.47-1.15-0.57-1.87-0.86-3.07\n    L318,38.9h0.03l-0.04-4.64l5.25,0.14l0-6.33c2.53,1.69,2.53,1.69,2.54,6.33l13.18-0.2c0-4.64,0-4.64,2.53-6.33l0,6.33l22.8-0.02\n    l0,4.64L345.71,38.83z M327.15,41.16c1.33-0.73,2.88-1.08,4.65-1.08c1.65,0,3.09,0.3,4.36,0.91c1.26,0.61,2.23,1.43,2.92,2.48\n    c0.69,1.04,1.03,2.18,1.03,3.4c0,0.96-0.19,1.8-0.58,2.53c-0.39,0.73-0.86,1.35-1.4,1.88c-0.54,0.53-1.5,1.41-2.9,2.66\n    c-0.39,0.35-0.7,0.66-0.93,0.93c-0.23,0.27-0.41,0.51-0.52,0.73c-0.11,0.22-0.2,0.44-0.27,0.66c-0.06,0.22-0.15,0.61-0.28,1.17\n    c-0.22,1.18-0.89,1.77-2.02,1.77c-0.59,0-1.09-0.19-1.49-0.58c-0.4-0.39-0.61-0.96-0.61-1.72c0-0.95,0.15-1.78,0.45-2.47\n    c0.3-0.69,0.69-1.31,1.17-1.84c0.49-0.53,1.15-1.16,1.98-1.88c0.73-0.64,1.25-1.11,1.57-1.44c0.33-0.32,0.6-0.69,0.82-1.08\n    c0.22-0.39,0.33-0.82,0.33-1.29c0-0.91-0.34-1.67-1.01-2.3c-0.68-0.62-1.55-0.94-2.61-0.94c-1.25,0-2.17,0.32-2.76,0.95\n    c-0.59,0.63-1.09,1.56-1.5,2.78c-0.39,1.28-1.12,1.92-2.2,1.92c-0.64,0-1.17-0.23-1.61-0.67c-0.44-0.45-0.66-0.93-0.66-1.46\n    c0-1.08,0.35-2.17,1.04-3.28C324.81,42.8,325.82,41.89,327.15,41.16z M331.39,60.74c0.72,0,1.32,0.25,1.8,0.73\n    c0.49,0.48,0.73,1.09,0.73,1.8c0,0.8-0.25,1.42-0.76,1.87c-0.51,0.46-1.1,0.68-1.77,0.68c-0.7,0-1.3-0.22-1.81-0.67\n    c-0.52-0.44-0.78-1.07-0.78-1.88c0-0.71,0.25-1.32,0.75-1.8C330.05,60.99,330.66,60.74,331.39,60.74z\" />\n  </g>\n\n  <!-- DMML1 -->\n  <g class=\"STATS5074\">\n    <path class=\"hex\" d=\"M222.16,87.22l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L222.16,87.22z\" />\n    <path class=\"hex-logo\" d=\"M288.29,101.4l-0.62,1.45l-5.33,2.13l-1.47-0.61l1.25-2.93l-3.94-7.66v9.51h-3.67v2.71h-3.98v-2.71h-5.15v2.71\n    h-3.97v-2.71h-3.67V91.52l-4.05,4.89l-10.71-9.55h-3.24v-1.57c1.36-1.33,2.73-2.65,4.07-4h1.59v2.86l7.89,7.03l4.45-5.39h5.85v-3.61\n    h-4.04V70.48h4.9v-2.41h3.24v-5.04h-0.66v-1.78h1.94v1.78h-0.66v5.04h3.24v2.41h4.89v11.69h-4.04v3.61h5.81l7.46,14.52h0\n    L288.29,101.4z M270.49,100.75c0.64,0,1.17-0.53,1.17-1.18c0-0.65-0.52-1.17-1.17-1.17c-0.65,0-1.17,0.53-1.17,1.17\n    C269.32,100.22,269.85,100.75,270.49,100.75z M269.28,97.83c0.65,0,1.17-0.53,1.17-1.18c0-0.65-0.53-1.17-1.17-1.17\n    c-0.65,0-1.17,0.53-1.17,1.17C268.11,97.3,268.63,97.83,269.28,97.83z M267.66,90.57c0.54,0,0.97-0.43,0.97-0.97\n    c0-0.53-0.43-0.97-0.97-0.97c-0.54,0-0.97,0.43-0.97,0.97C266.69,90.14,267.12,90.57,267.66,90.57z M267.18,86.98\n    c0.54,0,0.97-0.43,0.97-0.97c0-0.53-0.43-0.97-0.97-0.97c-0.54,0-0.97,0.43-0.97,0.97C266.21,86.55,266.64,86.98,267.18,86.98z\n    M264.66,93.81c0.54,0,0.97-0.43,0.97-0.97c0-0.53-0.43-0.97-0.97-0.97c-0.54,0-0.97,0.43-0.97,0.97\n    C263.69,93.37,264.12,93.81,264.66,93.81z M260.83,90.79c-0.54,0-0.97,0.43-0.97,0.97c0,0.53,0.43,0.97,0.97,0.97\n    c0.53,0,0.97-0.43,0.97-0.97C261.79,91.22,261.36,90.79,260.83,90.79z M262.73,89.12c0,0.53,0.43,0.97,0.97,0.97\n    c0.53,0,0.97-0.43,0.97-0.97c0-0.53-0.43-0.96-0.97-0.96C263.17,88.16,262.73,88.59,262.73,89.12z M264.1,72.29\n    c-1.63,0-2.96,1.3-2.96,2.91c0,1.61,1.32,2.91,2.96,2.91c1.63,0,2.96-1.3,2.96-2.91C267.06,73.6,265.74,72.29,264.1,72.29z\n    M264.68,79.28v1.16H268h3.31v-1.16H264.68z M274.85,75.2c0-1.6-1.32-2.91-2.96-2.91s-2.96,1.3-2.96,2.91\n    c0,1.61,1.32,2.91,2.96,2.91S274.85,76.81,274.85,75.2z M272.92,95.97c-0.65,0-1.17,0.53-1.17,1.17c0,0.65,0.53,1.18,1.17,1.18\n    c0.65,0,1.17-0.53,1.17-1.18C274.09,96.5,273.56,95.97,272.92,95.97z M274.13,99.13c-0.65,0-1.17,0.53-1.17,1.17\n    c0,0.65,0.53,1.17,1.17,1.17c0.65,0,1.17-0.53,1.17-1.17C275.3,99.66,274.78,99.13,274.13,99.13z M274.13,101.1\n    c-0.44,0-0.79-0.35-0.79-0.79c0-0.43,0.35-0.79,0.79-0.79c0.44,0,0.79,0.35,0.79,0.79C274.92,100.74,274.57,101.1,274.13,101.1z\n    M272.92,97.94c-0.44,0-0.79-0.36-0.79-0.79c0-0.44,0.35-0.79,0.79-0.79c0.44,0,0.79,0.35,0.79,0.79\n    C273.71,97.58,273.35,97.94,272.92,97.94z M270.15,75.2c0-0.94,0.78-1.71,1.74-1.71s1.74,0.77,1.74,1.71c0,0.95-0.78,1.71-1.74,1.71\n    S270.15,76.15,270.15,75.2z M264.1,76.92c-0.96,0-1.74-0.77-1.74-1.71c0-0.94,0.78-1.71,1.74-1.71s1.74,0.77,1.74,1.71\n    C265.84,76.15,265.07,76.92,264.1,76.92z M269.28,95.87c0.44,0,0.79,0.35,0.79,0.79c0,0.44-0.35,0.79-0.79,0.79\n    s-0.79-0.36-0.79-0.79C268.49,96.22,268.84,95.87,269.28,95.87z M270.49,98.79c0.43,0,0.79,0.35,0.79,0.79\n    c0,0.44-0.35,0.79-0.79,0.79c-0.44,0-0.79-0.36-0.79-0.79C269.7,99.14,270.06,98.79,270.49,98.79z M261.5,106.7h3.98v1.5h-3.98\n    V106.7z M261.5,110.01v-1.02h0v-0.16h3.98V110c1.32,0.7,2.22,2.07,2.23,3.66h-8.43C259.28,112.08,260.18,110.71,261.5,110.01z\n    M270.63,106.7h3.98v1.5h-3.98V106.7z M270.63,110v-1.02v-0.16h3.98v0.16V110c1.32,0.7,2.23,2.07,2.22,3.66h-8.43\n    C268.4,112.08,269.31,110.71,270.63,110z\" />\n  </g>\n\n  <!-- DMML2 -->\n  <g class=\"STATS5081\">\n    <path class=\"hex\" d=\"M294.88,212.98l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L294.88,212.98z\" />\n    <path class=\"hex-logo\" d=\"M361.26,222.4l-0.62,1.45l-5.33,2.13l-1.47-0.61l1.25-2.93l-3.94-7.66v9.52h-3.67v2.71h-3.98v-2.71h-5.15v2.71\n    h-3.97v-2.71h-3.67v-11.77l-4.05,4.88l-10.71-9.55h-3.24v-1.57c1.36-1.33,2.73-2.65,4.07-4h1.59v2.86l7.89,7.03l4.45-5.39h5.85\n    v-3.61h-4.04v-11.69h4.9v-2.41h3.24v-5.04H340v-1.78h1.94v1.78h-0.66v5.04h3.24v2.41h4.89v11.69h-4.04v3.61h5.8v0l0,0l7.46,14.52\n    h-0.01L361.26,222.4z M342.98,215.17v0.4h3.14v-0.4H342.98z M344,211.39l-0.35-0.2l-1.64,2.77l0.35,0.2L344,211.39z M344,222.53\n    c0.85,0,1.54-0.69,1.54-1.54c0-0.85-0.69-1.54-1.54-1.54c-0.85,0-1.54,0.69-1.54,1.54C342.45,221.83,343.14,222.53,344,222.53z\n    M342.81,215.32c0-0.85-0.69-1.54-1.54-1.54c-0.86,0-1.54,0.69-1.54,1.54c0,0.85,0.69,1.54,1.54,1.54\n    C342.12,216.86,342.81,216.17,342.81,215.32z M338.51,219.46l0.35,0.2l1.64-2.77l-0.35-0.2L338.51,219.46z M339.67,215.57v-0.4\n    h-3.14v0.4H339.67z M339.77,221.26h2.46v-0.36h-2.46V221.26z M337.99,222.53c0.85,0,1.54-0.69,1.54-1.54c0-0.85-0.69-1.54-1.54-1.54\n    c-0.85,0-1.54,0.69-1.54,1.54C336.44,221.83,337.13,222.53,337.99,222.53z M334.84,213.79c-0.85,0-1.54,0.69-1.54,1.54\n    c0,0.85,0.69,1.54,1.54,1.54c0.85,0,1.54-0.69,1.54-1.54C336.39,214.48,335.7,213.79,334.84,213.79z M336.29,209.59\n    c0,0.85,0.69,1.54,1.54,1.54c0.85,0,1.54-0.69,1.54-1.54c0-0.85-0.69-1.54-1.54-1.54C336.98,208.05,336.29,208.74,336.29,209.59z\n    M337.08,193.29c-1.63,0-2.96,1.3-2.96,2.91c0,1.61,1.32,2.91,2.96,2.91c1.63,0,2.96-1.3,2.96-2.91\n    C340.04,194.59,338.71,193.29,337.08,193.29z M337.65,200.28v1.16h3.32h3.31v-1.16H337.65z M347.82,196.2c0-1.6-1.32-2.91-2.96-2.91\n    c-1.64,0-2.96,1.3-2.96,2.91c0,1.61,1.32,2.91,2.96,2.91C346.5,199.11,347.82,197.81,347.82,196.2z M344.66,208.1\n    c-0.85,0-1.54,0.69-1.54,1.54c0,0.85,0.69,1.54,1.54,1.54c0.85,0,1.54-0.69,1.54-1.54C346.2,208.79,345.51,208.1,344.66,208.1z\n    M347.75,213.65c-0.85,0-1.54,0.69-1.54,1.54c0,0.85,0.69,1.54,1.54,1.54c0.85,0,1.54-0.69,1.54-1.54\n    C349.29,214.33,348.6,213.65,347.75,213.65z M343.12,196.2c0-0.94,0.78-1.71,1.74-1.71c0.96,0,1.74,0.77,1.74,1.71\n    c0,0.95-0.78,1.71-1.74,1.71C343.9,197.91,343.12,197.14,343.12,196.2z M337.08,197.91c-0.96,0-1.74-0.77-1.74-1.71\n    c0-0.94,0.78-1.71,1.74-1.71c0.96,0,1.74,0.77,1.74,1.71C338.82,197.14,338.04,197.91,337.08,197.91z M334.48,227.7h3.98v1.5h-3.98\n    V227.7z M334.48,231.01v-1.02h0v-0.16h3.98V231c1.32,0.7,2.22,2.07,2.23,3.65h-8.43C332.25,233.08,333.15,231.71,334.48,231.01z\n    M343.6,227.7h3.98v1.5h-3.98V227.7z M343.6,231v-1.02v-0.16h3.98v0.16V231c1.32,0.7,2.23,2.07,2.22,3.65h-8.43\n    C341.38,233.08,342.28,231.7,343.6,231z\" />\n  </g>\n\n  <!-- DMAS -->\n  <g class=\"STATS5080\">\n    <path class=\"hex\" d=\"M222.16,171.22l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L222.16,171.22z\" />\n    <path class=\"hex-logo\" d=\"M288.75,157.92v0.98c0,0.71-0.28,1.31-0.84,1.78c-0.56,0.47-1.22,0.7-1.99,0.7h-2.98\n    c-0.8,0-1.52-0.23-2.15-0.69c-0.68-0.48-1.01-1.09-1.01-1.8v-10.27c0-0.72,0.34-1.32,1.01-1.81c0.64-0.47,1.36-0.7,2.15-0.7h2.98\n    c0.77,0,1.43,0.24,1.99,0.73c0.56,0.48,0.84,1.08,0.84,1.78v1.09h-2.35v-0.57c0-0.77-0.34-1.16-1.02-1.16h-2.28\n    c-0.34,0-0.58,0.09-0.74,0.3c-0.16,0.2-0.24,0.44-0.24,0.73v9.48c0,0.29,0.08,0.53,0.24,0.73c0.16,0.19,0.4,0.3,0.74,0.3h2.28\n    c0.66,0,1.01-0.36,1.02-1.06c0-0.19,0-0.37,0-0.55H288.75z M278.68,191.77c-0.13,0.1-0.28,0.16-0.45,0.16h-1.17\n    c-0.48-0.87-1.32-2.31-2.53-4.32c-1.21-2-2.29-3.83-3.26-5.47v9.79h-2.38v-14.66c0-0.16,0.06-0.3,0.19-0.42\n    c0.13-0.12,0.28-0.18,0.45-0.18h1.35c0,0.01,0.07,0.15,0.22,0.41c0.15,0.26,0.34,0.61,0.58,1.05c0.24,0.44,0.52,0.93,0.83,1.49\n    c0.32,0.55,0.64,1.13,0.97,1.72c0.34,0.6,0.67,1.19,1,1.78c0.33,0.58,0.63,1.12,0.91,1.61c0.28,0.48,0.51,0.89,0.7,1.24\n    c0.2,0.34,0.33,0.57,0.39,0.68v-9.99h2.38v14.68C278.87,191.5,278.8,191.65,278.68,191.77z M277.46,160.53\n    c-0.64,0.57-1.42,0.85-2.35,0.85h-2.59c-0.93,0-1.73-0.28-2.4-0.85c-0.68-0.57-1.02-1.28-1.02-2.12v-9.3c0-0.85,0.34-1.57,1.02-2.15\n    c0.67-0.56,1.47-0.85,2.4-0.85h2.59c0.91,0,1.69,0.29,2.35,0.87c0.66,0.58,1,1.29,1,2.12v9.3\n    C278.45,159.22,278.12,159.93,277.46,160.53z M276.11,149.5c0-0.63-0.24-1.09-0.73-1.37c-0.16-0.08-0.34-0.13-0.56-0.13h-2.15\n    c-0.38,0-0.69,0.16-0.93,0.5c-0.2,0.28-0.3,0.61-0.3,1v8.51c0,0.63,0.23,1.08,0.69,1.36c0.16,0.09,0.34,0.14,0.54,0.14h2.15\n    c0.4,0,0.72-0.16,0.97-0.48c0.21-0.3,0.31-0.63,0.31-1.02V149.5z M265.39,161.44l-3.44-6.61h-1.85v6.61h-2.36v-15.29h6.4\n    c0.85,0,1.57,0.26,2.16,0.77c0.61,0.51,0.92,1.17,0.92,1.96v3.57c0,1.14-0.53,1.88-1.58,2.22c-0.33,0.11-0.69,0.17-1.09,0.17\n    l3.27,6.61H265.39z M264.86,152.3c0.01-0.12,0.02-0.25,0.02-0.37v-2.67c0-0.53-0.22-0.92-0.67-1.16c-0.14-0.07-0.3-0.1-0.48-0.1\n    h-3.63v4.96h4.02C264.57,152.96,264.81,152.74,264.86,152.3z M254.6,191.95l-3.43-6.6h-1.86v6.6h-2.36v-15.29h6.4\n    c0.84,0,1.57,0.26,2.17,0.77c0.61,0.51,0.92,1.17,0.92,1.96v3.57c0,1.14-0.53,1.88-1.58,2.22c-0.33,0.11-0.69,0.17-1.09,0.17\n    l3.27,6.6H254.6z M254.07,182.82c0.02-0.12,0.03-0.24,0.03-0.37v-2.67c0-0.53-0.23-0.92-0.68-1.16c-0.14-0.07-0.3-0.1-0.48-0.1\n    h-3.63v4.96h4.02C253.78,183.48,254.02,183.26,254.07,182.82z M255.74,154.16c-0.47,0.44-1.09,0.67-1.87,0.67h-4.56v6.61h-2.36\n    v-15.29h6.4c0.84,0,1.57,0.26,2.17,0.77c0.61,0.51,0.92,1.17,0.92,1.96v3.57C256.44,153.15,256.21,153.72,255.74,154.16z\n    M254.09,149.26c0-0.53-0.23-0.92-0.68-1.16c-0.14-0.07-0.3-0.1-0.48-0.1h-3.63v4.96h4.02c0.45,0,0.7-0.22,0.74-0.66\n    c0.02-0.12,0.03-0.25,0.03-0.37V149.26z M260.65,189.01c0,0.68,0.33,1.03,0.97,1.03h2.67c0.33,0,0.58-0.1,0.75-0.3\n    c0.18-0.2,0.27-0.44,0.27-0.73v-12.36l2.35-0.02v12.77c0,0.7-0.32,1.3-0.97,1.8c-0.61,0.46-1.32,0.7-2.11,0.7h-3.11\n    c-0.81,0-1.52-0.23-2.15-0.69c-0.68-0.48-1.01-1.09-1.01-1.81v-12.76h2.35V189.01z M281.68,188.65c-0.5,0-0.89-0.13-1.16-0.38\n    c-0.27-0.25-0.4-0.61-0.4-1.07c0-0.46,0.13-0.81,0.4-1.07c0.28-0.26,0.66-0.39,1.16-0.39c1.03,0,1.54,0.48,1.54,1.44\n    c0,0.46-0.13,0.82-0.4,1.07C282.56,188.53,282.18,188.65,281.68,188.65z M281.71,189.73c1.25,0,1.87,0.59,1.87,1.77\n    c0,0.83-0.77,2.2-2.31,4.11l-0.99-0.18c0.25-0.5,0.49-1.02,0.73-1.53c0.23-0.51,0.49-1.01,0.78-1.5c-0.48,0.39-0.96,0.35-1.45-0.11\n    c-0.25-0.22-0.38-0.54-0.38-0.96c0-0.42,0.15-0.79,0.43-1.12C280.67,189.89,281.11,189.73,281.71,189.73z\" />\n  </g>\n\n  <!-- APM -->\n  <g class=\"STATS5073\">\n    <path class=\"hex\" d=\"M149.68,128.98l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L149.68,128.98z\" />\n    <path class=\"hex-logo\" d=\"M205.87,134.15c-3.51,0.13-6.81-1.98-10.29-4.22c-0.14-0.09-0.28-0.18-0.41-0.26c-0.33,0.3-0.77,0.49-1.25,0.49\n    c-1.03,0-1.86-0.84-1.86-1.87c0-0.17,0.02-0.33,0.07-0.49c-2.29-1.29-4.63-2.28-7.05-2.3c-0.02,0-0.04,0-0.06,0\n    c-7.16,0-14.95,8.7-15.03,8.79l-1.33-1.17c0.34-0.38,8.4-9.39,16.36-9.39c0.02,0,0.05,0,0.07,0c2.97,0.02,5.7,1.24,8.33,2.77\n    c0.16-0.05,0.33-0.07,0.51-0.07c0.91,0,1.67,0.65,1.83,1.51c0.26,0.17,0.53,0.34,0.79,0.51c3.24,2.08,6.26,4.04,9.27,3.94\n    c6.08-0.24,13.52-11.09,13.59-11.2l1.46,1C220.54,122.66,212.84,133.88,205.87,134.15z M215.51,114.35c-1.03,0-1.86-0.83-1.86-1.86\n    c0-1.03,0.84-1.86,1.86-1.86c1.03,0,1.87,0.84,1.87,1.86C217.38,113.52,216.54,114.35,215.51,114.35z M184.95,118.54\n    c-1.03,0-1.86-0.84-1.86-1.86c0-1.03,0.83-1.86,1.86-1.86c1.03,0,1.86,0.83,1.86,1.86C186.82,117.7,185.98,118.54,184.95,118.54z\n    M170.35,141.78c1.03,0,1.86,0.83,1.86,1.86c0,1.03-0.83,1.86-1.86,1.86c-1.03,0-1.86-0.84-1.86-1.86\n    C168.49,142.61,169.32,141.78,170.35,141.78z M206.54,140.52c1.03,0,1.86,0.84,1.86,1.86c0,1.03-0.84,1.86-1.86,1.86\n    c-1.03,0-1.86-0.83-1.86-1.86C204.67,141.36,205.51,140.52,206.54,140.52z\" />\n  </g>\n\n  <!-- PM -->\n  <g class=\"STATS5076\">\n    <path class=\"hex\" d=\"M76.48,171.22l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L76.48,171.22z\" />\n    <path class=\"hex-logo\" d=\"M123.95,169.93c0.02,0.1,0.03,0.19,0.03,0.29c0,1.03-0.84,1.86-1.86,1.86c-0.09,0-0.19-0.01-0.28-0.02\n    L97.8,196.3l-1.26-1.25l23.87-24.08c-0.1-0.23-0.16-0.49-0.16-0.76c0-1.03,0.83-1.86,1.86-1.86c0.27,0,0.52,0.06,0.75,0.16\n    l22.61-22.8l1.26,1.25L123.95,169.93z M125.36,152.37c-0.95-0.39-1.41-1.48-1.02-2.43c0.39-0.95,1.48-1.41,2.43-1.02\n    c0.95,0.39,1.41,1.48,1.02,2.43C127.4,152.31,126.31,152.76,125.36,152.37z M102.43,175.51c-1.03,0-1.87-0.83-1.87-1.86\n    c0-1.03,0.84-1.86,1.87-1.86c1.03,0,1.86,0.83,1.86,1.86C104.29,174.68,103.46,175.51,102.43,175.51z M117.96,188.54\n    c0.95,0.39,1.41,1.48,1.02,2.43c-0.39,0.95-1.48,1.41-2.43,1.02c-0.95-0.39-1.41-1.48-1.02-2.43\n    C115.92,188.6,117.01,188.15,117.96,188.54z M140.9,165.4c1.03,0,1.86,0.84,1.86,1.86c0,1.03-0.84,1.87-1.86,1.87\n    c-1.03,0-1.86-0.84-1.86-1.87C139.03,166.24,139.86,165.4,140.9,165.4z\" />\n  </g>\n\n  <!-- DABI -->\n  <g class=\"STATS5079\">\n    <path class=\"hex\" d=\"M149.68,212.98l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L149.68,212.98z\" />\n    <path class=\"hex-logo\" d=\"M176.66,233.62v-10.5l0.01-10.49l7.17-4.15l7.18-4.15l0.05,4.4c0.01,2.43,0.09,4.42,0.16,4.42\n    c0.07,0,2.71-1.91,5.85-4.26l5.73-4.26l0.05,4.33l0.03,4.33l5.57-4.17c3.05-2.3,5.64-4.21,5.75-4.29c0.13-0.09,0.17,2.83,0.17,14.33\n    v14.45H176.66z M187.43,222.86h-6.96v3.48v3.47c2.32,0,4.64,0,6.96,0V222.86z M199.06,222.86h-7.07v3.48v3.47h7.07V222.86z\n    M210.57,222.86h-6.96v3.48v3.47h6.96V222.86z M176.75,193.09l4.25-0.11h1.4v6.52v8.47c-0.98,0.51-4.94,2.85-5.73,3.31\n    L176.75,193.09z\" />\n  </g>\n\n  <!-- DPIP -->\n  <g class=\"STATS5082\">\n    <path class=\"hex\" d=\"M76.48,255.22l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L76.48,255.22z\" />\n    <path class=\"hex-logo\" d=\"M139.61,259.6c-0.96,2.9-2,4.83-4.77,4.83h-14.3v1.21h9.53v3.63c0,2.75-2.37,4.15-4.77,4.85\n    c-3.61,1.05-6.51,0.89-9.53,0c-2.52-0.74-4.77-2.26-4.77-4.85v-9.08c0-2.61,2.16-4.85,4.77-4.85h9.53c3.18,0,5.96-2.76,5.96-6.05\n    v-4.23h3.58c2.78,0,4.09,2.08,4.77,4.83C140.56,253.73,140.6,256.61,139.61,259.6z M125.9,271.7c0.99,0,1.79-0.82,1.79-1.82\n    c0-1-0.8-1.81-1.79-1.81c-0.99,0-1.79,0.81-1.79,1.81C124.11,270.88,124.91,271.7,125.9,271.7z M125.29,254.15h-9.53\n    c-3.24,0-5.96,2.78-5.96,5.92v4.36h-3.28c-2.77,0-4.39-2.01-5.07-4.83c-0.91-3.79-0.88-6.06,0-9.69c0.76-3.17,3.19-4.83,5.96-4.83\n    h13.12v-1.21h-9.54v-3.64c0-2.75,0.73-4.24,4.77-4.96c1.37-0.24,2.93-0.38,4.56-0.39c1.63-0.01,3.33,0.11,4.97,0.39\n    c2.59,0.43,4.77,2.37,4.77,4.96v9.08C130.07,251.97,127.95,254.15,125.29,254.15z M115.16,237.8c-0.99,0-1.79,0.82-1.79,1.82\n    c0,1,0.8,1.81,1.79,1.81c0.99,0,1.79-0.81,1.79-1.81C116.95,238.62,116.15,237.8,115.16,237.8z\" />\n  </g>\n\n  <!-- PSF -->\n  <g class=\"STATS5094\">\n    <path class=\"hex\" d=\"M3.76,212.98l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L3.76,212.98z\" />\n    <path class=\"hex-logo\" d=\"M79.08,227.98v-4.25h4.26v4.25H79.08z M73.4,223.73h4.26v4.25H73.4V223.73z M67.72,223.73h4.26v4.25h-4.26\n    V223.73z M67.72,218.06h4.26v4.25h-4.26V218.06z M67.72,212.4h4.26v4.25h-4.26V212.4z M62.05,223.73h4.26v4.25h-4.26V223.73z\n    M62.05,218.06h4.26v4.25h-4.26V218.06z M62.05,212.4h4.26v4.25h-4.26V212.4z M62.05,206.73h4.26v4.25h-4.26V206.73z M62.05,201.06\n    h4.26v4.25h-4.26V201.06z M56.37,223.73h4.26v4.25h-4.26V223.73z M56.37,218.06h4.26v4.25h-4.26V218.06z M56.37,212.4h4.26v4.25\n    h-4.26V212.4z M56.74,216.28h3.51v-3.51h-3.51V216.28z M56.37,206.73h4.26v4.25h-4.26V206.73z M56.37,201.06h4.26v4.25h-4.26V201.06\n    z M56.37,195.4h4.26v4.25h-4.26V195.4z M56.37,189.73h4.26v4.25h-4.26V189.73z M50.69,223.73h4.26v4.25h-4.26V223.73z M50.69,218.06\n    h4.26v4.25h-4.26V218.06z M50.69,212.4h4.26v4.25h-4.26V212.4z M50.69,206.73h4.26v4.25h-4.26V206.73z M50.69,201.06h4.26v4.25\n    h-4.26V201.06z M50.69,195.4h4.26v4.25h-4.26V195.4z M50.69,189.73h4.26v4.25h-4.26V189.73z M51.06,193.61h3.52v-3.51h-3.52V193.61z\n    M50.69,184.06h4.26v4.25h-4.26V184.06z M45.01,223.73h4.26v4.25h-4.26V223.73z M45.01,218.06h4.26v4.25h-4.26V218.06z\n    M45.38,221.95h3.52v-3.51h-3.52V221.95z M45.01,212.4h4.26v4.25h-4.26V212.4z M45.01,206.73h4.26v4.25h-4.26V206.73z M45.01,201.06\n    h4.26v4.25h-4.26V201.06z M45.01,195.4h4.26v4.25h-4.26V195.4z M45.01,189.73h4.26v4.25h-4.26V189.73z M45.01,184.06h4.26v4.25\n    h-4.26V184.06z M39.34,223.73h4.26v4.25h-4.26V223.73z M39.34,218.06h4.26v4.25h-4.26V218.06z M39.34,212.4h4.26v4.25h-4.26V212.4z\n    M39.34,206.73h4.26v4.25h-4.26V206.73z M39.34,201.06h4.26v4.25h-4.26V201.06z M39.71,204.95h3.51v-3.51h-3.51V204.95z\n    M39.34,195.4h4.26v4.25h-4.26V195.4z M39.34,189.73h4.26v4.25h-4.26V189.73z M33.66,223.73h4.26v4.25h-4.26V223.73z M33.66,218.06\n    h4.26v4.25h-4.26V218.06z M33.66,212.4h4.26v4.25h-4.26V212.4z M33.66,206.73h4.26v4.25h-4.26V206.73z M33.66,201.06h4.26v4.25\n    h-4.26V201.06z M27.98,223.73h4.26v4.25h-4.26V223.73z M27.98,218.06h4.26v4.25h-4.26V218.06z M27.98,212.4h4.26v4.25h-4.26V212.4z\n    M22.3,223.73h4.26v4.25H22.3V223.73z M16.62,223.73h4.26v4.25h-4.26V223.73z\" />\n  </g>\n\n  <!-- HPC -->\n  <g class=\"STATS5083\">\n    <path class=\"hex\" d=\"M294.88,128.98l22.75-39.41h45.5l22.75,39.41l-22.75,39.41h-45.5L294.88,128.98z\" />\n    <path class=\"hex-logo\" d=\"M340.62,157.66v-55.01l28.08,8.69v37.63L340.62,157.66z M357.64,152.01l5.7-1.73v-6.44l-5.7,1.18V152.01z\n    M357.64,144.63l5.7-1.15v-6.44l-5.7,0.59V144.63z M357.64,137.25l5.7-0.56v-6.44l-5.7,0.01V137.25z M350.31,154.24l6.87-2.09v-7.04\n    l-6.87,1.42V154.24z M357.64,129.87v-6.8l-0.46-0.05v6.84L357.64,129.87z M350.31,146.1l6.87-1.38v-7.04l-6.87,0.71V146.1z\n    M350.31,137.97l6.87-0.68v-7.04l-6.87,0.01V137.97z M341.32,148.39l8.43-1.74v-0.43l-8.43,1.7V148.39z M350.31,129.84v-7.49\n    l-0.56-0.06l0,7.54L350.31,129.84z M341.32,139.33l8.43-0.88v-0.43l-8.43,0.83V139.33z M341.32,130.28l8.43-0.01v-0.43l-8.43-0.03\n    V130.28z M341.32,121.46l8.43,0.83v-0.43l-8.43-0.88V121.46z M341.32,112.4l8.43,1.7v-0.43l-8.43-1.74V112.4z M350.31,106.08\n    l-0.56-0.17l0,7.76l0.56,0.12V106.08z M350.31,121.92l6.87,0.71v-7.04l-6.87-1.38V121.92z M357.64,108.31l-0.46-0.14v7.04l0.46,0.1\n    V108.31z M357.64,122.68l5.7,0.59v-6.44l-5.7-1.15V122.68z M363.73,110.16l-0.39-0.12v6.44l0.39,0.08V110.16z M368.37,117.85\n    l-4.64-0.93v6.4l4.64,0.48V117.85z M368.37,124.13l-4.64-0.46v6.22l4.64,0.02V124.13z M368.37,130.24l-4.64,0.01v6.4l4.64-0.46\n    V130.24z M368.37,136.52l-4.64,0.48v6.4l4.64-0.93V136.52z M368.37,142.8l-4.64,0.96v6.4l4.64-1.41V142.8z M311.82,111.34\n    l28.08-8.69v55.01l-28.08-8.69V111.34z M330.77,146.65l8.43,1.74v-0.48l-8.43-1.7V146.65z M330.77,138.46l8.43,0.88v-0.48\n    l-8.43-0.83V138.46z M330.77,130.27l8.43,0.01v-0.48l-8.43,0.03V130.27z M330.77,122.29l8.43-0.83v-0.48l-8.43,0.88V122.29z\n    M330.77,114.1l8.43-1.7v-0.48l-8.43,1.74v-7.75l-0.56,0.17v7.7l0.55-0.11L330.77,114.1z M323.35,152.15l6.87,2.09v-7.71l-6.87-1.42\n    V152.15z M323.35,144.72l6.87,1.38v-7.71l-6.87-0.71V144.72z M323.35,137.29l6.87,0.68v-7.71l-6.87-0.01V137.29z M323.35,129.87\n    l6.87-0.03v-7.49l-6.87,0.68V129.87z M323.35,122.63l6.87-0.71v-7.71l-6.87,1.38V122.63z M323.35,108.17l-0.46,0.14v6.99l0.46-0.1\n    V108.17z M317.18,150.27l5.7,1.73v-6.99l-5.7-1.18V150.27z M317.18,143.48l5.7,1.15v-6.99l-5.7-0.59V143.48z M317.18,136.69\n    l5.7,0.56v-6.99l-5.7-0.01V136.69z M317.18,129.89l5.7-0.02v-6.8l-5.7,0.56V129.89z M317.18,123.27l5.7-0.59v-6.99l-5.7,1.15V123.27\n    z M317.18,110.04l-0.39,0.12v6.4l0.39-0.08V110.04z M312.15,148.75l4.64,1.41v-6.4l-4.64-0.96V148.75z M312.15,142.47l4.64,0.93V137\n    l-4.64-0.48V142.47z M312.15,136.19l4.64,0.46v-6.4l-4.64-0.01V136.19z M312.15,129.91l4.64-0.02v-6.22l-4.64,0.46V129.91z\n    M312.15,123.8l4.64-0.48v-6.4l-4.64,0.93V123.8z M330.77,113.66L330.77,113.66l-0.01,0.01l0-0.01L330.77,113.66z\" />\n  </g>\n</svg>\n");

/***/ }),

/***/ 2439:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n  <path\n    d=\"M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z\">\n  </path>\n</svg>\n");

/***/ }),

/***/ 8328:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 117.18 48.02\" class=\"uofg\">\n  <path fill=\"#003865\"\n    d=\"m114.74 32-3.83 9.36h-.8l-3.54-8.38-3.57 8.38h-.83l-4.43-9.99c-.41-.92-.83-1.37-2.2-1.51v-.54h5.77v.54c-1.75.09-1.87.59-1.25 1.99l3.21 7.16 2.91-6.9c-.65-1.51-1.16-2.05-2.2-2.17l-.71-.09v-.54h6.15v.54c-1.46.03-1.9.47-1.28 1.96l2.91 7.07 2.85-6.95c.65-1.58.15-2.08-1.72-2.08v-.54h4.99v.54c-1.12.13-1.83.7-2.43 2.15zm-.03-21.93-5.05 12.6c-.89 2.2-1.57 3.18-2.61 3.18-.71 0-1.22-.45-1.22-1.04 0-1.22 1.72-.92 2.46-1.67.33-.33.77-1.1 1.01-1.69l.89-2.23-4.6-9.77c-.57-1.22-1.1-1.73-2.35-1.75v-.54h5.97v.54c-1.81.03-2.02.56-1.43 1.81l3.36 7.25 2.52-6.3c.89-2.26.33-2.7-1.43-2.76v-.54h4.93v.54c-1.2.14-1.88.98-2.45 2.37zm-14.79 9.22c-1.75 0-3-1.46-3-3.45V8.47h-1.37v-.48c1.16-.56 2.17-1.93 2.85-3.77h.51v2.94h3.67l-.47 1.31h-3.2v6.92c0 1.87 1.34 2.5 1.96 2.5.66 0 1.25-.51 1.81-1.49l.48.45c-.72 1.54-1.88 2.44-3.24 2.44zm-11.72-.92c1.82 0 2.47-.6 2.47-2.17v-5.97c0-1.16-.15-1.31-.92-1.46l-1.4-.27v-.48l3.86-1.34h.45v9.98c0 1.04.56 1.7 2.14 1.7v.56h-6.6v-.55zm3.24-16.11c-.71 0-1.28-.51-1.28-1.13C90.17.5 90.73 0 91.44 0c.71 0 1.31.5 1.31 1.13 0 .62-.59 1.13-1.31 1.13zM86.77 15.9c0 1.93-1.61 3.39-3.69 3.39-.56 0-.98-.09-1.31-.21-.33-.09-.57-.18-.8-.18-.18 0-.36.12-.51.35h-.45l-.33-3.33h.48c.35 1.79 1.48 2.79 2.82 2.79 1.19 0 2.11-.89 2.11-1.96 0-.62-.15-1.01-.95-1.81-2.11-2.11-4.46-2.32-4.46-4.78 0-1.96 1.55-3.33 3.8-3.33.8 0 1.63.18 2.38.48l.06 2.7h-.51c-.21-1.52-1.19-2.46-2.38-2.46-.98 0-1.81.68-1.81 1.66.03 2.62 5.55 3.06 5.55 6.69zm-3.86 15.87c-.45-.03-1.84-.15-2.97-.36.18.33.5.95.5 1.9 0 2.2-1.9 4.31-5.2 4.31-.56 0-.83-.06-1.37-.24-.47.51-1.81.83-1.81 1.51 0 .75 1.28 1.04 4.25 1.07 3.36.03 4.52.18 5.41 1.07.71.71.89 1.46.89 2.08 0 1.93-2.61 4.9-8.11 4.9-3.09 0-4.57-1.37-4.57-2.82 0-1.72 1.81-1.99 3.18-3.65-1.6-.15-2.82-1.16-2.82-2.11 0-1.37 1.99-1.43 3.03-2.2-1.81-.71-2.85-1.99-2.85-3.69 0-2.56 2.29-4.55 5.23-4.55 1.37 0 2.53.42 3.33 1.19 1.34 0 2.58-.15 3.89-.3v1.89zM71.77 44.21c0 1.4 1.96 2.97 4.4 2.97 2.53 0 4.9-1.66 4.9-3.54 0-1.1-.92-1.66-1.99-1.75-.77-.09-4.51-.12-5.38-.24-.83.99-1.93 1.41-1.93 2.56zm3.57-14.64c-1.13 0-2.88.62-2.88 3.39 0 1.75.89 4.1 3.15 4.1 1.72 0 2.85-1.43 2.85-3.48 0-2.56-1.31-4.01-3.12-4.01zm.87-20.54c-.32-.15-.68-.29-1.04-.29-.53 0-.86.36-1.16.77-.39.53-.71 1.04-.95 1.48v5.76c0 1.22.45 1.61 1.93 1.61h1.13v.56h-7.04v-.56c1.52-.03 1.99-.65 1.99-2.23V9.27l-1.99-.72v-.5l3.39-1.19h.6v3.15h.06c1.48-2.44 1.84-3 2.82-3 .36 0 .45.03 1.01.27.3.12.83.24 1.54.44l-.71 1.79a5.47 5.47 0 0 1-1.58-.48zm-7.56 29.04c0 1.93-1.61 3.39-3.68 3.39-.56 0-.98-.09-1.31-.21-.32-.09-.56-.18-.8-.18-.18 0-.35.12-.5.36h-.45l-.32-3.33h.47c.36 1.78 1.49 2.8 2.83 2.8 1.19 0 2.11-.9 2.11-1.96 0-.63-.15-1.01-.95-1.82-2.11-2.11-4.46-2.32-4.46-4.78 0-1.96 1.54-3.33 3.8-3.33.8 0 1.63.18 2.38.48l.06 2.7h-.5c-.21-1.52-1.19-2.47-2.38-2.47-.98 0-1.81.68-1.81 1.66-.01 2.61 5.51 3.06 5.51 6.69zm-9.79-25.44c0 3.09 2.17 5.17 4.51 5.17 1.49 0 2.65-.59 3.78-1.93l.33.36c-1.25 1.58-3.12 3.06-5.29 3.06-2.91 0-5.17-2.65-5.17-6.09 0-3.15 2.11-6.36 5.73-6.36 4.01 0 3.92 2.88 4.9 3.86v.68h-8.68c-.05.45-.11.86-.11 1.25zm6.3-2.02c-.33-1.93-1.51-3.21-2.94-3.21-.98 0-2.46.45-3.15 3.21h6.09zm-10.33-.74-4.1 9.33h-.86l-4.31-9.86c-.45-1.04-.83-1.4-1.31-1.49l-.92-.15v-.54h6.06v.54c-1.81.06-2.38.29-1.67 1.69l3.15 7.4 3.03-6.86c.54-1.22.27-2.08-1.9-2.23v-.54h5.17v.54c-1.12.2-1.77.86-2.34 2.17zm-11.01 9.06h-6.6v-.56c1.81 0 2.47-.6 2.47-2.17v-5.97c0-1.16-.15-1.31-.92-1.46l-1.4-.27v-.48l3.86-1.34h.45v9.98c0 1.04.56 1.7 2.14 1.7v.57zM40.46 2.26c-.72 0-1.28-.51-1.28-1.13 0-.63.57-1.13 1.28-1.13.71 0 1.31.5 1.31 1.13 0 .62-.6 1.13-1.31 1.13zM29.98 18.37c.86-.03 1.36-.24 1.69-.57.56-.57.62-2.74.62-6.69 0-2.38-1.16-3.12-2.35-3.12-.95 0-2.4.83-3.95 1.9v6.45c0 1.63.39 2.02 1.99 2.02v.56h-5.97v-.56c1.31 0 1.99-.72 1.99-1.87v-6.24c0-1.1-.12-1.31-.89-1.46l-1.01-.2v-.48l3.42-1.25H26v2.32c1.99-1.25 3.65-2.35 5.11-2.35 2.02 0 3.18 1.48 3.18 4.45 0 3.95-.21 4.72-.24 5.89-.03.8.44 1.19 1.66 1.19h.65v.56h-6.39v-.55zM19.94 3.74v8.02c0 3.68-2.35 7.64-8.8 7.64-5.67 0-8.59-3.24-8.59-7.49V3.24c0-1.9-.53-2.2-2.56-2.23V.45h7.64v.56h-.26c-1.63 0-2.35.45-2.35 2.17v8.26c0 4.01 2.35 6.42 6.77 6.42 3.36 0 6.78-1.4 6.78-6.44V4.49c0-2.85-.45-3.36-2.91-3.48V.45h6.98v.56c-1.99.03-2.7.83-2.7 2.73zM3.66 41.45c-1.4 0-2.64-2.23-2.64-4.7 0-4.81 5.17-7.79 6.95-7.79.86 0 2.7 1.19 2.7 4.37 0 5.66-5.62 8.12-7.01 8.12zm2.79-11.38c-1.87 0-3.54 3.59-3.54 6.57 0 2.49 1.07 3.71 2.08 3.71 2.38 0 3.77-3.86 3.77-6.6.01-2.08-1-3.68-2.31-3.68zm5.37-.32c.71-.09 1.43-.21 2.17-.39.45-2.44 1.34-4.99 3-6.65 1.04-1.04 2.35-1.6 3.51-1.6 1.16 0 2.11.65 2.11 1.43 0 .47-.36.86-.83.86-.98 0-1.78-1.22-2.64-1.22-1.16 0-2.11 1.31-2.53 3.27l-.8 3.89h2.55l-.3.98h-2.44L14.11 39c-1.16 6.66-4.55 9.03-7.34 9.03-1.25 0-2.29-.62-2.29-1.37 0-.48.48-.89.98-.89 1.1 0 1.69 1.31 2.82 1.31.68 0 1.28-.33 1.81-.86 1.48-1.49 2.05-6.56 2.17-7.28l1.52-8.62h-2.05l.09-.57zm23.44 3.95h-1.1v-.53h8.02v.53c-1.48.09-2.08.6-2.08 1.87v4.13c-2.94 1.52-6.71 1.87-7.96 1.87-6.51 0-9.54-5.02-9.54-9.36 0-4.46 3.12-10.04 10.37-10.04 3.18 0 5.29 1.01 5.91 1.01.27 0 .51-.06.68-.21h.42v4.81h-.59c-.81-3.71-3.33-4.87-6.09-4.87-5.23 0-7.9 4.34-7.9 9.12 0 6.09 4.28 8.79 7.7 8.79 1.37 0 2.88-.3 4.55-1.13v-3.74c-.01-1.69-.61-2.25-2.39-2.25zM43.74 23l-1.34-.15v-.5l3.8-1.22h.44v17.62c0 1.22.57 1.78 1.72 1.78h.51v.57h-6.68v-.57c1.9 0 2.46-.56 2.46-1.99V24.19c.01-.83-.08-1.1-.91-1.19zm6.6 9.87c-.06-.18-.09-.27-.09-.42 0-1.04 2.47-3.45 4.4-3.45.89 0 2.29.42 3.12 1.58.45.62.45 1.01.45 2.55v3.98c0 2.38 0 2.91.77 2.91.32 0 .71-.03 1.45-.65l.15.45c-1.6 1.31-2.44 1.63-2.94 1.63-1.22 0-1.34-1.34-1.37-1.81-2.05 1.69-2.64 1.81-3.45 1.81-1.72 0-2.76-.98-2.76-2.44 0-1.81 1.6-2.44 3.51-2.91.62-.15 1.6-.51 2.64-1.13v-2.35c0-.83 0-1.31-.51-1.9-.38-.48-1.01-.86-1.66-.86-.98 0-1.84.83-1.84 1.45 0 .18.03.3.15.57l-2.02.99zm4.13 3.53c-1.81.74-2.5 1.04-2.5 2.26 0 1.07.86 1.75 1.75 1.75.47 0 .83-.15 2.5-1.31v-3.54c-.56.34-1.03.55-1.75.84zm29.05-1.1c0-4.1 3.33-6.3 6.42-6.3 3.63 0 6.39 2.7 6.39 6.24 0 3.5-2.76 6.21-6.3 6.21-3.69 0-6.51-2.67-6.51-6.15zm10.57.69c0-3.39-2.08-6.27-4.57-6.27-1.96 0-3.78 2.02-3.78 4.58 0 3.6 2.05 6.45 4.61 6.45 1.75-.01 3.74-1.79 3.74-4.76z\" />\n</svg>\n");

/***/ }),

/***/ 6433:
/***/ ((module) => {

module.exports = import("@double-great/remark-lint-alt-text");;

/***/ }),

/***/ 5921:
/***/ ((module) => {

module.exports = import("@mapbox/remark-lint-link-text");;

/***/ }),

/***/ 9742:
/***/ ((module) => {

module.exports = import("ansicolor");;

/***/ }),

/***/ 2845:
/***/ ((module) => {

module.exports = import("base64-arraybuffer");;

/***/ }),

/***/ 7564:
/***/ ((module) => {

module.exports = import("chalk");;

/***/ }),

/***/ 3952:
/***/ ((module) => {

module.exports = import("figures");;

/***/ }),

/***/ 2386:
/***/ ((module) => {

module.exports = import("hash-sum");;

/***/ }),

/***/ 7632:
/***/ ((module) => {

module.exports = import("image-size");;

/***/ }),

/***/ 626:
/***/ ((module) => {

module.exports = import("js-yaml");;

/***/ }),

/***/ 8971:
/***/ ((module) => {

module.exports = import("lodash/cloneDeep.js");;

/***/ }),

/***/ 3908:
/***/ ((module) => {

module.exports = import("lodash/kebabCase.js");;

/***/ }),

/***/ 9659:
/***/ ((module) => {

module.exports = import("lodash/startCase.js");;

/***/ }),

/***/ 4922:
/***/ ((module) => {

module.exports = import("markdown-table");;

/***/ }),

/***/ 2424:
/***/ ((module) => {

module.exports = import("mathjax-full/js/adaptors/liteAdaptor.js");;

/***/ }),

/***/ 4076:
/***/ ((module) => {

module.exports = import("mathjax-full/js/core/MathItem.js");;

/***/ }),

/***/ 4559:
/***/ ((module) => {

module.exports = import("mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js");;

/***/ }),

/***/ 5395:
/***/ ((module) => {

module.exports = import("mathjax-full/js/handlers/html.js");;

/***/ }),

/***/ 4124:
/***/ ((module) => {

module.exports = import("mathjax-full/js/handlers/html/HTMLDocument.js");;

/***/ }),

/***/ 1210:
/***/ ((module) => {

module.exports = import("mathjax-full/js/input/mathml.js");;

/***/ }),

/***/ 7771:
/***/ ((module) => {

module.exports = import("mathjax-full/js/input/tex.js");;

/***/ }),

/***/ 2547:
/***/ ((module) => {

module.exports = import("mathjax-full/js/input/tex/AllPackages.js");;

/***/ }),

/***/ 2338:
/***/ ((module) => {

module.exports = import("mathjax-full/js/mathjax.js");;

/***/ }),

/***/ 1192:
/***/ ((module) => {

module.exports = import("mathjax-full/js/output/svg.js");;

/***/ }),

/***/ 1037:
/***/ ((module) => {

module.exports = import("mdast-util-to-hast");;

/***/ }),

/***/ 6864:
/***/ ((module) => {

module.exports = import("mdast-util-toc");;

/***/ }),

/***/ 3586:
/***/ ((module) => {

module.exports = import("mime");;

/***/ }),

/***/ 6544:
/***/ ((module) => {

module.exports = import("node-fetch");;

/***/ }),

/***/ 5462:
/***/ ((module) => {

module.exports = import("puppeteer");;

/***/ }),

/***/ 1139:
/***/ ((module) => {

module.exports = import("refractor/lib/all.js");;

/***/ }),

/***/ 9847:
/***/ ((module) => {

module.exports = import("rehype-autolink-headings");;

/***/ }),

/***/ 6271:
/***/ ((module) => {

module.exports = import("rehype-document");;

/***/ }),

/***/ 2920:
/***/ ((module) => {

module.exports = import("rehype-format");;

/***/ }),

/***/ 1345:
/***/ ((module) => {

module.exports = import("rehype-parse");;

/***/ }),

/***/ 1871:
/***/ ((module) => {

module.exports = import("rehype-raw");;

/***/ }),

/***/ 7752:
/***/ ((module) => {

module.exports = import("rehype-slug");;

/***/ }),

/***/ 5390:
/***/ ((module) => {

module.exports = import("rehype-stringify");;

/***/ }),

/***/ 7785:
/***/ ((module) => {

module.exports = import("remark-directive");;

/***/ }),

/***/ 222:
/***/ ((module) => {

module.exports = import("remark-frontmatter");;

/***/ }),

/***/ 6809:
/***/ ((module) => {

module.exports = import("remark-gfm");;

/***/ }),

/***/ 6688:
/***/ ((module) => {

module.exports = import("remark-parse");;

/***/ }),

/***/ 2509:
/***/ ((module) => {

module.exports = import("remark-rehype");;

/***/ }),

/***/ 1150:
/***/ ((module) => {

module.exports = import("speech-rule-engine");;

/***/ }),

/***/ 1252:
/***/ ((module) => {

module.exports = import("to-vfile");;

/***/ }),

/***/ 4390:
/***/ ((module) => {

module.exports = import("unified");;

/***/ }),

/***/ 9365:
/***/ ((module) => {

module.exports = import("unist-util-remove");;

/***/ }),

/***/ 6016:
/***/ ((module) => {

module.exports = import("unist-util-visit");;

/***/ }),

/***/ 6107:
/***/ ((module) => {

module.exports = import("vfile");;

/***/ }),

/***/ 2699:
/***/ ((module) => {

module.exports = import("yargs");;

/***/ }),

/***/ 1091:
/***/ ((module) => {

module.exports = import("yargs/helpers");;

/***/ }),

/***/ 4962:
/***/ ((module) => {

module.exports = import("yup");;

/***/ }),

/***/ 2081:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 7310:
/***/ ((module) => {

module.exports = require("url");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(606);
/******/ 	
/******/ })()
;
//# sourceMappingURL=cli.js.map