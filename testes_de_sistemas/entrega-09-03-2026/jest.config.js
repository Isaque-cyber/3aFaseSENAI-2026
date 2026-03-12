export default {
    "reporters": [
  "default",
  ["jest-html-reporters", {
    "publicPath": "./html-report",
    "filename": "report.html",
    "openReport": true
  }]
]
}