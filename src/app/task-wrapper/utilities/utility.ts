export class UTILITY {
  public static GenerateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public static IsSimilarArray(array1: string[], array2: string[]): boolean {
    return (array1.length === array2.length) && (array1.every(val => array2.includes(val)));
  }
}
