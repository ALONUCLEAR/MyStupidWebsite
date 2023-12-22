/**Returns a random integer between min(inclusive) and max(exclusive) 
 * @param max the exclusive upper end of the random range - default 0
 * @param min the inclusive lower end of the random range - default 1
*/
export const random = (min: number = 0, max: number = 1) => Math.floor(Math.random() * (max - min) + min - 0.01);

/**Gets an array and return a random element of given array */
export const randomElement = <T = any>(array: T[]): T => {
    return array[random(0, array.length)];
}