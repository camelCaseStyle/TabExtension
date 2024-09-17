let tabs = await chrome.tabs.query({
    url: [
        "https://*/*"
    ]
});


const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

const template = document.getElementById("li_template");
const elements = new Set();
for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);
  const title = tab.title.split("-")[0].trim();
  const pathName = new URL(tab.url).pathname;
  element.querySelector(".pathname").textContent = pathName;
  element.querySelector(".title").textContent = title;
  element.querySelector("a").addEventListener("click", async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });
  console.log(tab.title, new Date(tab.lastAccessed))
  elements.add(element);
}
document.querySelector("ul").append(...elements);

const button = document.querySelector("button");
button.addEventListener("click", async () => {
    tabs = await chrome.tabs.query({
        url: [
            "https://*/*"
        ]
    });
    const sortedTabs = tabs.sort((a,b)=>{
        return a.lastAccessed - b.lastAccessed;
    }).map(({ id })=> id)
    await chrome.tabs.remove(sortedTabs[0])
});
