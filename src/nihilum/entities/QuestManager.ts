export type Quest = {
  id: string;
  description: string;
}

export class QuestManager {
  quests: Quest[];

  constructor() {
    this.quests = [];
  }

  length(): number {
    return this.quests.length;
  }

  getQuestIndex(id: string): number {
    let index = -1;
    this.quests.forEach((quest: Quest, i: number) => { if (quest.id === id) index = i; });
    return index;
  }

  hasQuest(id: string): boolean {
    return this.quests.some((quest: Quest) => quest.id === id);
  }

  pushQuest(id: string, description: string): boolean {
    if (!this.hasQuest(id)) {
      this.quests.push({ id, description });
      return true;
    } else {
      return false;
    }
  }

  removeQuest(id: string): boolean {
    const index = this.getQuestIndex(id);

    if (index >= 0) {
      this.quests.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
}