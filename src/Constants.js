const SIMILARITY_THRESHOLD = 0.78;

const MAX_GRAPH_DEPTH = 2;
const MAX_CITATION = 1;
const MAX_REFERENCES = 1;

const TEN_MILLISECONDS = 10;

const MAX_POPUP_TEXT_LENGTH = 500;

const FIELD_OF_STUDY_COLOR = {
  Medicine: "rgba(43, 213, 20, 0.8)",
  Chemistry: "rgba(37, 152, 170, 0.8)",
  Economics: "rgba(230, 236, 39, 0.8)",
  "Materials Science": "rgba(193, 168, 116, 0.8)",
  Philosophy: "rgba(220, 84, 207, 0.8)",
  "Computer Science": "rgba(255, 0, 0, 0.8)",
  Geology: "rgba(126, 98, 40, 0.8)",
  Psychology: "rgba(255, 46, 46, 0.8)",
  Art: "rgba(121, 242, 210, 0.8)",
  History: "rgba(255, 218, 46, 0.8)",
  Geography: "rgba(27, 218, 46, 0.8)",
  "Political Science": "rgba(221, 39, 236, 0.8)",
  Sociology: "rgba(224, 101, 251, 0.8)",
  Business: "rgba(243, 255, 7, 0.8)",
  Biology: "rgba(52, 224, 89, 0.8)",
  Education: "rgba(3, 41, 166, 0.8)",
  Mathematics: "rgba(44, 21, 101, 0.8)",
  "Environmental Science": "rgba(21, 112, 49, 0.8)",
  Engineering: "rgba(219, 112, 49, 0.8)",
  Physics: "rgba(53, 109, 96, 0.8)",
  Law: "rgba(53, 99, 255, 0.8)",
  Linguistics: "rgba(245, 40, 145, 0.8)",
  "Missing Color": "rgba(255, 255, 255, 0.6)",
  "Agricultural": "rgba(3, 184, 58, 0.8)",
};

export {
  SIMILARITY_THRESHOLD,
  MAX_GRAPH_DEPTH,
  MAX_CITATION,
  MAX_REFERENCES,
  TEN_MILLISECONDS,
  MAX_POPUP_TEXT_LENGTH,
  FIELD_OF_STUDY_COLOR,
};
