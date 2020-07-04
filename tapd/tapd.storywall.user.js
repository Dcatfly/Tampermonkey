// ==UserScript==
// @name         优化tapd故事墙
// @namespace    https://github.com/Dcatfly/Tampermonkey.git
// @version      0.2
// @description  1. 在tapd故事墙中添加story预估时间 2. 在故事墙中增加【新需求】与【实现中】的时间统计
// @author       Dcatfly
// @match        https://www.tapd.cn/*/storywalls*
// ==/UserScript==

(function () {
  "use strict";
  const timeCountArr = [
    { label: "新需求", key: "new" },
    { label: "实现中", key: "developing" },
  ];
  window.onload = function () {
    document.querySelectorAll("#resource_table > tbody > tr").forEach((tr) => {
      const user = tr.querySelector("td.charge > div > ul");
      const stories = tr.querySelectorAll("li[story_id]");
      Promise.all(
        Array.from(stories).map((li) => {
          const storyId = li.getAttribute("story_id");
          const type = li.getAttribute("transition");
          const url = `https://www.tapd.cn/${_workspace_id}/prong/entity_preview/story_preview_data?id=${storyId}&from=iteration_storywall`;
          return fetch(url)
            .then((rep) => rep.json())
            .then((data) => {
              if (data.code === 200) {
                const title = li.querySelector(".note_head");
                const effort = data.data.story.effort;

                const span = document.createElement("span");
                span.append(`${effort}人时`);

                title.style.display = "flex";
                title.style.justifyContent = "space-between";
                title.append(span);

                return { [type]: Number(effort) };
              }
            });
        })
      ).then((times) => {
        const timeCounts = times.reduce((pre, next) => {
          Object.keys(next).forEach((key) => {
            pre[key] = (pre[key] || 0) + next[key];
          });
          return pre;
        }, {});
        timeCountArr.forEach(({ label, key }) => {
          const timeCount = timeCounts[key];
          if (timeCount) {
            const li = document.createElement("li");
            li.style.overflow = "unset";
            li.append(`${label}: ${timeCount}人时`);
            user.append(li);
          }
        });
      });
    });
  };
})();
