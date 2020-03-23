// ==UserScript==
// @name         去除限制tapd文档
// @namespace    https://github.com/Dcatfly/Tampermonkey.git
// @version      0.1
// @description  去除tapd文档上不能选中（select）的限制
// @author       Dcatfly
// @match        https://www.tapd.cn/*/documents/*
// ==/UserScript==

(function() {
  "use strict";
  document.querySelectorAll("*").forEach(function(node) {
    if (node.style.userSelect) {
      node.style.userSelect = "unset";
    }
  });
})();
