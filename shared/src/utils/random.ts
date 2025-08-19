/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
export function shuffleArray<T extends Array<unknown>>(array: T): T {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

export function simpleHashSeededCoinFlip(seed: string) {
  // Simple hash function to turn a string into a boolean coin flip
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return hash % 2 === 0
}