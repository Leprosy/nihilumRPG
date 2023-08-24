import { QuestManager } from "../src/helpers/QuestManager";

test("Test quest manager", () => {
  const QM = new QuestManager();
  // push a quest
  expect(QM.length()).toBe(0);
  expect(QM.pushQuest("oaw", "crap")).toBe(true);
  expect(QM.length()).toBe(1);

  // just one quest id at a time
  expect(QM.pushQuest("oaw", "crap")).toBe(false);
  expect(QM.length()).toBe(1);

  // check quest added
  expect(QM.hasQuest("oaw")).toBe(true);
  expect(QM.hasQuest("oaw2")).toBe(false);

  // add another, get indexes
  expect(QM.pushQuest("oaw2", "another crap")).toBe(true);
  expect(QM.hasQuest("oaw2")).toBe(true);
  expect(QM.getQuestIndex("oaw")).toBe(0);
  expect(QM.getQuestIndex("oaw2")).toBe(1);
  expect(QM.getQuestIndex("oaw3")).toBe(-1);
  expect(QM.length()).toBe(2);

  // remove quests
  expect(QM.hasQuest("oaw2")).toBe(true);
  expect(QM.removeQuest("oaw2")).toBe(true);
  expect(QM.hasQuest("oaw2")).toBe(false);
  expect(QM.length()).toBe(1);
  expect(QM.removeQuest("oaw2")).toBe(false);
});
