class Dictionary {
  constructor() {
    this.baseURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  }

  async search(word) {
    if (typeof word !== "string" || !word || word === ".")
      throw new Error("Invalid input is passed");
    try {
      this.clearResult();
      const res = await fetch(this.baseURL + word);
      const data = await res.json();
      if (res.status === 200) {
        data.forEach((startele, wid) => {
          this.createResult("Word", startele.word);
          this.createResult("Origin", startele.origin || "No origin");
          this.createPhonetics(startele.phonetics, wid);
          this.createMeaning(startele.meanings);
          document.querySelector(".result").style = "border-color:green";
        });
      } else if (res.status === 404) {
        this.createResult("Error - ", data.title);
        document.querySelector(".result").style = "border-color:red";
      }
    } catch (err) {
      this.createResult("Error - ", err);
      document.querySelector(".result").style = "border-color:red";
      console.log(err);
    }
  }

  clearResult() {
    document.querySelector(".result").classList.remove("inactive");
    document.querySelector(".result").innerHTML = "";
  }
  createResult(title, data) {
    let className = title.toLowerCase();
    if (!data) {
      return;
    }
    document.querySelector(".result").innerHTML += `
    <div class=${className}>
    <span class="content">${data}</span></div>
    `;
    // <span class="title">${title}</span>
  }

  createMeaning(meanings) {
    meanings.forEach((meaning) => {
      this.createResult("partOfSpeech", meaning.partOfSpeech);
      this.display(meaning.definitions);
    });
  }
  display(def) {
    def.forEach((definit, index) => {
      this.createResult("definition", `${index + 1}. ${definit.definition}`);
      this.createResult("Example", definit.example);
      this.createResult("Similar", definit.synonyms.join(" - "));
      this.createResult("Opposite", definit["antonyms"].join(" - "));
    });
    //   console.log(def);
  }
  createPhonetics(phonetics, wid) {
    phonetics.forEach((phonetic, pid) => {
      const div = document.createElement("div");
      div.innerHTML = `<div>${phonetic.text}</div>`;
      div.className = "phonetic";
      if (!phonetic.audio) {
        return;
      }
      let id = `audio-${wid}${pid}`;
      div.innerHTML += `<img src="image/speaker.png" onclick="play('${id}')" alt="" />
      <audio id=${id} src=${phonetic.audio}></audio>`;
      document.querySelector(".result").append(div);
    });
  }

  iterate(arr) {
    for (let ele in arr) {
      if (Array.isArray(arr[ele])) {
        this.iterate(arr[ele]);
        continue;
      } else if (typeof arr[ele] === "object") {
        this.iterate(arr[ele]);
        continue;
      }
      console.log(typeof arr[ele], ele, arr[ele]);
    }
  }
}

const dict = new Dictionary();
const input = document.querySelector("#search-input");
let form = document.querySelector("form");
form.onsubmit = () => {
  dict.search(input.value);
  return false;
};

function play(id) {
  document.querySelector(`#${id}`).play();
}
