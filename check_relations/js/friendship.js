const ME = "_user_";
let text = {};

const bla = document.getElementById("blabla");
const btnSubmit = document.getElementById("submit");
const res = document.getElementById("res");

/**
 * Analyse de la donnée entré par l'utilisateur
 * 3 types de phrases peuvent être entré (hors séparateur)
 * - `<nom1> est ami(e) avec <nom2>`
 * - `je suis ami avec <nom2>`
 * - `<nom1> est ami(e) avec moi`
 *
 * renvoie 2 noms ("me" pour "moi/je") en tableau
 * @param {array} userInput
 * @return {array}
 */
const friendShipsBuilder = (tabUserEntry) => {
  let friendShips = [];
  for (let index = 0; index < tabUserEntry.length - 2; index++) {
    const sentence = tabUserEntry[index];
    const arr = sentence.split(" ");
    const name1 = arr[0].toLowerCase() === "je" ? ME : arr[0].toLowerCase();
    const name2 =
      arr[arr.length - 1].toLowerCase() === "moi"
        ? ME
        : arr[arr.length - 1].toLowerCase();
    friendShips.push([name1, name2]);
  }
  return friendShips;
};

btnSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  res.innerText = "";
  const tabUserEntry = bla.value.split("\n");
  let friendShips = friendShipsBuilder(tabUserEntry);
  let groupedfriendShips = [];
  const question = tabUserEntry.pop();

  const tab1 = checkRelations(friendShips);
  groupedfriendShips = checkRelations(tab1);

  console.log(groupedfriendShips);

  const nameToFind = question.split(" ")[2].toLowerCase();
  let isMyFriend = false;
  groupedfriendShips.forEach((relation) => {
    if (relation.includes(nameToFind) && relation.includes(ME)) {
      isMyFriend = true;
    }
  });

  res.innerText = isMyFriend ? "vrai" : "faux";
});

function checkRelations(friendShips) {
  let groupedfriendShips = [];
  friendShips.forEach((relation, index) => {
    friendShips.forEach((rel2, index2) => {
      if (!relation.every((el) => rel2.includes(el))) {
        let rel = false;
        if (relation.some((el) => rel2.includes(el))) {
          groupedfriendShips.push(Array.from(new Set(relation.concat(rel2))));
        } else {
          groupedfriendShips.push(relation);
        }
      }
    });
  });

  return Array.from(new Set(groupedfriendShips));
}
