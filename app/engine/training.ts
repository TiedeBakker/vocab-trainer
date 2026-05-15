export type BaseWord = {
    nl: string;
    en: string;
};

export type TrainingWord = BaseWord & {
    correct: number;
    required: number;
};

export function initTraining(words: BaseWord[]): TrainingWord[] {
    return words.map((w) => ({
        ...w,
        correct: 0,
        required: 3,
    }));
}

export function isCorrect(word: BaseWord, input: string) {
    return word.en.toLowerCase() === input.toLowerCase();
}

export function updateTrainingWords(
    words: TrainingWord[],
    currentWord: TrainingWord,
    correct: boolean
): TrainingWord[] {
    return words
        .map((w) => {
            if (w.nl !== currentWord.nl) return w;

            if (correct) {
                return { ...w, correct: w.correct + 1 };
            }

            return {
                ...w,
                required: Math.min(w.required + 1, 5),
            };
        })
        .filter((w) => w.correct < w.required);
}

export function getRandomWord(words: TrainingWord[]) {
    const index = Math.floor(Math.random() * words.length);
    return words[index];
}