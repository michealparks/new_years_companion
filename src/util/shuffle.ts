export const shuffle = <Type>(arr: Type[]): Type[] => {
  return arr.sort(() => Math.random() - 0.5)
}
